import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";


export default function Navbar() {


    return (
        <div className="h-[100px] w-[100%] shadow-md flex justify-around">
            <nav>
                <ul className="flex h-[100%] justify-around w-[400px] items-center">
                <li><Link href="#">Home</Link></li>
                <li>About</li>
                <li>Doc</li>
                </ul>
            </nav>
            <div className="w-[200px] flex justify-around items-center">
                <Button className="rounded-lg ">
                    <Link href="/auth/signup">Signup</Link>
                </Button>
               <Button>
                <Link href="/auth/signin">
                Signin
                </Link>
                </Button> 
            </div>
        </div>
    )
}