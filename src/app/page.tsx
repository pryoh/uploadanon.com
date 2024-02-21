"use client";

import Image from "next/image";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  base58PublicKey,
  generateSigner,
  Option,
  PublicKey,
  publicKey,
  SolAmount,
  some,
  transactionBuilder,
  Umi,
  unwrapOption,
} from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  mplCandyMachine,
  fetchCandyMachine,
  mintV2,
  safeFetchCandyGuard,
  DefaultGuardSetMintArgs,
  DefaultGuardSet,
  SolPayment,
  CandyMachine,
  CandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { AiOutlineTwitter } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { SiDiscord } from "react-icons/si";

export default function Home() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_URL, []);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter({ network })],
    [network]
  );

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  // set up umi
  // set up umi
  let umi: Umi;
  if (endpoint) {
    umi = createUmi(endpoint).use(mplTokenMetadata()).use(mplCandyMachine());
  } else {
    throw new Error("Endpoint is undefined. Cannot initialize Umi.");
  }

  // state
  const [loading, setLoading] = useState(false);
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
  const [mintMsg, setMintMsg] = useState<string>();
  const [costInSol, setCostInSol] = useState<number>(0);
  const [cmv3v2, setCandyMachine] = useState<CandyMachine>();
  const [defaultCandyGuardSet, setDefaultCandyGuardSet] =
    useState<CandyGuard<DefaultGuardSet>>();
  const [countTotal, setCountTotal] = useState<number>();
  const [countRemaining, setCountRemaining] = useState<number>();
  const [countMinted, setCountMinted] = useState<number>();
  const [mintDisabled, setMintDisabled] = useState<boolean>(true);

  // retrieve item counts to determine availability and
  // from the solPayment, display cost on the Mint button
  const retrieveAvailability = useCallback(async () => {
    const cmId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;
    if (!cmId) {
      setMintMsg("No candy machine ID found. Add environment variable.");
      return;
    }
    const candyMachine = await fetchCandyMachine(umi, publicKey(cmId));
    setCandyMachine(candyMachine);

    // Get counts
    setCountTotal(candyMachine.itemsLoaded);
    setCountMinted(Number(candyMachine.itemsRedeemed));
    const remaining =
      candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed);
    setCountRemaining(remaining);

    // Get cost
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );
    if (candyGuard) {
      setDefaultCandyGuardSet(candyGuard);
    }
    const defaultGuards = candyGuard?.guards;
    const solPaymentGuard = defaultGuards?.solPayment;

    if (solPaymentGuard) {
      const solPayment = unwrapOption(solPaymentGuard);
      if (solPayment) {
        const lamports = solPayment.lamports;
        const solCost = Number(lamports.basisPoints) / 1000000000;
        setCostInSol(solCost);
      }
    }

    if (remaining > 0) {
      setMintDisabled(false);
    }
  }, [umi]); // Add any external dependencies used inside `retrieveAvailability` here

  useEffect(() => {
    retrieveAvailability();
  }, [retrieveAvailability]); // Now `retrieveAvailability` is a dependency, but it's memoized with `useCallback`

  // Inner Mint component to handle showing the Mint button,
  // and mint messages
  const Mint = () => {
    const wallet = useWallet();
    umi = umi.use(walletAdapterIdentity(wallet));

    // check wallet balance
    const checkWalletBalance = async () => {
      const balance: SolAmount = await umi.rpc.getBalance(
        umi.identity.publicKey
      );
      if (Number(balance.basisPoints) / 1000000000 < costInSol) {
        setMintMsg("Add more SOL to your wallet.");
        setMintDisabled(true);
      } else {
        if (countRemaining !== undefined && countRemaining > 0) {
          setMintDisabled(false);
        }
      }
    };

    if (!wallet.connected) {
      return <p>Please connect your wallet.</p>;
    }

    checkWalletBalance();

    const mintBtnHandler = async () => {
      if (!cmv3v2 || !defaultCandyGuardSet) {
        setMintMsg(
          "There was an error fetching the candy machine. Try refreshing your browser window."
        );
        return;
      }
      setLoading(true);
      setMintMsg(undefined);

      try {
        const candyMachine = cmv3v2;
        const candyGuard = defaultCandyGuardSet;

        const nftSigner = generateSigner(umi);

        const mintArgs: Partial<DefaultGuardSetMintArgs> = {};

        // solPayment has mintArgs
        const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
        const solPaymentGuard: Option<SolPayment> | undefined =
          defaultGuards?.solPayment;
        if (solPaymentGuard) {
          const solPayment: SolPayment | null = unwrapOption(solPaymentGuard);
          if (solPayment) {
            const treasury = solPayment.destination;

            mintArgs.solPayment = some({
              destination: treasury,
            });
          }
        }

        const tx = transactionBuilder()
          .add(setComputeUnitLimit(umi, { units: 600_000 }))
          .add(
            mintV2(umi, {
              candyMachine: candyMachine.publicKey,
              collectionMint: candyMachine.collectionMint,
              collectionUpdateAuthority: candyMachine.authority,
              nftMint: nftSigner,
              candyGuard: candyGuard?.publicKey,
              mintArgs: mintArgs,
              tokenStandard: TokenStandard.ProgrammableNonFungible,
            })
          );

        const { signature } = await tx.sendAndConfirm(umi, {
          confirm: { commitment: "finalized" },
          send: {
            skipPreflight: true,
          },
        });

        setMintCreated(nftSigner.publicKey);
        setMintMsg("Mint was successful!");
      } catch (err: any) {
        console.error(err);
        setMintMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mintCreated) {
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://solscan.io/token/${mintCreated.toString()}${
            network === "mainnet-beta" ? "?cluster=mainnet-beta" : ""
          }`}
        >
          {/* Content */}
        </a>
      );
    }

    return (
      <>
        <button onClick={mintBtnHandler} disabled={mintDisabled || loading}>
          MINT
          <br />({costInSol} SOL)
        </button>
        {loading && <div>. . .</div>}
      </>
    );
  }; // </Mint>

  return (
    <Router>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <main
            className="min-h-screen bg-black text-white"
            style={{ fontFamily: "MyUnderwood, sans-serif" }}
          >
            <Navbar />
            <div className="container mx-auto px-4">
              <div className="bg-black shadow rounded-lg p-8">
                <h1 className="text-2xl font-bold text-white text-center">
                  upload into the network...
                </h1>
                <p className="mt-4 text-white text-center">
                  do you choose to sacrifice?
                </p>
              </div>
              <div className="grid place-items-center">
                <div className="shadow-glow">
                  <Image
                    src="/preview.gif"
                    alt="Preview of NFTs"
                    width={300}
                    height={300}
                    priority
                  />
                </div>

                <div className="text-center py-4">
                  <div>
                    Minted: {countMinted} / {countTotal}
                  </div>
                  <div>Remaining: {countRemaining}</div>
                </div>
                <Mint />
                {mintMsg && (
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setMintMsg(undefined);
                      }}
                    >
                      &times;
                    </button>
                    <span>{mintMsg}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-md pt-12 pb-6">
                    Your ticket is your key...
                  </p>
                </div>

                <div className="text-2xl lg:text-4xl flex justify-center gap-16 ">
                  <a
                    href="https://twitter.com/ta_worId"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <AiOutlineTwitter />
                  </a>
                  <a
                    href="https://magiceden.io/marketplace/traders_anonymous_tickets"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <IoStorefrontSharp />
                  </a>
                  <a
                    href="https://discord.gg/egcH4Gnn"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <SiDiscord />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </Router>
  );
}
