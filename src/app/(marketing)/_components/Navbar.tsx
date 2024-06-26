"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux_store/slices/authSlice";
import { UserProfile } from "./userProfile";
// import { useAuth } from "@/app/auth/utils/authContext";

export const Navbar = () => {

    // redux persist

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user.user);
    

    console.log("auth : ", isAuthenticated);
    // console.log(user.username);
   
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    // const [user, setUser] = useState(null);

    const handleGetNotionFree = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const scrolled = useScrollTop();
    const navigate = useRouter()
    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {!isAuthenticated && <Link href={"/auth/login"}> Login </Link>}
                {isAuthenticated &&
                    (<>
                        <span>{user.username}</span>
                        <button onClick={()=>{dispatch(logout())}}>Logout</button>
                    </>

                    )}

                <Button className="text-white" style={{ backgroundColor: loading ? 'transparent' : '#4D5257' }} variant="ghost" size="sm" onClick={handleGetNotionFree}>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <span>Get Notion Free</span>
                    )}
                </Button>
                
                <ModeToggle />
                <ToastContainer />
                
            </div>
            <div>
            {isAuthenticated && <UserProfile />}
            </div>
        </div>
        
    )
}