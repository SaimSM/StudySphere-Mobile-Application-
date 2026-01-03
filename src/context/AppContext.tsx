import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAssignments } from '../services/assignmentsApi';
import { getGoals } from '../services/goalsApi';

type AppContextType = {
  assignments: any[];
  goals: any[];
  refreshAssignments: () => Promise<void>;
  refreshGoals: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  const refreshAssignments = async () => {
    const data = await getAssignments();
    setAssignments(data);
  };

  const refreshGoals = async () => {
    const data = await getGoals();
    setGoals(data);
  };

  useEffect(() => {
    refreshAssignments();
    refreshGoals();
  }, []);

  return (
    <AppContext.Provider
      value={{
        assignments,
        goals,
        refreshAssignments,
        refreshGoals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
