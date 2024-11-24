import {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";

interface User {
  access_token: string;
}

interface AppContextType {
  globalUserId: number;
  setGlobalUserId: React.Dispatch<React.SetStateAction<number>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType>({
  globalUserId: 0, 
  setGlobalUserId: () => {},
  user: null,
  setUser: () => {},
  userId: null,
  setUserId: () => {},
});

interface WrapperProps {
  children: ReactNode;
}

export const AppProvider: React.FC<WrapperProps> = ({ children }) => {
  const [globalUserId, setGlobalUserId] = useState<number>(0);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("user_id");
  });

  // Persist user state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("user_id", userId);
    } else {
      localStorage.removeItem("user_id");
    }
  }, [userId]);
  
  return (
    <AppContext.Provider
      value={{
        globalUserId,
        setGlobalUserId,
        user,
        setUser,
        userId,
        setUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
};

export const useAppContext = () => useContext(AppContext);
