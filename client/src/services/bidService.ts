// src/services/bidService.ts
import apiClient from './apiClient';
import {
    IBid,
    IBidCreatePayload,
    IPlaceBidApiResponse,
    IApiListResponse,
    // Import IApiResponse if needed for other potential bid routes
} from '../types/bid'; // Adjust path as needed
// Import generic types if they live elsewhere
// import { IApiListResponse } from '../types';

/**
 * Places a new bid on a specific auction. Requires authentication.
 * Uses POST /api/auctions/:auctionId/bids
 * @param auctionId - The ID of the auction to bid on.
 * @param payload - The bid amount { amount: number }.
 * @returns Promise resolving to the API response containing the new bid and updated auction info.
 */
const placeBid = async (auctionId: string, payload: IBidCreatePayload): Promise<IPlaceBidApiResponse> => {
    if (!auctionId) throw new Error("Auction ID is required to place a bid");
    try {
        // Note: The URL includes the auctionId, the payload only needs the amount
        const response = await apiClient.post<IPlaceBidApiResponse>(`/auctions/${auctionId}/bids`, payload);
        // Backend sends a specific structure for bids: { success, message, bid, auction }
        return response.data;
    } catch (error) {
        console.error(`Error placing bid on auction ${auctionId}:`, error);
        // Re-throw for handling by the caller (e.g., React Query mutation)
        throw error;
    }
};

/**
 * Fetches all bids for a specific auction. Public access.
 * Uses GET /api/auctions/:auctionId/bids
 * @param auctionId - The ID of the auction whose bids are to be fetched.
 * @returns Promise resolving to the paginated list of bids for the auction.
 */
const getBidsForAuction = async (auctionId: string): Promise<IApiListResponse<IBid>> => {
    if (!auctionId) throw new Error("Auction ID is required to fetch bids");
    try {
        // Assuming backend returns { success: true, count, data: bids[] }
        const response = await apiClient.get<IApiListResponse<IBid>>(`/auctions/${auctionId}/bids`);
        return response.data; // Return the whole response object
    } catch (error) {
        console.error(`Error fetching bids for auction ${auctionId}:`, error);
        throw error;
    }
};

/**
 * Fetches all bids placed by the currently logged-in user. Requires authentication.
 * Uses GET /api/bids/me
 * @returns Promise resolving to the paginated list of the user's bids.
 */
const getMyBids = async (): Promise<IApiListResponse<IBid>> => {
    try {
        // Assuming backend returns { success: true, count, data: bids[] }
        const response = await apiClient.get<IApiListResponse<IBid>>('/bids/me');
        return response.data; // Return the whole response object
    } catch (error) {
        console.error("Error fetching my bids:", error);
        throw error;
    }
};


// Export all functions as a single service object
export const bidService = {
    placeBid,
    getBidsForAuction,
    getMyBids,
};