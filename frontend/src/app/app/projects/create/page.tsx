"use client"
import React from "react";
import { Card,CardContent,CardTitle,CardFooter,CardHeader,CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
export default function createPojectPage() {
    
    return(
        <div className="flex justify-center h-[100%]">
        <Card className="w-[700px] shadow-md h-[700px]">
           <CardHeader>
            <CardDescription>
            <label>Name of Project</label>
               <Input className="rounded-md w-44"/>
            </CardDescription>
            </CardHeader>
        </Card>
        </div>
    )
}