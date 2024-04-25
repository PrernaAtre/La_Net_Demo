"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@mui/material/Avatar';
import { logout } from "@/redux_store/slices/authSlice";
import EditIcon from '@mui/icons-material/Edit';
import ProfileModal, { UserProfile } from "./userProfile";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserProfileModal from "./userProfile/userProfile";
// import { useAuth } from "@/app/auth/utils/authContext";

export const Navbar = () => {

    // redux persist

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user.user);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);



    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Dispatch logout action
        dispatch(logout());
    };
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

                <Button className="text-white" style={{ backgroundColor: loading ? 'transparent' : '#4D5257' }} variant="ghost" size="sm" onClick={handleGetNotionFree}>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <span>Get Notion Free</span>
                    )}
                </Button>

                <ModeToggle />
                <ToastContainer />
                {
                    (
                        <div className="dropdown dropdown-end" ref={dropdownRef}>
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                                onClick={handleProfileClick}
                            >
                                <div className="w-10 rounded-full">
                                    {
                                        isAuthenticated &&
                                        <Avatar alt="Remy Sharp" src={user.profile_image} />
                                    }
                                    {
                                        !isAuthenticated &&
                                        <AccountCircleIcon />
                                    }
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <ul
                                    tabIndex={0}
                                    className="mt-3 z-[1] p-2 absolute ml-[-30px] shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                                >
                                    <Link href={`/routes/`}>
                                        <span>{document.title}</span>
                                    </Link>


                                    {!isAuthenticated && <Link href={"/auth/login"}> Login </Link>}
                                    {isAuthenticated && <button onClick={() => { dispatch(logout()) }}>Logout</button>}
                                    {
                                        isAuthenticated && <li>
                                            <EditIcon className="w-10" />
                                            <button onClick={() => setIsProfileModalOpen(true)}>Edit</button>
                                        </li>
                                    }


                                </ul>
                            )}
                        </div>

                    )
                }

                <UserProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                />
            </div>
            <div>

            </div>

        </div>

    )
}