import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/profile");
      setProfile(res.data || null);
    } catch (error) {
      // Handle 401 Unauthorized errors gracefully
      if (error.response?.status === 401) {
        console.log("User not authenticated or token expired");
        setProfile(null);
      } else {
        console.error("Failed to fetch profile:", error.message);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await axiosInstance.post("/profile", data);
      setProfile(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      // Don't throw error for unauthenticated users - just log it
      if (error.response?.status === 401) {
        console.log("Cannot update profile - user not authenticated");
        return null;
      }
      throw error;
    }
  };

  const deleteProfile = async () => {
    try {
      await axiosInstance.delete("/profile");
      setProfile(null);
    } catch (error) {
      console.error("Failed to delete profile:", error.message);
      // Don't throw error for unauthenticated users
      if (error.response?.status === 401) {
        console.log("Cannot delete profile - user not authenticated");
        return;
      }
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null); // Clear profile on logout
      setLoading(false);
    }
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, deleteProfile, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
