import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";
import dynamic from "next/dynamic";

const Navbar = () => {
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
                  {/* Website Logo */}
                  <Link to="/" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-lg">uploadanon</span>
                  </Link>
                </div>
                {/* Primary Navbar items */}
              </div>
              {/* Secondary Navbar Items */}
              <div className="hidden md:flex items-center space-x-3 ">
                <WalletMultiButtonDynamic />
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button className="outline-none mobile-menu-button">
                  <svg
                    className=" w-6 h-6 text-gray-500 hover:text-green-500 "
                    x-show="!showMenu"
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
          {/* Mobile menu */}
          <div className="hidden mobile-menu">
            <ul className="">
              <li>
                <Link
                  to="/"
                  className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300"
                >
                  Contact
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
