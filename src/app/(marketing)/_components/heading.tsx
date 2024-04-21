"use client"
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

export const Heading = () => {
    const [loading, setLoading] = useState(false);
    // const { isAuthenticated } = useAuth();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // const user = useSelector((state) => state.auth.user.user);

    console.log("auth on heading : ", isAuthenticated);
    // console.log("user : ", user.username);
    const handleEnterJotion = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }
    return (

        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plans. Unified. Welcome to <span className="underline">Notion</span>
            </h1>

            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Notion is the connected workspace where <br />
                better, faster work happens.
            </h3>

            {/* <Button className="text-white" style={{ backgroundColor: loading ? 'transparent' : '#4D5257' }} variant="ghost" size="sm" onClick={handleEnterJotion}>
                <span>Enter Notion</span>
                {loading &&(
                    <div className="absolute right-0 top-0 mt-1 mr-1">
                        <Spinner />
                    </div>
                )}
                {!loading ? null : (
                    <div className="absolute right-0 top-0 mt-1 mr-1">
                        <ArrowRight />
                    </div>
                )}
                
            </Button> */}
            {/* <Button className="text-white relative" style={{ backgroundColor: loading ? 'transparent' : '#4D5257' }} variant="ghost" size="sm" onClick={handleEnterJotion}>
        <span>Enter Notion</span>
        {loading && (
            <div className="absolute right-0 top-0 mt-1 mr-1">
                <Spinner />
            </div>
        )}
        {!loading && (
            <div className="absolute right-0 top-0 mt-1 mr-1">
                <ArrowRight />
            </div>
        )}
    </Button> */}
            {/* <Button className="text-white" style={{ backgroundColor: loading ? 'transparent' : '#4D5257' }} variant="ghost" size="sm" onClick={handleEnterJotion}> */}
            {/* {!isAuthenticated && !loading && (
                    <Button>
                        Get Jotion free
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                )} */}

            {isAuthenticated && (
                <Button asChild>
                    <Link href={"/routes/profile"}>
                        <span>Enter Notion</span>
                        <ArrowRight />
                    </Link>
                </Button>
            )}

            {!isAuthenticated && (
                <Button asChild>
                    <Link href={"/auth/login"}>
                        <span>Get Free Notion</span>
                        <ArrowRight />
                    </Link>
                </Button>
            )}
        </div>
    )
}
