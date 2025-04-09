import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

// Import the service and the accurate types
import { auctionService } from '@/services/auctionService'; // Adjust path if needed
import { IAuction, IUserLite, IAuctionDocument } from '@/types/auction'; // Adjust path & ensure IUserLite/IAuctionDocument are exported if needed elsewhere, though not directly rendered here
import { AxiosError } from "axios";

// Define the type for the active tab based on UI
type ActiveTab = 'all' | 'active' | 'ended' | 'draft'; // Keep UI tabs for now

const MyAuctions = () => {
  // State for auctions, loading, error, and active tab
  const [auctions, setAuctions] = useState<IAuction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('active');

  // Fetch user's auctions on component mount
  useEffect(() => {
    const fetchMyAuctions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call the service function (getMyAuctions assumed to fetch for the logged-in user)
        const response = await auctionService.getMyAuctions(); // Fetches IApiListResponse<IAuction>

        // No extra date processing needed here if API returns valid ISO strings
        // The formatting function will handle parsing
        setAuctions(response.data);

      } catch (err) {
        console.error("Error fetching my auctions:", err);
        let errorMessage = "Failed to load your auctions. Please try again later.";
        if (err instanceof AxiosError && err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err instanceof Error) {
             errorMessage = err.message;
        }
        setError(errorMessage);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, []); // Run only once on mount

  // Format date string (ISO format expected from API) to readable string
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const dateObj = new Date(dateString);
      // Check if the date is valid after parsing
      if (isNaN(dateObj.getTime())) {
          return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // More readable time format
      }).format(dateObj);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  // Filter auctions based on activeTab, mapping API statuses
  const filteredAuctions = auctions.filter(auction => {
    const status = auction.status; // 'upcoming' | 'active' | 'ending-soon' | 'ended'

    switch (activeTab) {
      case 'all':
        return true;
      case 'active':
        // Show active, ending-soon auctions in the 'Active' tab
        return status === 'active' || status === 'ending-soon';
      case 'ended':
        return status === 'ended';
      case 'draft':
        // Map the API's 'upcoming' status to the UI's 'Drafts' tab
        // If you have a true 'draft' status not listed in IAuction, adjust this logic
        return status === 'upcoming';
      default:
        return false;
    }
  });

  // --- Render Logic ---

  // Handle Error State (Unchanged)
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </main>
      </div>
    );
  }

  // Keep Loading and Main Render Logic (Adjusted for IAuction)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in w-full">
        {/* Header Section (Unchanged) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>My Auctions</h1>
            <p className="mt-1 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Manage your listings and track their performance</p>
          </div>
          <Link to="/create-auction" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Auction
            </Button>
          </Link>
        </div>

        {/* Tabs - Consider renaming 'Drafts' to 'Upcoming' if it aligns better */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'all', label: 'All Auctions' },
                { id: 'active', label: 'Active' }, // Shows 'active' and 'ending-soon'
                { id: 'ended', label: 'Ended' },
                { id: 'draft', label: 'Upcoming / Drafts' } // Label clarifies it shows 'upcoming'
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
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

        {/* Content Area */}
        {loading ? (
          // Skeleton Loading (Unchanged)
          <div className="space-y-4 animate-fade-in">
            {/* ... skeleton structure ... */}
             {Array(3).fill(0).map((_, index) => (
               <div key={index} className="bg-white p-6 rounded-lg shadow animate-skeleton-pulse">
                 <div className="flex flex-col sm:flex-row gap-4">
                   <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                   <div className="flex-1">
                     <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                     <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                     <div className="flex justify-between items-end">
                        <div>
                           <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                           <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        ) : filteredAuctions.length === 0 ? (
          // No Auctions Message (Adjusted text slightly)
          <div className="bg-white p-12 rounded-lg shadow text-center animate-fade-in">
            <p className="text-gray-500">You don't have any auctions matching the '{
              // Find the label for the current activeTab
              [{ id: 'all', label: 'All Auctions' }, { id: 'active', label: 'Active' }, { id: 'ended', label: 'Ended' }, { id: 'draft', label: 'Upcoming / Drafts' }].find(t => t.id === activeTab)?.label ?? activeTab
            }' category yet.</p>
            <Link to="/create-auction">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create Auction
              </Button>
            </Link>
          </div>
        ) : (
          // Display Auctions (Using IAuction fields)
          <div className="space-y-4">
            {filteredAuctions.map((auction, index) => {
              // Determine primary image source
              const primaryImage = auction.imageUrl ?? (auction.images.length > 0 ? auction.images[0] : '/placeholder.svg');
              const statusLabel = auction.status === 'ending-soon' ? 'Ending Soon' : auction.status;

              return (
                <div
                  key={auction._id} // Use _id
                  className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s`, animationFillMode: 'backwards' }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="relative w-full sm:w-32 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={primaryImage}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                      {/* Status Overlay - Show for non-active states or 'ending-soon' */}
                      {(auction.status === 'upcoming' || auction.status === 'ended' || auction.status === 'ending-soon') && (
                        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center ${auction.status === 'ending-soon' ? 'bg-opacity-60' : ''}`}>
                          <span className={`text-white font-semibold text-xs sm:text-sm uppercase tracking-wide px-2 py-1 rounded bg-black bg-opacity-60 ${auction.status === 'ending-soon' ? 'bg-red-500 text-white' : ''}`}>
                            {statusLabel}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/auction/${auction._id}`} className="block hover:text-auction-purple transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 truncate" title={auction.title}>{auction.title}</h3>
                      </Link>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{auction.description}</p>
                      <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                        {/* Bid Info */}
                        <div>
                          <p className="text-sm text-gray-500">
                            {auction.status === 'active' || auction.status === 'ending-soon' ? 'Current bid:' : (auction.status === 'ended' ? 'Winning bid:' : 'Starting bid:')}
                            {' '}
                            <span className="font-medium text-gray-900">
                              {auction.currentBid > 0
                                ? `$${auction.currentBid.toLocaleString()}`
                                : (auction.status !== 'upcoming' ? `$${auction.startingBid.toLocaleString()}` : 'Not started') // Show starting bid if no current bid (except upcoming)
                              }
                              {/* Handle case where even starting bid might be 0 */}
                              {(auction.currentBid <= 0 && auction.startingBid <= 0 && auction.status !== 'upcoming') && 'No bids'}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'}
                          </p>
                        </div>
                        {/* Date Info - Use appropriate date based on status */}
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">
                            {auction.status === 'ended'
                              ? 'Ended:'
                              : (auction.status === 'active' || auction.status === 'ending-soon')
                                ? 'Ends:'
                                : 'Starts:'} {/* Changed from 'Created' to 'Starts' for upcoming */}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(auction.status === 'upcoming' ? auction.startTime : auction.endTime)}
                            </p>
                        </div>
                      </div>
                      {/* Action Buttons - Adjusted based on API status */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {auction.status === 'upcoming' ? (
                          <>
                            <Link to={`/edit-auction/${auction._id}`}> {/* Edit upcoming/draft */}
                              <Button variant="default" size="sm">
                                Edit Details
                              </Button>
                            </Link>
                            {/* Add 'Start Now' or similar if applicable */}
                            <Button variant="outline" size="sm" /* onClick={() => handleStartNow(auction._id)} */ >
                              Start Now
                            </Button>
                            <Button variant="destructive" size="sm" /* onClick={() => handleDelete(auction._id)} */>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </>
                        ) : auction.status === 'active' || auction.status === 'ending-soon' ? (
                          <>
                            <Link to={`/auction-analytics/${auction._id}`}>
                              <Button variant="default" size="sm">
                                View Analytics
                              </Button>
                            </Link>
                             {/* Maybe allow minor edits to active auctions if your system permits */}
                            {/* <Link to={`/edit-auction/${auction._id}`}>
                              <Button variant="outline" size="sm">
                                Edit Listing
                              </Button>
                            </Link> */}
                             {/* Add Cancel functionality */}
                             <Button variant="destructive" size="sm" /* onClick={() => handleCancel(auction._id)} */ >
                                 Cancel Auction
                             </Button>
                          </>
                        ) : auction.status === 'ended' ? (
                           <>
                             <Link to={`/auction-analytics/${auction._id}`}>
                               <Button variant="default" size="sm">
                                 View Results
                               </Button>
                             </Link>
                              {/* Add Relist functionality */}
                              <Button variant="outline" size="sm" /* onClick={() => handleRelist(auction._id)} */ >
                                 Relist
                              </Button>
                              {/* Maybe archive or delete ended */}
                              <Button variant="ghost" size="sm" /* onClick={() => handleArchive(auction._id)} */ >
                                Archive
                              </Button>
                           </>
                        ) : null /* Should not happen based on defined statuses */}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer (Unchanged) */}
      <footer className="bg-white mt-auto border-t border-gray-200">
        {/* ... footer content ... */}
         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 text-sm text-center sm:text-left">© {new Date().getFullYear()} AuctionVerse. All rights reserved.</p>
             <div className="flex space-x-6">
               <a href="#" className="text-sm text-gray-500 hover:text-auction-purple transition-colors">Terms</a>
               <a href="#" className="text-sm text-gray-500 hover:text-auction-purple transition-colors">Privacy</a>
               <a href="#" className="text-sm text-gray-500 hover:text-auction-purple transition-colors">Contact</a>
             </div>
           </div>
         </div>
      </footer>
    </div>
  );
};

export default MyAuctions;