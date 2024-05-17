"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import "./globals.css";

import { ModalProvider } from "@/components/providers/modal-provider";
import { fontHandwriting, fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { persistor, store } from "@/store/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Logo } from "@/components/icons";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>JetBrain</title>
      </head>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
          fontHandwriting.variable,
          "min-h-screen scroll-smooth font-sans antialiased selection:bg-foreground selection:text-background"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="jotion-theme-2"
        >
          <Provider store={store}>
            <Toaster position="top-center" />
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
            <ModalProvider />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
