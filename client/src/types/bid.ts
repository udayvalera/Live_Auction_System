// src/types/bid.ts (or wherever you keep your types)
import { IAuction, IAuctionBasic } from './auction'; // Assuming basic auction type exists
import { IUser, IUserBasic } from './user'; // Assuming basic user type exists

// Represents the basic structure of a User when populated in a Bid
// Re-declare or import if already defined elsewhere
export interface IUserBasic {
  _id: string;
  name: string;
  profilePictureUrl?: string | null;
}

// Represents the basic structure of an Auction when populated in a Bid
// Re-declare or import if already defined elsewhere
export interface IAuctionBasic {
    _id: string;
    title: string;
    imageUrl?: string | null;
    endTime: string | Date;
    currentBid: number;
    status?: string; // From virtual
    highestBidder?: string | null;
}


// Represents a Bid object received from the API
export interface IBid {
  _id: string;
  auction: string | IAuctionBasic; // Can be string ID or populated object
  bidder: string | IUserBasic;   // Can be string ID or populated object
  amount: number;
  createdAt: string | Date; // Typically string (ISO 8601) from JSON
  updatedAt: string | Date;
  isHighestBidder?: boolean; // Optional: Added by getMyBids logic
}

// Payload for placing a new bid (only amount needed in body for recommended route)
export interface IBidCreatePayload {
  amount: number;
}

// Specific structure returned by the placeBid endpoint
export interface IPlaceBidApiResponse {
    success: boolean;
    message?: string;
    bid: IBid;
    auction: { // Partial auction update
        _id: string;
        currentBid: number;
        highestBidder: string | null;
        bidCount: number;
    };
}

// Assuming your backend uses these generic wrappers
// Re-declare or import if defined elsewhere
export interface IApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface IApiListResponse<T> {
    success: boolean;
    message?: string;
    count?: number;
    pagination?: {
        next?: { page: number; limit: number };
        prev?: { page: number; limit: number };
        totalPages?: number;
        currentPage?: number;
    }; // Optional pagination details
    data: T[];
}