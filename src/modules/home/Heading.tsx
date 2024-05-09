"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/modules/hooks";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Heading = () => {
  const { user } = useCurrentUser();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Notion</span>
      </h1>

      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where <br />
        better, faster work happens.
      </h3>

      {user && (
        <Button asChild>
          <Link href={"/page"}>
            <span>Enter Notion</span>
            <ArrowRight />
          </Link>
        </Button>
      )}

      {!user && (
        <Button asChild>
          <Link href={"/auth/login"}>
            <span>Get Free Notion</span>
            <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Heading;
