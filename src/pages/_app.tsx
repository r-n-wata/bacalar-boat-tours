import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      {" "}
      {/* ✅ wrap your app here */}
      <Component {...pageProps} />;
    </SessionProvider>
  );
}
