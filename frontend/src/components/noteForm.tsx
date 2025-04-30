"use client"

import { useState } from "react"
import { Card,CardContent,CardDescription, CardFooter, CardHeader } from "./ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"



export default function NoteForm() {


    return (
        <div>
            <Card className="w-[500px] h-[500px]">
                <CardHeader >
                    <span>Note</span>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" placeholder="note name"/>
                    </div>
                    <div>
                        <Label htmlFor="content">content</Label>
                        <Textarea placeholder="decribe your note" className="h-60"/>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button>Save</Button>
                </CardFooter>
            </Card>
        </div>
    )
}