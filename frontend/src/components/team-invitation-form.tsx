'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";



interface User {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export default function TeamInvitationForm() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);

  // Function to search users
  const searchUsers = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    // Simulate network delay
    const delay = query.length === 1 ? 500 : 200;
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const result = await axios.get(`http://localhost:8080/api/v1/search?q=${encodeURIComponent(query)}`);
      console.log('API result:', result.data);

      // Map API users to match the User interface
      const apiUsers = result.data.map((user: any) => ({
        user_id: user.user_id,
        firstName: user.firstName || user.email.split('@')[0], // Fallback to email prefix if no firstName
        lastName: user.lastName || '',
        email: user.email,
        avatar: "/placeholder.svg?height=40&width=40",
      }));

      // Filter mock data
    
      // Combine and remove duplicates
      const combinedResults = [...apiUsers];
      const uniqueResults = Array.from(
        new Map(combinedResults.map((user) => [user.email, user])).values()
      );

      setSuggestions(uniqueResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch search results.",
        variant: "destructive",
      });
      // Fallback to mock data
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300); // Debounce time

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSuggestions([]);
  };

  // Handle invitation
  const handleInvite = async () => {
    if (!selectedUser) return;

    setIsInviting(true);

    try {
      await axios.post('http://localhost:8080/api/v1/invite', {
        team_id: 1, // Replace with dynamic team ID
        email: selectedUser.email,
      });

      setIsInviting(false);
      setInvitationSent(true);

      toast({
        title: "Invitation Sent",
        description: `${selectedUser.firstName} ${selectedUser.lastName} has been invited to your team.`,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedUser(null);
        setInvitationSent(false);
      }, 3000);
    } catch (error) {
      console.error('Invitation error:', error);
      setIsInviting(false);
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Invite to Team</CardTitle>
        <CardDescription>Search for people and invite them to your team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isInviting || invitationSent}
            />
            {isSearching && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {suggestions.length > 0 && searchQuery && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
              <ul className="py-2 max-h-60 overflow-auto">
                {suggestions.map((user) => (
                  <li
                    key={user.user_id}
                    className="px-2 py-1.5 hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} />
                  <AvatarFallback>{selectedUser.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <Badge variant="outline">Member</Badge>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleInvite} disabled={!selectedUser || isInviting || invitationSent}>
          {isInviting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Invitation...
            </span>
          ) : invitationSent ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Invitation Sent
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite to Team
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}