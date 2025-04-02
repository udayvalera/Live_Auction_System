// src/types/auction.ts (or place within auctionService.ts if preferred)

// Minimal representation for populated user data
export interface IUserLite {
    _id: string;
    name: string;
    profilePictureUrl?: string;
    email?: string; // Included in getAuctionById seller populate
  }
  
  // Document sub-schema
  export interface IAuctionDocument {
    name: string;
    url: string;
    type: string;
  }
  
  // Main Auction interface matching the Mongoose model + virtuals
  export interface IAuction {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    images: string[];
    startingBid: number;
    currentBid: number;
    highestBidder?: IUserLite | null; // Populated
    bidCount: number;
    views: number;
    likedBy: string[]; // Array of user IDs who liked
    seller: IUserLite; // Populated
    startTime: string; // Use string for ISO date format consistency
    endTime: string;   // Use string for ISO date format consistency
    documents: IAuctionDocument[];
    category?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
    // Virtuals
    likes: number;     // Populated by virtual 'likes'
    status: 'upcoming' | 'active' | 'ending-soon' | 'ended'; // Populated by virtual 'status'
  }
  
  // Interface for the data needed to create an auction
  export interface IAuctionCreatePayload {
    title: string;
    description: string;
    startingBid: number;
    endTime: string; // Expect ISO string or Date convertible to string
    startTime?: string; // Optional, defaults on backend
    imageUrl?: string;
    images?: string[];
    category?: string;
    location?: string;
    documents?: IAuctionDocument[];
  }
  
  // Interface for the data allowed when updating an auction
  // Use Partial as many fields are optional and conditional
  export type IAuctionUpdatePayload = Partial<Omit<IAuctionCreatePayload, 'startingBid'> & {
      startingBid?: number; // Include startingBid specifically as it has special rules
  }>;
  
  
  // Interface for query parameters for listing auctions
  export interface IListAuctionParams {
    page?: number;
    limit?: number;
    sortBy?: keyof IAuction | string; // Allow string for flexibility if needed
    sortOrder?: 'asc' | 'desc';
    category?: string;
    sellerId?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: 'upcoming' | 'active' | 'ending-soon' | 'ended';
    search?: string;
  }
  
  // Interface for the pagination part of the response
  export interface IPagination {
    totalAuctions: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }
  
  // Interface for the standard backend API response structure
  export interface IApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    // Include other potential top-level fields if your backend sends them
  }
  
  // Interface specifically for paginated list responses
  export interface IApiListResponse<T> extends IApiResponse<T[]> {
    count: number;
    pagination: IPagination;
  }