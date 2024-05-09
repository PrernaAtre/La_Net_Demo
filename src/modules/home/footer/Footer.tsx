import Link from "next/link";
import Logo from "../Logo";
import { ThemeToggleGroup } from "./theme-toggle-group";

const Footer = () => {
  return (
    <footer className="border-t py-5">
      <div className="mx-auto w-full max-w-none px-5 text-sm sm:max-w-[90%] sm:px-0 2xl:max-w-7xl">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] items-stretch justify-between gap-y-10 sm:gap-x-6 md:flex md:flex-wrap">
          <div className="col-span-full flex items-center justify-between gap-4 md:flex-col">
            <Link
              href="/"
              className="flex gap-2 font-handwriting text-xl lowercase [text-shadow:_0_2px_0_#e1e1e1] dark:[text-shadow:none]"
            >
              <Logo />
              JetBrain
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between lg:mt-3">
          <p className="mt-4 text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} JetBrain</span>{" "}
          </p>

          <ThemeToggleGroup />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
