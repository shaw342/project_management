"use client"
import DashboardDemo from "@/components/dashboard";
import { Card,CardContent,CardHeader } from "@/components/ui/card";
import { Table,TableBody,TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function Dashboard() {



    return(
        <div className="w-[100%]">
          <DashboardDemo/>
        </div>
    )
}