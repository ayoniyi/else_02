import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TransitionProvider } from "@/context/TransitionContext";

export default function App({ Component, pageProps, router }: AppProps) {
  // const router = useRouter();
  return (
    <>
      <AnimatePresence mode="wait">
        <Component key={router.route} {...pageProps} />
      </AnimatePresence>
    </>
  );
}
