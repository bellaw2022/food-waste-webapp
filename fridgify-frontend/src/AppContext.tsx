import {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";

const AppContext = createContext<{
  globalUserId: number;
  setGlobalUserId: React.Dispatch<React.SetStateAction<number>>;
}>({
  globalUserId: 0, // Set a default value that matches your data type
  setGlobalUserId: () => {}, // Placeholder function, updated by the provider
});

interface WrapperProps {
  children: ReactNode;
}

export const AppProvider: React.FC<WrapperProps> = ({ children }) => {
  const [globalUserId, setGlobalUserId] = useState<number>(0);
  return (
    <AppContext.Provider value={{ globalUserId, setGlobalUserId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);