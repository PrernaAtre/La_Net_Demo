"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import "./globals.css";

import { persistor, store } from "@/redux_store/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
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
