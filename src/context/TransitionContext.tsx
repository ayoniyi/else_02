// context/TransitionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  isExiting: boolean;
  triggerExit: (callback: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isExiting: false,
  triggerExit: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = (callback: () => void) => {
    setIsExiting(true);
    // Wait for exit animation to complete (1.5s)
    setTimeout(() => {
      setIsExiting(false);
      callback();
    }, 1500);
  };

  return (
    <TransitionContext.Provider value={{ isExiting, triggerExit }}>
      {children}
    </TransitionContext.Provider>
  );
};
