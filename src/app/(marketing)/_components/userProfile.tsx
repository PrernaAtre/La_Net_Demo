"use client"
import { logout } from '@/redux_store/slices/authSlice';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export const UserProfile = () => {
    const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
    console.log(isAuthenticated);
    const dispatch = useDispatch()
    const user = useSelector((state:any) => state.auth.user.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Dispatch logout action
        dispatch(logout());
    };
    return (
        <>
        {
                isAuthenticated && (
                    <div className="dropdown dropdown-end" ref={dropdownRef}>
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                            onClick={handleProfileClick}
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Profile"
                                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                />
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <ul
                                tabIndex={0}
                                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <a className="justify-between">Profile</a>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        )}
                    </div>
                )
            }
        </>
    )
}
