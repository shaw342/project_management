"use client"
import {Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { Card,CardContent,CardFooter, CardHeader } from "@/components/ui/card";
import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { send } from "process";
import { log } from "console";
import axios from "axios";

export default function ComfirmeMail() {
    const [code,setCode] = useState("")


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value } = e.target
        setCode(value)
    }

    console.log('====================================');
    console.log(code);
    console.log('====================================');
    const email = getCookie("email") as string | undefined

    axios.post("http://localhost:8080/api/",email)
    .then(res => {

    }).catch(res =>{
        console.log('====================================');
        console.log(res);
        console.log('====================================');
    })
    

    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault()
        axios.post("http://localhost:8080/api/v1/register",code)
        .then(res =>{
            console.log('====================================');
            console.log(res.data);
            console.log('====================================');
        }).catch(err =>{
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        })
    }
    
    return(
        <div className="flex justify-center items-center h-[100vh]">
            <Card className="w-[400px] h-[200px] items-center">
                <form onSubmit={handleSubmit}>
                <CardHeader>
                <Label htmlFor="verify email">your verification code</Label>
                </CardHeader>
                <CardContent>
                    <Input onChange={handleChange}>

                    </Input>
                </CardContent>
                <CardFooter>
                <Button type="submit" onClick={handleSubmit}>
                    send
                    <Send/>
                </Button>
                </CardFooter>
                </form>
            </Card>
        </div>
    )
}