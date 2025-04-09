import { Heart, Eye, Clock, Calendar } from "lucide-react";
// --- Update type import ---
// import { Auction } from "@/data/auctions"; // Remove old type
import { IAuction } from "@/types/auction"; // Import the correct interface
// --- Import auction service ---
import { auctionService } from "@/services/auctionService";
// --- Import useState for potential loading/error states on like ---
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook
import { formatDistanceToNow, format, parseISO } from "date-fns"; // parseISO is good for string dates
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AuctionCardProps {
  // --- Use the correct interface ---
  auction: IAuction;
  index?: number; // For animation delay
  // TODO: Add a function prop for refetching/updating data after like, if not using React Query
  // onLikeSuccess?: () => void;
}

// Placeholder image if none is provided
const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=No+Image";

const AuctionCard = ({ auction, index = 0 }: AuctionCardProps) => {
  // --- State for Like button interaction (loading/disabled) ---
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  // Note: The 'liked' status (filled heart) ideally requires knowing the current user's ID
  // and checking against auction.likedBy. Without user context here, we can't reliably show
  // the initial liked state. The button click will still toggle the like on the backend.

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling

    // Prevent multiple clicks while processing
    if (isLiking) return;
    setIsLiking(true);

    try {
      // --- Call the service to toggle the like status ---
      const updatedAuction = await auctionService.toggleLikeAuction(auction._id);
      console.log("Like toggled successfully", updatedAuction);

      // --- IMPORTANT UI Limitation ---
      // This component doesn't own the auction data, so the `auction.likes` count displayed
      // won't automatically update here after the API call succeeds.
      // The parent component (`Index.tsx`) needs to refetch the auctions list
      // or use a state management library (like React Query/SWR) which handles
      // cache invalidation and UI updates automatically after mutations.
      // We show a toast as feedback for now.
      // If using a refetch prop: onLikeSuccess?.();

      toast({
        title: updatedAuction.message || "Like status updated!",
        // description: `Likes: ${updatedAuction.data.likes}`, // Reflects new count from response
      });

    } catch (error: any) {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Could not update like status.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false); // Re-enable button
    }
  };

  const formatCurrency = (amount: number) => {
    // Formatting function remains the same
    // ... (keep existing implementation) ...
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
  };

  // --- Safely parse dates from ISO strings ---
  const safeParseDate = (dateString: string | undefined): Date | null => {
    try {
      return dateString ? parseISO(dateString) : null;
    } catch (e) {
      console.error("Failed to parse date:", dateString, e);
      return null;
    }
  };

  const endTimeDate = safeParseDate(auction.endTime);
  const startTimeDate = safeParseDate(auction.startTime);

  const timeLeft = endTimeDate ? formatDistanceToNow(endTimeDate, { addSuffix: false }) : "N/A";

  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'ending-soon': 'bg-orange-100 text-orange-800',
    'ended': 'bg-gray-100 text-gray-800',
    'upcoming': 'bg-blue-100 text-blue-800',
    'invalid-dates': 'bg-red-100 text-red-800', // Handle potential invalid status
  };

  const statusText = {
    'active': 'Active',
    'ending-soon': `Ends in ${timeLeft}`,
    'ended': 'Ended',
    'upcoming': startTimeDate ? `Starts ${format(startTimeDate, 'MMM d')}` : 'Upcoming',
    'invalid-dates': 'Invalid Dates',
  };

  const currentStatus = auction.status || 'active'; // Default status if undefined
  const isEndingSoon = currentStatus === 'ending-soon';
  const isUpcoming = currentStatus === 'upcoming';

  // Determine image URL - prioritize imageUrl, fallback to images[0], then placeholder
  const displayImageUrl = auction.imageUrl || (auction.images && auction.images.length > 0 ? auction.images[0] : PLACEHOLDER_IMAGE_URL);

  // Apply staggered animation delay based on card index
  const animationDelay = `${Math.min(index * 0.05, 0.3)}s`;

  return (
    // --- Use auction._id for the link ---
    <Link to={`/auction/${auction._id}`} className="block group">
      <div
        className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-gray-200 auction-card-shadow animate-fade-in-up"
        style={{ animationDelay }}
      >
        <div className="relative">
          <img
            // --- Use determined display image URL ---
            src={displayImageUrl}
            alt={auction.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE_URL)} // Handle broken images
          />
          <div className="absolute top-2 right-2">
             {/* --- Use currentStatus safely --- */}
            <span className={cn("auction-badge", statusColors[currentStatus])}>
              {statusText[currentStatus]}
            </span>
          </div>
          {/* Conditional overlays based on status */}
          {isEndingSoon && endTimeDate && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center text-white">
                <Clock className="h-4 w-4 mr-1 animate-pulse-slow" />
                <span className="text-sm font-medium">Ending soon!</span>
              </div>
            </div>
          )}
          {isUpcoming && startTimeDate && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="flex items-center text-white">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Coming soon!</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
           {/* --- Use auction fields from IAuction --- */}
          <h3 className="text-lg font-semibold line-clamp-1 mb-1 group-hover:text-auction-purple transition-colors">{auction.title}</h3>
          {/* Optional: Display seller name */}
          {auction.seller?.name && (
              <p className="text-xs text-gray-400 mb-2">By {auction.seller.name}</p>
          )}
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-[40px]">{auction.description}</p> {/* Fixed height for consistency */}

          <div className="flex justify-between items-center mb-3">
            {isUpcoming ? (
              <div>
                <p className="text-xs text-gray-500">Starting bid</p>
                <p className="text-lg font-bold text-auction-purple">
                  {formatCurrency(auction.startingBid)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500">Current bid</p>
                <p className="text-lg font-bold text-auction-purple">
                  {formatCurrency(auction.currentBid)}
                </p>
              </div>
            )}
            <div className="text-right">
               {/* --- Use auction.bidCount --- */}
              <p className="text-xs text-gray-500">{auction.bidCount ?? 0} bids</p> {/* Handle null/undefined */}
               {/* --- Bid Button (Functionality TBD) --- */}
              <button
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   // TODO: Implement bid/notify logic or navigation
                   console.log("Bid/Notify clicked for:", auction._id);
                   // Potentially navigate: navigate(`/auctions/${auction._id}`)
                 }}
                 // Disable if ended
                 disabled={currentStatus === 'ended'}
                className={cn(
                  "mt-1 bg-auction-purple hover:bg-auction-purple-dark text-white py-1 px-3 rounded-full text-sm transition-colors",
                  currentStatus === 'ended' && "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                )}
              >
                {isUpcoming ? "Details" : (currentStatus === 'ended' ? "Ended" : "Bid Now")}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-gray-500" title={`${auction.views ?? 0} views`}>
              <Eye className="h-4 w-4 mr-1" />
               {/* --- Use auction.views --- */}
              <span className="text-xs">{auction.views ?? 0}</span> {/* Handle null/undefined */}
            </div>

            <div className="flex items-center">
               {/* --- Like Button --- */}
              <button
                 onClick={handleToggleLike}
                 disabled={isLiking} // Disable button while API call is in progress
                className={cn(
                  "flex items-center text-gray-500 hover:text-auction-purple transition-colors disabled:opacity-50 disabled:hover:text-gray-500",
                  isLiking && "cursor-wait"
                )}
                title={isLiking ? "Updating..." : "Toggle Like"}
              >
                 {/* Heart icon: Currently always unfilled as we lack user context for initial state */}
                 {/* A full implementation would check if current user ID is in auction.likedBy */}
                <Heart className="h-4 w-4 mr-1"
                    // Example (if user context was available):
                    // fill={isUserLiked ? 'currentColor' : 'none'}
                    // className={cn("h-4 w-4 mr-1", isUserLiked && "text-auction-purple")}
                />
                 {/* --- Display auction.likes directly --- */}
                <span className="text-xs">{auction.likes ?? 0}</span> {/* Handle null/undefined */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;