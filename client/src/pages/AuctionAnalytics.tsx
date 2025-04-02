
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import Header from '@/components/Header';
import { useToast } from "@/components/ui/use-toast";

// Dummy data for the auction
const getDummyAuction = (id: string) => ({
  id,
  title: "Vintage Record Collection",
  description: "Collection of rare vinyl records from the 1960s and 1970s.",
  currentBid: 380,
  startingBid: 200,
  totalBids: 7,
  viewCount: 156,
  uniqueViewers: 89,
  watchCount: 23,
  endDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
  createdDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
  status: "active",
  image: "/placeholder.svg",
  bidHistory: [
    { id: "bid1", bidder: "user1", bidderName: "Alex Johnson", amount: 200, date: new Date(Date.now() - 86400000 * 4) },
    { id: "bid2", bidder: "user2", bidderName: "Sam Smith", amount: 250, date: new Date(Date.now() - 86400000 * 3) },
    { id: "bid3", bidder: "user3", bidderName: "Taylor Wong", amount: 275, date: new Date(Date.now() - 86400000 * 2) },
    { id: "bid4", bidder: "user1", bidderName: "Alex Johnson", amount: 300, date: new Date(Date.now() - 86400000 * 1) },
    { id: "bid5", bidder: "user4", bidderName: "Jordan Miller", amount: 325, date: new Date(Date.now() - 36000000) },
    { id: "bid6", bidder: "user2", bidderName: "Sam Smith", amount: 350, date: new Date(Date.now() - 14400000) },
    { id: "bid7", bidder: "user1", bidderName: "Alex Johnson", amount: 380, date: new Date(Date.now() - 3600000) }
  ],
  viewsOverTime: [
    { date: '6/1', views: 12 },
    { date: '6/2', views: 19 },
    { date: '6/3', views: 15 },
    { date: '6/4', views: 22 },
    { date: '6/5', views: 18 },
    { date: '6/6', views: 29 },
    { date: '6/7', views: 41 }
  ],
  trafficSources: [
    { name: 'Direct', value: 45 },
    { name: 'Search', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Other', value: 10 }
  ]
});

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const AuctionAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<ReturnType<typeof getDummyAuction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call to fetch auction data
    const timer = setTimeout(() => {
      if (id) {
        setAuction(getDummyAuction(id));
      }
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleDeleteAuction = () => {
    // Simulate deleting the auction
    toast({
      title: "Auction deleted",
      description: "The auction has been successfully deleted.",
    });
    navigate('/my-auctions');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-skeleton-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow h-32"></div>
              <div className="bg-white p-6 rounded-lg shadow h-32"></div>
              <div className="bg-white p-6 rounded-lg shadow h-32"></div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow h-80"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Auction not found</h1>
            <p className="mt-2 text-gray-500">The auction you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button 
              onClick={() => navigate('/my-auctions')} 
              className="mt-4"
            >
              Back to My Auctions
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate('/my-auctions')} 
                variant="ghost" 
                size="sm" 
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Auctions
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{auction.title}</h1>
            <p className="mt-1 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Analytics and performance metrics</p>
          </div>
          <div className="flex space-x-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="outline" onClick={() => navigate(`/auction/${auction.id}`)}>
              View Listing
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Auction
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your auction
                    and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAuction}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'bids', label: 'Bid History' },
                { id: 'traffic', label: 'Traffic' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-auction-purple text-auction-purple'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">Current Bid</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">${auction.currentBid}</div>
                <div className="mt-1 text-sm text-gray-500">Starting at ${auction.startingBid}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">Total Bids</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{auction.totalBids}</div>
                <div className="mt-1 text-sm text-green-500">
                  {auction.totalBids > 0 
                    ? `Last bid ${new Date(auction.bidHistory[auction.bidHistory.length - 1].date).toLocaleDateString()}`
                    : 'No bids yet'}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-500">Page Views</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{auction.viewCount}</div>
                <div className="mt-1 text-sm text-gray-500">{auction.uniqueViewers} unique visitors</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Listing Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={auction.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" name="Page Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Auction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">{auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Created On</dt>
                      <dd className="text-sm text-gray-900">{formatDate(auction.createdDate)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Ends On</dt>
                      <dd className="text-sm text-gray-900">{formatDate(auction.endDate)}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Starting Bid</dt>
                      <dd className="text-sm text-gray-900">${auction.startingBid}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Current Bid</dt>
                      <dd className="text-sm text-gray-900">${auction.currentBid}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Watchers</dt>
                      <dd className="text-sm text-gray-900">{auction.watchCount}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bids' && (
          <div className="bg-white rounded-lg shadow overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bid History</h3>
              {auction.bidHistory.length === 0 ? (
                <p className="text-gray-500">No bids have been placed on this auction yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bidder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...auction.bidHistory].reverse().map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium">{bid.bidderName}</TableCell>
                        <TableCell>${bid.amount}</TableCell>
                        <TableCell>{formatDate(bid.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'traffic' && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
              <div className="flex flex-col md:flex-row items-center justify-center">
                <div className="w-full md:w-1/2 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={auction.trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {auction.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="space-y-4">
                    {auction.trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{source.name}</div>
                          <div className="text-sm text-gray-500">{source.value} visitors</div>
                        </div>
                        <div className="text-sm font-medium">{Math.round(source.value / auction.viewCount * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visitor Engagement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Total Views</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">{auction.viewCount}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Unique Visitors</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">{auction.uniqueViewers}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Watchlist Adds</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">{auction.watchCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2023 AuctionVerse. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-auction-purple">Terms</a>
              <a href="#" className="text-gray-500 hover:text-auction-purple">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-auction-purple">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuctionAnalytics;
