"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { SentInvitation } from "./sent-invitations-list"

interface SentInvitationCardProps {
  invitation: SentInvitation
}

export function SentInvitationCard({ invitation }: SentInvitationCardProps) { 
  let date = new Date(invitation.timestamp)

  const formattedDate = date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          badgeVariant: "outline" as const,
          badgeText: "En attente",
          borderColor: "border-yellow-400",
        }
      case "accepted":
        return {
          badgeVariant: "default" as const,
          badgeText: "Acceptée",
          borderColor: "border-green-500",
        }
      case "declined":
        return {
          badgeVariant: "destructive" as const,
          badgeText: "Déclinée",
          borderColor: "border-red-500",
        }
      default:
        return {
          badgeVariant: "outline" as const,
          badgeText: "Inconnu",
          borderColor: "border-gray-300",
        }
    }
  }

  const { badgeVariant, badgeText, borderColor } = getStatusDetails(invitation.status)

  return (
    <Card className={`transition-all duration-200 border-l-4 ${borderColor}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{invitation.team_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant}>{badgeText}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={invitation.recipient_avatar || "/placeholder.svg"} alt={invitation.recipient_email} />
            <AvatarFallback>{invitation.recipient_email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div>
              <span className="font-medium">{invitation.recipient_email}</span>
              <span className="text-sm text-muted-foreground ml-2">({invitation.recipient_email})</span>
            </div>
            <p className="text-sm">{invitation.message}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-muted-foreground">Invitation envoyée il y a {formattedDate}</div>
      </CardFooter>
    </Card>
  )
}
