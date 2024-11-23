import React from "react";
import { Card, CardContent,CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User,Edit} from "lucide-react";

export default function Profile() {
    const name = {
        name:"shawan"
    }
    return(
       <Card className="h-[160px] w-[160px] rounded-full">
        <CardContent>
            <User/>
        </CardContent>
       </Card>
    )
}