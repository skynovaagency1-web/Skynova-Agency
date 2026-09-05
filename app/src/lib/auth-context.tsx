import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, type CurrentUser } from "./api/auth.functions";

type AuthModalMode = "sign-in" | "sign-up";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  refetchUser: () => Promise<unknown>;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("sign-in");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });

  const openAuthModal = useCallback((mode: AuthModalMode = "sign-in") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading,
        refetchUser: refetch,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
