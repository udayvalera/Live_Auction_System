
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { users, User } from "@/data/adminData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Ban, Gavel, Lock, ShoppingBag, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminUsers = () => {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
  );

  const handleToggleUserStatus = (id: string) => {
    setUsersList(
      usersList.map((user) => {
        if (user.id === id) {
          const newStatus = user.status === 'active' ? 'banned' : 'active';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
    
    const user = usersList.find(u => u.id === id);
    const newStatus = user?.status === 'active' ? 'banned' : 'active';
    
    toast({
      title: `User ${newStatus === 'active' ? 'unbanned' : 'banned'}`,
      description: `User ${user?.name} has been ${newStatus === 'active' ? 'unbanned' : 'banned'}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage all users on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Total of {usersList.length} users on the platform.
          </CardDescription>
          <div className="pt-2">
            <Input
              placeholder="Search users by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'}`
                      }>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.registeredDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.lastLogin.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Gavel className="h-3 w-3" />
                          <span>{user.totalBids} bids</span>
                        </div>
                        <span className="mx-1">•</span>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          <span>{user.totalAuctions} auctions</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost"
                            size="sm"
                            className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                          >
                            {user.status === 'active' ? (
                              <span className="flex items-center gap-1">
                                <Ban className="h-4 w-4" />
                                Ban
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <UserCheck className="h-4 w-4" />
                                Unban
                              </span>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {user.status === 'active' ? 'Ban User' : 'Unban User'}
                            </DialogTitle>
                            <DialogDescription>
                              {user.status === 'active' 
                                ? `Are you sure you want to ban ${user.name}? They will no longer be able to bid or create auctions.`
                                : `Are you sure you want to unban ${user.name}? They will be able to use the platform again.`
                              }
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                variant={user.status === 'active' ? 'destructive' : 'default'}
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === 'active' ? 'Ban User' : 'Unban User'}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
