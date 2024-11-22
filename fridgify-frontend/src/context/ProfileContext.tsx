import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Profile type
type Profile = {
  name: string;
  email: string;
  picture: string;
};


interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}


const ProfileContext = createContext<ProfileContextType | undefined>(undefined);


export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};


export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {

    if (profile) {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
