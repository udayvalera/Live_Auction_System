import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
// Removed: import { auctions, Auction } from "@/data/auctions"; // No longer needed
import { auctionService } from "@/services/auctionService"; // Import the service
import { IAuction } from "@/types/auction"; // Import the IAuction type
import BidTimeline from "@/components/BidTimeline";
// import AuctionStats from "@/components/AuctionStats"; // Assuming this might not be used directly anymore or is part of another component
import StickyBidFooter from "@/components/StickyBidFooter";
import AuctionHeader from "@/components/auction/AuctionHeader";
import AuctionImageSection from "@/components/auction/AuctionImageSection";
import AuctionDescription from "@/components/auction/AuctionDescription";
import MobileBidInfo from "@/components/auction/MobileBidInfo";
import AuctionFooter from "@/components/auction/AuctionFooter";
import { useAuth } from "@/contexts/AuthContext";
import { extendTailwindMerge } from "tailwind-merge";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<IAuction | null>(null); // Use IAuction type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const [timeLeft, setTimeLeft] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate(); // Keep navigate if needed for redirects on error etc.

  useEffect(() => {
    // --- Service Layer Integration ---
    const fetchAuctionData = async () => {
      if (!id) {
        setError("Auction ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); // Reset error on new fetch

      try {
        const fetchedAuction = await auctionService.getAuctionDetails(id);
        // Convert date strings to Date objects if necessary (API might return strings)
        // Adjust this based on your actual API response structure
        setAuction({
            ...fetchedAuction,
            startTime: fetchedAuction.startTime,
            endTime: fetchedAuction.endTime,
            // Ensure other potential date fields are also converted
        });
      } catch (err) {
        console.error("Failed to fetch auction details:", err);
        setError("Failed to load auction details. It might not exist or there was a network issue.");
        setAuction(null); // Ensure auction is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionData();
    // --- End Service Layer Integration ---

  }, [id]); // Dependency remains 'id'

  // Update time left every second (logic remains largely the same)
  useEffect(() => {
    if (!auction || !auction.endTime || auction.status === "ended" || auction.status === "upcoming") {
       setTimeLeft(""); // Clear time left if not applicable
       return;
    }

    // Ensure endTime is a Date object before using it
    const endTimeDate = auction.endTime instanceof Date ? auction.endTime : new Date(auction.endTime);

    if (isNaN(endTimeDate.getTime())) {
        console.warn("Invalid endTime for auction:", auction._id);
        setTimeLeft("Invalid date");
        return; // Don't proceed if the date is invalid
    }

    // Check if the auction has already ended based on current time
    if (new Date() >= endTimeDate) {
        // Optionally update status if needed, though backend should handle this ideally
        setTimeLeft("Ended");
        // You might want to refetch or update auction state here if status needs client-side update
        return;
    }


    const updateTimeLeft = () => {
        const now = new Date();
        if (now < endTimeDate) {
           // Calculate distance, ensuring it doesn't show negative time
           setTimeLeft(formatDistanceToNow(endTimeDate, { addSuffix: false }));
        } else {
           setTimeLeft("Ended"); // Set to ended once the time is reached
           clearInterval(interval); // Stop the interval
        }
    };

    updateTimeLeft(); // Initial calculation
    const interval = setInterval(updateTimeLeft, 1000); // Update every second

    // Cleanup function
    return () => clearInterval(interval);

  }, [auction]); // Re-run when auction data changes

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Keep your existing loading skeleton */}
          <div className="animate-pulse flex flex-col space-y-4">
             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
             <div className="h-72 bg-gray-200 rounded"></div>
             <div className="h-8 bg-gray-200 rounded w-1/2"></div>
             <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  // --- Error State ---
   if (error) {
     return (
       <div className="min-h-screen bg-gray-50">
         <Header />
         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="text-center py-12 animate-fade-in">
             <h2 className="text-2xl font-bold text-red-700">Error</h2>
             <p className="mt-2 text-gray-500">{error}</p>
             {/* Optional: Add a button to retry or go back */}
             <button
                onClick={() => navigate('/')} // Example: Go back home
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
                Go Home
             </button>
           </div>
         </main>
       </div>
     );
   }

  // --- Not Found State (Auction is null after loading and no error) ---
  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Auction Not Found</h2>
            <p className="mt-2 text-gray-500">
              The auction you're looking for doesn't exist or has been removed.
            </p>
             <button
                onClick={() => navigate('/')} // Example: Go back home
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
                Go Home
             </button>
          </div>
        </main>
      </div>
    );
  }

  // --- Render Auction Details ---
  const isEndingSoon = auction.status === "ending-soon"; // Adjust based on your actual status values
  const isUpcoming = auction.status === "upcoming";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <AuctionHeader /> {/* Assumes this component doesn't need direct auction props or gets them via context/other means */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <AuctionImageSection
              title={auction.title}
              images={auction.images || []} // Ensure images is an array
              status={auction.status}
              timeLeft={timeLeft}
              isEndingSoon={isEndingSoon}
              isUpcoming={isUpcoming}
              startTime={auction.startTime} // Pass Date object
            />

            <AuctionDescription
              id={auction._id} // Assuming your IAuction has _id
              title={auction.title}
              description={auction.description}
              seller={auction.seller} // Assuming seller info is populated
              documents={auction.documents || []} // Ensure documents is an array
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {/* Pass necessary props to BidTimeline if it needs them directly */}
              <BidTimeline auctionId={auction._id} />
            </div>

            <MobileBidInfo
              isUpcoming={isUpcoming}
              startingBid={auction.startingBid}
              currentBid={auction.currentBid}
              auctionId={auction._id}
            />
          </div>
        </div>
      </main>

      <StickyBidFooter
        auctionId={auction._id}
        currentBid={auction.currentBid}
        endTime={new Date(auction.endTime)} // Pass Date object
        isEndingSoon={isEndingSoon}
        status={auction.status}
        user={user}
      />

      <AuctionFooter />
    </div>
  );
};

export default AuctionDetail;