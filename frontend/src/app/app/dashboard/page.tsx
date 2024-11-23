"use client"
import React from "react";
import { Card, CardContent,CardFooter,CardHeader } from "../../../components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useSWR from "swr";

const fetcher = url => axios.get(url).then(res => res.data)

export default function DashboardMain() {
  const { data, error } = useSWR("https://jsonplaceholder.typicode.com/posts/1", fetcher);

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  if (!data) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          {data.title}
        </CardHeader>
      </Card>
    </div>
  );
}
