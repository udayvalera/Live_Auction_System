import Header from "@/components/Header";
import AuctionCard from "@/components/AuctionCard";
import CreateAuctionButton from "@/components/CreateAuctionButton";
import { useState, useEffect } from "react";
import { auctionService } from "@/services/auctionService";
import { IAuction, IListAuctionParams } from "@/types/auction"; // Adjust path if needed

// --- Define the limit constant ---
const AUCTIONS_PER_PAGE = 12; // Or your desired default limit

const Index = () => {
  const [auctionsData, setAuctionsData] = useState<IAuction[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Add state for pagination data if implementing pagination
  // const [paginationInfo, setPaginationInfo] = useState(null);

  const filterOptions = [
    { id: 'active', label: 'Active' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ending-soon', label: 'Ending Soon' },
    // { id: 'ended', label: 'Ended Auctions' }
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      setError(null);

      // Prepare parameters for the API call
      const params: IListAuctionParams = {
          // --- Use the constant ---
          limit: AUCTIONS_PER_PAGE,
          sortBy: (activeFilter === 'upcoming') ? 'startTime' : 'endTime',
          sortOrder: 'asc',
          // TODO: Add page parameter for pagination
          // page: currentPage,
      };

      if (activeFilter !== 'all') { // Assuming 'all' isn't a specific API status
          params.status = activeFilter as 'upcoming' | 'active' | 'ending-soon';
      }

      try {
        console.log("Fetching auctions with params:", params);
        const response = await auctionService.getAuctions(params);
        setAuctionsData(response.data);
        // TODO: setPaginationInfo(response.pagination);
      } catch (err: any) {
        console.error("Error fetching auctions:", err);
        setError("Failed to load auctions. Please try again later.");
        setAuctionsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();

  }, [activeFilter]); // Add other dependencies like currentPage if pagination is added

  const handleFilterChange = (filterId: string) => {
    // TODO: Reset page to 1 when filter changes if implementing pagination
    // setCurrentPage(1);
    setActiveFilter(filterId);
  };

  // Skeleton Component (no changes needed here)
  const AuctionCardSkeleton = () => (
     <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-skeleton-pulse">
      {/* ... Skeleton structure ... */}
       <div className="h-48 w-full bg-gray-200"></div>
       <div className="p-4">
         <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
         <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
         <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
         <div className="flex justify-between items-center mb-3">
           <div>
             <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
             <div className="h-6 bg-gray-200 rounded w-24"></div>
           </div>
           <div className="text-right">
             <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
             <div className="h-8 bg-gray-200 rounded w-20"></div>
           </div>
         </div>
         <div className="pt-3 border-t border-gray-100 flex justify-between">
           <div className="h-4 bg-gray-200 rounded w-16"></div>
           <div className="h-4 bg-gray-200 rounded w-16"></div>
         </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Auctions</h1>
            <p className="mt-1 text-gray-500">Discover unique items and place your bids</p>
          </div>
          <CreateAuctionButton />
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFilterChange(option.id)}
                  className={`
                    whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-auction-purple-light focus:ring-opacity-50 rounded-t-md
                    ${activeFilter === option.id
                      ? 'border-auction-purple text-auction-purple'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area: Loading, Error, Data */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* --- Use the constant here --- */}
              {Array(AUCTIONS_PER_PAGE).fill(0).map((_, index) => (
                <AuctionCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
             <div className="text-center py-12 animate-fade-in bg-red-50 border border-red-200 rounded-lg p-6">
               <p className="text-red-700 font-medium">Oops! Something went wrong.</p>
               <p className="text-red-600 mt-1">{error}</p>
               <button
                 onClick={() => handleFilterChange(activeFilter)} // Refetch current filter
                 className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
               >
                 Retry
               </button>
            </div>
          ) : auctionsData.length === 0 ? (
             <div className="text-center py-16 animate-fade-in bg-blue-50 border border-blue-200 rounded-lg p-6">
               <p className="text-blue-700 font-medium">No Auctions Found</p>
              <p className="text-blue-600 mt-1">
                  There are currently no auctions matching the '{filterOptions.find(f => f.id === activeFilter)?.label}' filter.
              </p>
              {activeFilter !== 'active' && (
                   <button
                     onClick={() => handleFilterChange('active')}
                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                   >
                     View Active Auctions
                   </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {auctionsData.map((auction, index) => (
                <AuctionCard key={auction._id} auction={auction} index={index} />
              ))}
            </div>
          )}
        </div>
         {/* --- TODO: Add Pagination Controls --- */}

      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t border-gray-200">
       {/* ... Footer content ... */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
     <div className="flex justify-between items-center">
      <p className="text-gray-500 text-sm">© 2025 AuctionVerse. All rights reserved.</p>
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

export default Index;