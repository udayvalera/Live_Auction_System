
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { auctions, Auction } from "@/data/auctions";
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
import { Ban, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminAuctions = () => {
  const [auctionsList, setAuctionsList] = useState<Auction[]>(auctions);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredAuctions = auctionsList.filter(
    (auction) =>
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.id.includes(searchTerm)
  );

  const handleRemoveAuction = (id: string) => {
    setAuctionsList(auctionsList.filter((auction) => auction.id !== id));
    toast({
      title: "Auction removed",
      description: `Auction #${id} has been removed from the platform.`,
    });
  };

  const handleStopBidding = (id: string) => {
    setAuctionsList(
      auctionsList.map((auction) => {
        if (auction.id === id && (auction.status === 'active' || auction.status === 'ending-soon')) {
          return { ...auction, status: 'ended' };
        }
        return auction;
      })
    );
    toast({
      title: "Bidding stopped",
      description: `Bidding has been stopped for auction #${id}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Auctions</h1>
        <p className="text-muted-foreground">
          View and manage all auctions on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Auctions</CardTitle>
          <CardDescription>
            Total of {auctionsList.length} auctions on the platform.
          </CardDescription>
          <div className="pt-2">
            <Input
              placeholder="Search auctions by title, seller or ID..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-medium">{auction.id}</TableCell>
                    <TableCell>{auction.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${auction.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : auction.status === 'ending-soon' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : auction.status === 'ended' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'}`
                      }>
                        {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{auction.seller.name}</TableCell>
                    <TableCell>${auction.currentBid}</TableCell>
                    <TableCell>{auction.bidCount}</TableCell>
                    <TableCell>
                      {auction.endTime.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/auction/${auction.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>

                        {(auction.status === 'active' || auction.status === 'ending-soon') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Ban className="h-4 w-4 text-orange-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Stop Bidding</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to stop bidding for this auction? This will mark the auction as ended.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button variant="destructive" onClick={() => handleStopBidding(auction.id)}>
                                    Stop Bidding
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove Auction</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to remove this auction? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button variant="destructive" onClick={() => handleRemoveAuction(auction.id)}>
                                  Remove
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
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

export default AdminAuctions;
