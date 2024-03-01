"use client";

import React from "react";
import Link from "next/link"; // Assuming you're using react-router for navigation
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_URL, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const wallets = useMemo(
    () => [new PhantomWalletAdapter({ network })],
    [network]
  );

  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <nav
          className="bg-black text-white shadow-lg"
          style={{ fontFamily: "MyUnderwood, sans-serif" }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link href="/" className="flex items-center py-4">
                    <span className="font-semibold text-lg">tA</span>
                  </Link>
                </div>
              </div>
              {/* Hide key icon on small screens and show on medium screens and above */}
              <div className="pt-2">
                <WalletMultiButtonDynamic />
              </div>

              {/* This seems to be a duplicate link/button for the key icon, you might want to remove or adjust it as well */}
              <div className="hidden sm:block">
                <Link
                  href="https://www.tradersanonymous.net/"
                  className="block text-lg px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  &#128477;{" "}
                  {/* If this is the key icon, consider removing or hiding it on small screens */}
                </Link>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  className="outline-none mobile-menu-button"
                  onClick={toggleMenu}
                >
                  <svg
                    className="w-6 h-6 text-gray-500 hover:text-green-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} mobile-menu`}>
            <ul className="">
              {/* Adjust or remove this if it's not needed for your mobile menu */}
              <li>
                <Link
                  href="/"
                  className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  &#128477;{" "}
                  {/* Consider adjusting this part for your mobile menu */}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default Navbar;
