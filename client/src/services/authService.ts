// src/services/authService.ts
import apiClient from '@/services/apiClient';
import { User } from '@/contexts/AuthContext'; // Assuming User type is here or imported

// --- Type Definitions ---

// Type for the data expected by the register endpoint
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Type for the data expected by the login endpoint
interface LoginData {
  email: string;
  password: string;
}

// Type for the user data returned from the backend API
// Make sure this matches exactly what your backend sends
interface BackendUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePictureUrl: string;
}

// Type for the response from login/register endpoints
interface AuthResponse {
  token: string;
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePictureUrl: string;
}

// Type for the response from verify-token endpoint (User data without token)
type VerifyTokenResponse = BackendUser;

// Type for the response from update profile picture endpoint
interface UpdateProfilePictureResponse {
    _id: string;
    profilePictureUrl: string;
}


// --- Service Functions ---

const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data; // Contains user data + token
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    // Re-throw the error with backend message if available
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data; // Contains user data + token
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    // Re-throw the error with backend message if available
    throw new Error(error.response?.data?.message || 'Login failed. Invalid credentials.');
  }
};

const verifyToken = async (): Promise<VerifyTokenResponse> => {
  try {
    // The token is automatically added by the apiClient interceptor
    const response = await apiClient.get<VerifyTokenResponse>('/auth/verify-token');
    return response.data; // Contains user data (without token)
  } catch (error: any) {
    console.error("Token verification failed:", error.response?.data || error.message);
    // Re-throw the error. The interceptor might handle 401, but other errors are possible.
    throw new Error(error.response?.data?.message || 'Session expired or invalid. Please login again.');
  }
};

const updateProfilePicture = async (): Promise<UpdateProfilePictureResponse> => {
    try {
        // Token added automatically by interceptor
        const response = await apiClient.patch<UpdateProfilePictureResponse>('/auth/profile-picture');
        return response.data; // Contains _id and new profilePictureUrl
    } catch (error: any) {
        console.error("Failed to update profile picture:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update profile picture.');
    }
}


// Helper function to map backend user to frontend user type
// Adjust this based on your exact Frontend User interface
const mapBackendUserToFrontend = (backendUser: BackendUser | AuthResponse): User => {
    return {
        id: backendUser._id, // Map _id to id
        email: backendUser.email,
        name: backendUser.name,
        avatar: backendUser.profilePictureUrl, // Map profilePictureUrl to avatar
        isAdmin: backendUser.isAdmin,
    };
};


export const authService = {
  register,
  login,
  verifyToken,
  updateProfilePicture,
  mapBackendUserToFrontend,
};