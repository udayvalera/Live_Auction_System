// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService'; // Import the service

// Define types for our user and context
// Ensure this User interface matches the structure used in your app
// and aligns with mapBackendUserToFrontend helper
export interface User {
  id: string; // Corresponds to backend _id
  email: string;
  name: string;
  avatar: string; // Corresponds to backend profilePictureUrl
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // Add token state if needed elsewhere, though apiClient handles it
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: (navigateLogin?: boolean) => void; // Optional param to control navigation
  refreshTokenData: () => Promise<void>; // Function to refresh user data if needed
  updateAvatar: () => Promise<boolean>; // Function to trigger avatar update
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing the token in localStorage
const TOKEN_STORAGE_KEY = 'auctionverse_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY)); // Initialize token from storage
  const [isLoading, setIsLoading] = useState(true); // Start loading until token verified
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Token Verification Effect ---
  // Runs once on mount to check for existing token and verify it
  useEffect(() => {
    const verifyExistingToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        setToken(storedToken); // Set token state
        try {
          console.log("Verifying existing token...");
          const backendUser = await authService.verifyToken();
          const frontendUser = authService.mapBackendUserToFrontend(backendUser);
          setUser(frontendUser);
          console.log("Token verified successfully. User set:", frontendUser);
        } catch (error: any) {
          console.error("Token verification failed on mount:", error.message);
          // Clear invalid token from storage and state
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
          // Optional: Show toast for expired session
          // toast({ title: "Session Expired", description: "Please log in again.", variant: "info" });
        }
      } else {
          console.log("No token found in storage.");
      }
      setIsLoading(false); // Stop loading once check is complete
    };

    verifyExistingToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

   // --- Helper to set user and token ---
   const handleAuthSuccess = (authData: { token: string } & any) => { // Use the actual type from authService if defined (AuthResponse)
    const frontendUser = authService.mapBackendUserToFrontend(authData);
    localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
    setToken(authData.token);
    setUser(frontendUser);
    setIsLoading(false);
    return frontendUser;
  };

  // --- Login Function ---
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authData = await authService.login({ email, password });
      const loggedInUser = handleAuthSuccess(authData);

      toast({
        title: "Successfully logged in",
        description: `Welcome back, ${loggedInUser.name}!`,
      });

      // Redirect admin users to admin panel, regular users to home or dashboard
       if (loggedInUser.isAdmin) {
           navigate('/admin', { replace: true }); // Use replace to avoid back button to login
       } else {
           navigate('/', { replace: true }); // Or navigate to a user dashboard if you have one
       }
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password", // Use error message from service
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
    // No finally block needed for setIsLoading(false) here as it's handled in success/error paths
  };

  // --- Signup Function ---
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authData = await authService.register({ name, email, password });
      const newUser = handleAuthSuccess(authData); // This also logs the user in

      toast({
        title: "Account created successfully",
        description: `Welcome to AuctionVerse, ${newUser.name}! You are now logged in.`,
      });

       // Navigate to home page after successful signup and login
       navigate('/', { replace: true });
      return true;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account. Please try again.", // Use error message from service
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  // --- Logout Function ---
  const logout = useCallback((navigateLogin = true) => { // Default to navigating to login
    console.log("Logging out...");
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
    // Note: The apiClient interceptor will stop sending the token automatically
    // because it reads from localStorage which is now empty.

    if (navigateLogin) {
        navigate('/login', { replace: true }); // Use replace: true
    }

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  // Add navigate and toast dependencies
  }, [navigate, toast]);

  // --- Function to manually refresh user data (e.g., after profile update outside auth flow) ---
   const refreshTokenData = async () => {
       if (!token) {
           console.log("No token available to refresh data.");
           return;
       }
       setIsLoading(true);
       try {
           console.log("Refreshing token data...");
           const backendUser = await authService.verifyToken(); // Use verifyToken to get fresh data
           const frontendUser = authService.mapBackendUserToFrontend(backendUser);
           setUser(frontendUser);
           console.log("Token data refreshed:", frontendUser);
       } catch (error: any) {
           console.error("Failed to refresh token data:", error.message);
           // If refresh fails (e.g., token *really* expired), log out
           logout(true); // Navigate to login on failure
           toast({
               title: "Session Problem",
               description: "Could not refresh session. Please log in again.",
               variant: "destructive",
           });
       } finally {
           setIsLoading(false);
       }
   };

   // --- Function to Update Avatar ---
    const updateAvatar = async (): Promise<boolean> => {
        if (!token) {
            toast({ title: "Error", description: "You must be logged in to change your avatar.", variant: "destructive" });
            return false;
        }
        setIsLoading(true);
        try {
            const { profilePictureUrl } = await authService.updateProfilePicture();
            // Update user state locally without needing a full refresh
            setUser(currentUser => currentUser ? { ...currentUser, avatar: profilePictureUrl } : null);
            toast({ title: "Avatar Updated", description: "Your profile picture has been changed." });
            setIsLoading(false);
            return true;
        } catch (error: any) {
            toast({
                title: "Avatar Update Failed",
                description: error.message || "Could not update avatar.",
                variant: "destructive"
            });
            setIsLoading(false);
            return false;
        }
    };


  // --- Context Value ---
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    refreshTokenData,
    updateAvatar,
    isAuthenticated: !!user && !!token, // Check for both user object and token
    isAdmin: user?.isAdmin || false,
  };

  // Render children only when not initializing (avoids flicker)
  // Or always render and let components handle the loading state
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};