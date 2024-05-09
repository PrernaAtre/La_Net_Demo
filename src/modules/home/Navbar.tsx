"use client";
import Modal from "@/components/modals/Modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/modules/hooks/useCurrentUser";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useLogout } from "../auth/logout/hooks";
import { ProfileForm } from "../user/profile";
import Logo from "./Logo";

const Navbar = () => {
  const { user } = useCurrentUser();
  const { logout } = useLogout();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="mt-3 h-14">
      <nav className="container flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex gap-2 px-4 font-handwriting text-xl lowercase [text-shadow:_0_2px_0_#e1e1e1] dark:[text-shadow:none]"
        >
          <Logo />
          JetBrain
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <Avatar alt="Remy Sharp" src={user?.profile_image} />
              <span className="hidden md:inline-block">{user?.name}</span>
            </button>
            <Modal
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
            >
              <ProfileForm />
            </Modal>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 justify-end gap-2">
            <Link
              href="/auth/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden h-8 rounded-full px-5 font-semibold transition-all duration-200 hover:ring-2 hover:ring-border hover:ring-offset-2 hover:ring-offset-background sm:inline-flex"
              )}
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants(),
                "h-8 rounded-full px-3 font-semibold transition-all duration-200 hover:ring-2 hover:ring-foreground hover:ring-offset-2 hover:ring-offset-background"
              )}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
