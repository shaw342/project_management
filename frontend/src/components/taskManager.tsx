import { Card,CardContent,CardDescription,CardHeader } from "@/components/ui/card";

export default function TaskManager(){
    return(
        <div className="w-[1000px]">
            <Card className="w-[1000px] h-[1000px]">
                <CardHeader>
                    hello world
                </CardHeader>
                <CardContent>
                    <div>
                        Content
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}