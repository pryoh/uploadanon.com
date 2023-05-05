import Head from "next/head";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { MetaplexProvider } from "../MetaplexProvider";
import { MintNFTs } from "../MintNFTs";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import{
  AiOutlineTwitter,
} from 'react-icons/ai';
import {
  SiDiscord
} from 'react-icons/si';
import {
  IoStorefrontSharp
} from 'react-icons/io5';
import collection from '../public/collection.png';

export default function Home() {
  const network = useState(WalletAdapterNetwork.Mainnet);
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_URL, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );


  const ButtonWrapper = dynamic(() =>
    import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton)
  );


  return (
    <div>
      <Head>
        <title>Traders Anonymous</title>
        <meta name="description" content="TA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black px-10 font-Underwood text-white">
         <ConnectionProvider
            endpoint={endpoint}
            config={{ commitment: "confirmed" }}
          >
            <WalletProvider
              wallets={wallets}
              autoConnect
            >
              <WalletModalProvider>
                <MetaplexProvider>
                  <section className="min-h-screen">
                    <nav className="py-5 mb-4 flex justify-between items-center">
                      <h1 className="text-xl font-bold">tA</h1>
                      <ul className="flex items-center text-xl">
                        <li className="px-2"> <MintNFTs /> </li>
                        <li className="px-2"> <ButtonWrapper /> </li>
                      </ul>
                    </nav>

                    <div className="text-center pt-10">
                      <h2 className="text-5xl py-2">Welcome to Traders Anonymous</h2>
                      <h3 className="text-2xl py-2">Upload day has arrived...</h3>
                    </div>

                    <div className="mx-auto">
                      <Image src={collection} />
                    </div>

                    <div className="text-center">
                      <p className="text-md pb-6">Your ticket is your key. Do you choose to sacrifice?</p>
                    </div>

                    <div className="text-4xl flex justify-center gap-16">
                      <a href="https://twitter.com/TradersAnonNFT" target="_blank" rel="noreferrer noopener" >
                        <AiOutlineTwitter/>
                      </a>
                      <a href="https://magiceden.io/marketplace/traders_anonymous_tickets" target="_blank" rel="noreferrer noopener">
                        <IoStorefrontSharp />
                      </a>
                      <a href="https://discord.gg/egcH4Gnn" target="_blank" rel="noreferrer noopener">
                        <SiDiscord />
                      </a>
                    </div>
                </section>
              </MetaplexProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </main>
    </div>
  );
}