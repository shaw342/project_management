"use client"
import { Card,CardContent,CardHeader } from "@/components/ui/card";
import { Table,TableBody,TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {

    const receive = {
        FirstName :"Shawan",
        LastName : "Barua"
    }

    return(
        <div className="flex flex-col w-[100%]">
            <Card className="h-[300px] w-[500px]">
                <CardHeader>

                </CardHeader>
            </Card>

            <Card className="h-[500px] w-[1500px]">
                <Table>
                <TableHeader>
                   <TableRow> 
                     <TableHead>Name</TableHead>
                     <TableHead>Function</TableHead>
                     <TableHead>Task</TableHead>
                     <TableHead>Contact</TableHead>
                    </TableRow>       
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>{receive.FirstName}  {receive.LastName}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>{receive.FirstName}  {receive.LastName}</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </Card>
        </div>
          
    )
}