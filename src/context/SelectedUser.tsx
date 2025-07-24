import React, { createContext, ReactNode, useContext, useState } from "react";

interface SelectedUser {
  id: string;
  username: string;
  role: string;
}

interface SelectedUserContextType {
  selectedUser: SelectedUser | null;
  selectUser: (user: SelectedUser) => void;
  clearSelectedUser: () => void;
}

const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

export function SelectedUserProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const selectUser = (user: SelectedUser) => {
    setSelectedUser(user);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
  };

  return (
    <SelectedUserContext.Provider value={{ selectedUser, selectUser, clearSelectedUser }}>
      {children}
    </SelectedUserContext.Provider>
  );
}

export function useSelectedUser() {
  const context = useContext(SelectedUserContext);
  if (!context) {
    throw new Error("useSelectedUser deve ser usado dentro do SelectedUserProvider");
  }
  return context;
}
