"use client";

import { Footer, Navbar } from "@/modules/home";
import React from "react";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="container space-y-10">{children}</main>
      <Footer />
    </>
  );
};
export default MarketingLayout;
