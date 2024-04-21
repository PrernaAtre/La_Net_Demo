"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Provider } from "react-redux";

import { AuthProvider } from "../app/auth/utils/authContext"
import { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux_store/store";
// import { persistor, store } from "@/redux_store/store";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="jotion-theme-2"
        >
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
