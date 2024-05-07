"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/modules/hooks/useCurrentUser";
import { removeCurrentUser } from "@/store/features/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfileModal from "../user/profile/ProfileModal";
import { Logo } from "./Logo";

export const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useCurrentUser();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [loading, setLoading] = useState(false);

  const handleGetNotionFree = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const scrolled = useScrollTop();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] top-0 flex items-center w-full p-4 sticky",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <Button
          className="text-white"
          style={{ backgroundColor: loading ? "transparent" : "#4D5257" }}
          variant="ghost"
          size="sm"
          onClick={handleGetNotionFree}
        >
          {loading ? <Spinner /> : <span>Get Notion Free</span>}
        </Button>

        <ModeToggle />
        <ToastContainer />
        {
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={handleProfileClick}
            >
              <div className="w-10 rounded-full">
                {user && <Avatar alt="Remy Sharp" src={user?.profile_image} />}
                {!user && <AccountCircleIcon />}
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

                {!user && <Link href={"/auth/login"}> Login </Link>}
                {user && (
                  <button
                    onClick={() => {
                      dispatch(removeCurrentUser());
                    }}
                  >
                    Logout
                  </button>
                )}
                {user && (
                  <li>
                    <EditIcon className="w-10" />
                    <button onClick={() => setIsProfileModalOpen(true)}>
                      Edit
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        }

        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </div>
  );
};
