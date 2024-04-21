"use client"

import React, { useEffect } from "react";
import { Navbar } from "./_components/Navbar";
import { Provider } from "react-redux";
// import store from '../../Store/index'

const MarketingLayout = ({
    children
}:{
    children: React.ReactNode
}) =>{
   
    return(
     
        <div className="h-full  dark:bg-[#1F1F1F]">
            <Navbar />
            <main className="h-full pt-40">
                {children}
            </main>
        </div>
    )
}
export default MarketingLayout;