import React from "react";
import { Card, CardContent,CardHeader } from "@/components/ui/card";

export default function Profile() {
    const name = {
        name:"shawan"
    }
    return(
       <Card>
        <CardHeader>
            Profile: {name.name}
        </CardHeader>
        <CardContent>
            
        </CardContent>
       </Card> 
    )
}