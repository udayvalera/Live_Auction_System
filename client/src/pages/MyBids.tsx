import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bidService } from "@/services/bidService"; // Adjust path
import { IBid } from "@/types/bid"; // Adjust path
import { calculateTimeLeft, formatEndedDate, getBidStatus } from "@/utils/dateUtils"; // Adjust path
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an Auth context to get user ID


// Define the structure needed by the component's rendering logic
interface IMappedBid {
    id: string; // Bid ID
    auctionId: string;
    auctionTitle: string;
    bidAmount: number;
    currentHighestBid: number;
    status: 'winning' | 'outbid' | 'won' | 'lost' | 'ended' | 'unknown'; // Possible statuses
    timeLeft: string;
    image: string;
    endedDate?: string; // Only if status is 'lost' or 'won'
}

// --- Tabs Definition --- (Adjust based on the statuses you want to filter by)
const TABS = [
  { id: 'all', label: 'All Bids' },
  { id: 'winning', label: 'Winning' },
  { id: 'outbid', label: 'Outbid' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' }
];

const DEFAULT_IMAGE = "/placeholder.svg"; // Define your default placeholder

const MyBids = () => {
    // Use the mapped bid type for state
    const [bids, setBids] = useState<IMappedBid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Add error state
    const [activeTab, setActiveTab] = useState(TABS[0].id); // Default to 'all'
    const { user } = useAuth(); // Get user info (assuming it has user.id)

    useEffect(() => {
        const fetchMyBids = async () => {
            // Preserving your check for user.id
            if (!user?.id) {
                //setError("You must be logged in to view your bids."); // You can uncomment this if needed
                setLoading(false); // Stop loading if no user
                setBids([]); // Clear bids if user logs out
                setError(null); // Clear error too
                return;
            }

            setLoading(true);
            setError(null); // Reset error on new fetch

            try {
                const response = await bidService.getMyBids();

                // --- *** FIX APPLIED HERE *** ---
                // Access the array using the correct key 'bids' based on backend response
                const bidsArray: IBid[] = response.bids;

                // Add a check to ensure bidsArray is actually an array before mapping
                if (!Array.isArray(bidsArray)) {
                     console.error("API response for bids did not contain a 'bids' array:", response);
                     // Throw an error that will be caught by the catch block
                     throw new Error("Invalid data format received from server.");
                }
                // --- *** END FIX *** ---

                // Map the API data (IBid) to the component's expected structure (IMappedBid)
                // Now mapping the validated 'bidsArray'
                const mappedData: IMappedBid[] = bidsArray.map((bid: IBid) => {
                    // Basic safety check for populated auction data
                    const auctionData = typeof bid.auction === 'object' ? bid.auction : null;
                    // Preserving your use of user.id
                    const currentStatus = getBidStatus(bid, user.id); // Determine status

                    return {
                        id: bid._id,
                        auctionId: auctionData?._id ?? 'N/A',
                        auctionTitle: auctionData?.title ?? 'Auction Title Unavailable',
                        bidAmount: bid.amount,
                        currentHighestBid: auctionData?.currentBid ?? 0,
                        status: currentStatus,
                        timeLeft: calculateTimeLeft(auctionData?.endTime),
                        image: auctionData?.imageUrl || DEFAULT_IMAGE,
                        endedDate: (currentStatus === 'lost' || currentStatus === 'won')
                                    ? formatEndedDate(auctionData?.endTime)
                                    : undefined,
                    };
                });

                setBids(mappedData);

            } catch (err) {
                console.error("Failed to fetch bids:", err); // Log the actual error
                 // Check if err is an instance of Error before accessing message
                 const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                // Set a more informative error message, preserving your original style
                setError(`Could not load your bids. ${errorMessage === "Invalid data format received from server." ? errorMessage : "Please try again later."}`);
                setBids([]); // Clear bids on error
            } finally {
                setLoading(false);
            }
        };

        fetchMyBids();
    }, [user]); // Re-fetch when the user changes (login/logout) - Preserving dependency

    // Filter bids based on active tab - Preserving this logic
    const filteredBids = activeTab === 'all'
        ? bids
        : bids.filter(bid => bid.status === activeTab);

    // --- Render Logic (Preserving your JSX structure) ---

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>My Bids</h1>
                    <p className="mt-1 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Track your bidding activity across all auctions</p>
                </div>

                {/* --- Tabs --- */}
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                             {TABS.map((tab) => (
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

                {/* --- Loading State --- */}
                {loading && (
                    <div className="space-y-4 animate-fade-in">
                        {Array(3).fill(0).map((_, index) => (
                            // Skeleton Loader (keep as is)
                            <div key={index} className="bg-white p-6 rounded-lg shadow animate-skeleton-pulse">
                                {/* ... skeleton structure ... */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-md"></div>
                                  <div className="flex-1">
                                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                      <div className="flex justify-between">
                                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        ))}
                    </div>
                )}

                 {/* --- Error State --- */}
                 {!loading && error && (
                     <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow animate-fade-in">
                         <div className="flex">
                             <div className="flex-shrink-0">
                                 {/* Optional: Add an error icon */}
                                 <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                 </svg>
                             </div>
                             <div className="ml-3">
                                 <p className="text-sm text-red-700">{error}</p>
                             </div>
                         </div>
                     </div>
                 )}

                {/* --- Empty State (No Bids Found) --- */}
                {!loading && !error && filteredBids.length === 0 && (
                    <div className="bg-white p-12 rounded-lg shadow text-center animate-fade-in">
                        <p className="text-gray-500">
                            {activeTab === 'all' ? "You haven't placed any bids yet." : `No bids found in the '${activeTab}' category.`}
                        </p>
                        <Link to="/">
                            <Button variant="outline" className="mt-4">Browse Auctions</Button>
                        </Link>
                    </div>
                )}

                {/* --- Bids List --- */}
                {!loading && !error && filteredBids.length > 0 && (
                    <div className="space-y-4">
                        {filteredBids.map((bid, index) => (
                            <div
                                key={bid.id} // Use the actual bid ID
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow animate-fade-in-up"
                                style={{ animationDelay: `${0.1 + index * 0.05}s` }} // Adjusted delay slightly
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="relative w-full sm:w-32 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={bid.image}
                                            alt={bid.auctionTitle}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} // Fallback for broken images
                                        />
                                        {(bid.status === 'lost' || bid.status === 'won') && ( // Show overlay for any ended status
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                <span className="text-white font-medium text-sm uppercase">
                                                    {bid.status === 'won' ? 'Won' : 'Ended'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bid Details */}
                                    <div className="flex-1">
                                        <Link to={`/auction/${bid.auctionId}`}>
                                            <h3 className="text-lg font-medium text-gray-900 hover:text-auction-purple">{bid.auctionTitle}</h3>
                                        </Link>
                                        <div className="mt-1 flex flex-col md:flex-row justify-between md:items-start">
                                            {/* Left side info */}
                                            <div>
                                                <p className="text-sm text-gray-500">Your bid: <span className="font-medium text-gray-900">${bid.bidAmount.toLocaleString()}</span></p>
                                                <p className="text-sm text-gray-500">
                                                    {bid.status === 'lost' || bid.status === 'won' ? 'Final price:' : 'Current highest:'}
                                                    <span className="font-medium text-gray-900"> ${bid.currentHighestBid.toLocaleString()}</span>
                                                </p>
                                                {(bid.status === 'lost' || bid.status === 'won') && bid.endedDate && (
                                                    <p className="text-sm text-gray-500">Ended on: <span className="font-medium">{bid.endedDate}</span></p>
                                                )}
                                            </div>
                                            {/* Right side status/time */}
                                            <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ // Added capitalize
                                                    bid.status === 'winning' || bid.status === 'won'
                                                        ? 'bg-green-100 text-green-800'
                                                        : bid.status === 'outbid' || bid.status === 'lost'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800' // For unknown/ended?
                                                }`}>
                                                    {bid.status}
                                                </span>
                                                {bid.status !== 'lost' && bid.status !== 'won' && bid.status !== 'ended' && (
                                                    <span className="text-sm text-gray-500 mt-1">{bid.timeLeft}</span>
                                                )}
                                            </div>
                                        </div>
                                         {/* Action Buttons */}
                                        <div className="mt-4 flex gap-3">
                                            <Link to={`/auction/${bid.auctionId}`}>
                                                <Button variant="default" size="sm">
                                                    View Auction
                                                </Button>
                                            </Link>
                                            {/* Show Place New Bid button only if active and outbid */}
                                            {bid.status === 'outbid' && (
                                                <Link to={`/auction/${bid.auctionId}?action=bid`}> {/* Optional: Add query param to focus bid input */}
                                                    <Button variant="outline" size="sm">
                                                        Place New Bid
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer (keep as is) */}
            <footer className="bg-white mt-16 border-t border-gray-200">
                {/* ... footer content ... */}
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AuctionVerse. All rights reserved.</p> {/* Dynamic year */}
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

export default MyBids;