
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { auctions } from "@/data/auctions";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Generate random bid history data for an auction
const generateBidHistory = (auctionId: string, numBids: number) => {
  const bidHistory = [];
  const now = new Date();
  const startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7); // 7 days ago
  
  const timeIncrement = (now.getTime() - startDate.getTime()) / numBids;
  let currentBid = 100; // Starting bid
  
  for (let i = 0; i < numBids; i++) {
    const bidTime = new Date(startDate.getTime() + timeIncrement * i);
    currentBid += Math.floor(Math.random() * 50) + 10; // Random bid increment
    
    bidHistory.push({
      time: bidTime.toISOString(),
      formattedTime: `${bidTime.getMonth() + 1}/${bidTime.getDate()} ${bidTime.getHours()}:${String(bidTime.getMinutes()).padStart(2, '0')}`,
      amount: currentBid,
      userId: `user${Math.floor(Math.random() * 10) + 1}`,
      userName: `Bidder ${Math.floor(Math.random() * 10) + 1}`,
    });
  }
  
  return bidHistory;
};

// Generate random page views data for an auction
const generatePageViews = (auctionId: string) => {
  const viewsData = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - 1000 * 60 * 60 * 24 * i);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    
    viewsData.push({
      date: formattedDate,
      views: Math.floor(Math.random() * 50) + 10,
    });
  }
  
  return viewsData;
};

// Generate random user demographics data for an auction
const generateUserDemographics = () => {
  return [
    { name: "18-24", value: Math.floor(Math.random() * 20) + 5 },
    { name: "25-34", value: Math.floor(Math.random() * 25) + 15 },
    { name: "35-44", value: Math.floor(Math.random() * 20) + 10 },
    { name: "45-54", value: Math.floor(Math.random() * 15) + 5 },
    { name: "55+", value: Math.floor(Math.random() * 10) + 5 },
  ];
};

// Generate traffic source data for an auction
const generateTrafficSources = () => {
  return [
    { name: "Direct", value: Math.floor(Math.random() * 40) + 20 },
    { name: "Social", value: Math.floor(Math.random() * 30) + 10 },
    { name: "Search", value: Math.floor(Math.random() * 25) + 5 },
    { name: "Referral", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Email", value: Math.floor(Math.random() * 15) + 5 },
  ];
};

// Generate top bidders data for an auction
const generateTopBidders = () => {
  const bidders = [];
  
  for (let i = 0; i < 5; i++) {
    bidders.push({
      id: `user${i + 1}`,
      name: `Bidder ${i + 1}`,
      bids: Math.floor(Math.random() * 10) + 1,
      totalAmount: Math.floor(Math.random() * 1000) + 200,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
    });
  }
  
  return bidders.sort((a, b) => b.bids - a.bids);
};

const AdminAuctionAnalytics = () => {
  const [selectedAuction, setSelectedAuction] = useState(auctions[0].id);
  const { toast } = useToast();
  
  const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#F2FCE2"];
  
  const selectedAuctionData = auctions.find(auction => auction.id === selectedAuction);
  const bidHistory = generateBidHistory(selectedAuction, selectedAuctionData?.bidCount || 10);
  const pageViews = generatePageViews(selectedAuction);
  const userDemographics = generateUserDemographics();
  const trafficSources = generateTrafficSources();
  const topBidders = generateTopBidders();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Auction Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics for each auction.
        </p>
      </div>
      
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
        <Select value={selectedAuction} onValueChange={setSelectedAuction}>
          <SelectTrigger className="md:w-[350px]">
            <SelectValue placeholder="Select an auction" />
          </SelectTrigger>
          <SelectContent>
            {auctions.map(auction => (
              <SelectItem key={auction.id} value={auction.id}>
                {auction.title} (ID: {auction.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedAuctionData && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Bid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${selectedAuctionData.currentBid}</div>
              <p className="text-xs text-muted-foreground">
                Starting bid: ${selectedAuctionData.startingBid}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedAuctionData.bidCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedAuctionData.views}</div>
              <p className="text-xs text-muted-foreground">
                {selectedAuctionData.likes} likes
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bid History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
            <CardDescription>
              Timeline of bids placed on this auction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer 
                config={{ 
                  bidAmount: {
                    label: "Bid Amount",
                    color: "#9b87f5",
                  }
                }}
                className="h-full"
              >
                <LineChart data={bidHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedTime" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="bidAmount"
                    stroke="#9b87f5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Page Views */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer 
                config={{ 
                  views: {
                    label: "Views",
                    color: "#7E69AB",
                  }
                }}
                className="h-full"
              >
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="views"
                    name="views"
                    fill="#7E69AB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* User Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDemographics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Bidders */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Bidders</CardTitle>
            <CardDescription>
              Most active bidders on this auction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Number of Bids</TableHead>
                    <TableHead>Total Bid Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topBidders.map((bidder) => (
                    <TableRow key={bidder.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={bidder.avatar} alt={bidder.name} />
                            <AvatarFallback>{bidder.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{bidder.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{bidder.bids}</TableCell>
                      <TableCell>${bidder.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuctionAnalytics;
