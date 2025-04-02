// src/services/auctionService.ts
import apiClient from './apiClient';
import {
  IAuction,
  IAuctionCreatePayload,
  IAuctionUpdatePayload,
  IListAuctionParams,
  IApiResponse,
  IApiListResponse // Use the specific list response type
} from '../types/auction'; // Adjust path if you placed interfaces elsewhere

const BASE_PATH = '/auctions'; // Base path for auction routes

/**
 * Creates a new auction. Requires authentication.
 * @param payload - The data for the new auction.
 * @returns Promise resolving to the created auction data.
 */
const createAuction = async (payload: IAuctionCreatePayload): Promise<IAuction> => {
  try {
    // The backend expects a response like { success: true, data: auction }
    const response = await apiClient.post<IApiResponse<IAuction>>(BASE_PATH, payload);
    return response.data.data; // Extract the auction data
  } catch (error) {
    console.error("Error creating auction:", error);
    // Re-throw the error to be handled by the caller (e.g., React Query, component)
    throw error;
  }
};

/**
 * Fetches a list of auctions based on filter, sort, and pagination parameters. Public access.
 * @param params - Query parameters for filtering, sorting, and pagination.
 * @returns Promise resolving to the paginated list of auctions.
 */
const getAuctions = async (params?: IListAuctionParams): Promise<IApiListResponse<IAuction>> => {
  try {
    // The backend returns { success: true, count, pagination, data }
    // Axios automatically handles query params serialization
    const response = await apiClient.get<IApiListResponse<IAuction>>(BASE_PATH, { params });
    return response.data; // Return the whole response object including pagination
  } catch (error) {
    console.error("Error fetching auctions:", error);
    throw error;
  }
};

/**
 * Fetches details for a single auction by its ID. Public access.
 * Automatically increments view count on the backend.
 * @param id - The ID of the auction to fetch.
 * @returns Promise resolving to the auction details.
 */
const getAuctionDetails = async (id: string): Promise<IAuction> => {
  if (!id) throw new Error("Auction ID is required");
  try {
    const response = await apiClient.get<IApiResponse<IAuction>>(`${BASE_PATH}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching auction details for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing auction. Requires authentication and authorization (seller or admin).
 * @param id - The ID of the auction to update.
 * @param payload - The data fields to update.
 * @returns Promise resolving to the updated auction data.
 */
const updateAuction = async (id: string, payload: IAuctionUpdatePayload): Promise<IAuction> => {
   if (!id) throw new Error("Auction ID is required for update");
  try {
    const response = await apiClient.put<IApiResponse<IAuction>>(`${BASE_PATH}/${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating auction ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes an auction. Requires authentication and authorization (seller or admin).
 * @param id - The ID of the auction to delete.
 * @returns Promise resolving to the success response (data might be null).
 */
const deleteAuction = async (id: string): Promise<IApiResponse<null>> => {
   if (!id) throw new Error("Auction ID is required for delete");
  try {
    // Backend sends { success: true, message: '...', data: null }
    const response = await apiClient.delete<IApiResponse<null>>(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting auction ID ${id}:`, error);
    throw error;
  }
};

/**
 * Toggles the like status for an auction for the logged-in user. Requires authentication.
 * @param id - The ID of the auction to like/unlike.
 * @returns Promise resolving to the updated auction data (with updated likedBy array).
 */
const toggleLikeAuction = async (id: string): Promise<IAuction> => {
  if (!id) throw new Error("Auction ID is required for like/unlike");
  try {
    // PATCH request, no body needed for this specific toggle endpoint
    const response = await apiClient.patch<IApiResponse<IAuction>>(`${BASE_PATH}/${id}/like`);
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling like for auction ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches auctions created by the currently logged-in user. Requires authentication.
 * @param params - Query parameters for filtering, sorting, and pagination.
 * @returns Promise resolving to the paginated list of the user's auctions.
 */
const getMyAuctions = async (params?: IListAuctionParams): Promise<IApiListResponse<IAuction>> => {
  try {
    // IMPORTANT: Route is /auctions/my-auctions
    const response = await apiClient.get<IApiListResponse<IAuction>>(`${BASE_PATH}/my-auctions`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching my auctions:", error);
    throw error;
  }
};

/**
 * Fetches auctions liked by the currently logged-in user. Requires authentication.
 * @param params - Query parameters for filtering, sorting, and pagination.
 * @returns Promise resolving to the paginated list of liked auctions.
 */
const getLikedAuctions = async (params?: IListAuctionParams): Promise<IApiListResponse<IAuction>> => {
  try {
     // IMPORTANT: Route is /auctions/liked-auctions
    const response = await apiClient.get<IApiListResponse<IAuction>>(`${BASE_PATH}/liked-auctions`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching liked auctions:", error);
    throw error;
  }
};

// Export all functions as a single service object
export const auctionService = {
  createAuction,
  getAuctions,
  getAuctionDetails,
  updateAuction,
  deleteAuction,
  toggleLikeAuction,
  getMyAuctions,
  getLikedAuctions,
};