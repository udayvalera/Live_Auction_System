// utils/dateUtils.ts (Example - create this file or add inside component)
import { formatDistanceToNowStrict, format, isPast } from 'date-fns'; // Using date-fns for robust calculations

export const calculateTimeLeft = (endTime: string | Date | undefined): string => {
  if (!endTime) return "N/A";
  const endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;

  if (isNaN(endDate.getTime())) return "Invalid Date"; // Handle invalid date strings

  if (isPast(endDate)) {
    return "Ended";
  }

  return formatDistanceToNowStrict(endDate, { addSuffix: true }).replace('in ', ''); // e.g., "2 days", "5 hours", "10 minutes"
};

export const formatEndedDate = (endTime: string | Date | undefined): string => {
  if (!endTime) return "N/A";
  const endDate = typeof endTime === 'string' ? new Date(endTime) : endTime;

  if (isNaN(endDate.getTime())) return "Invalid Date";

  if (!isPast(endDate)) {
      return "Not Ended"; // Or however you want to handle active auctions
  }

  return format(endDate, 'MMM d, yyyy'); // e.g., "Jun 15, 2023"
};

// Function to determine bid status based on API data
// NOTE: Assumes `bid.bidder` is populated with at least `_id` or is the string ID
//       and `bid.auction` is populated with necessary fields.
//       Also assumes `bid.isHighestBidder` is correctly set by the backend for active bids.
export const getBidStatus = (bid: IBid, userId: string | null | undefined): 'winning' | 'outbid' | 'won' | 'lost' | 'ended' | 'unknown' => {
    if (!bid || !bid.auction || typeof bid.auction === 'string' || !userId) {
        return 'unknown'; // Need auction details and user ID
    }

    const auctionStatus = bid.auction.status; // From virtual field
    const highestBidderId = bid.auction.highestBidder;
    const bidderId = typeof bid.bidder === 'string' ? bid.bidder : bid.bidder?._id;


    if (auctionStatus === 'ended') {
        if (highestBidderId === bidderId) {
            return 'won';
        } else {
            return 'lost';
        }
    } else if (auctionStatus === 'active' || auctionStatus === 'ending-soon') {
        // Rely on isHighestBidder calculated in getMyBids controller for efficiency
         if (bid.isHighestBidder === true) {
            return 'winning';
         } else {
            return 'outbid';
         }
         // Fallback if isHighestBidder wasn't populated:
         /*
         if (highestBidderId === bidderId) {
             return 'winning';
         } else {
             return 'outbid';
         }
         */

    } else {
        // Handle upcoming or other statuses if necessary
        return 'unknown'; // Or filter these out earlier
    }
};