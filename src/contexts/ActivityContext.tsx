import { createContext, useContext, useState, ReactNode } from "react";
import { Activity } from "@/lib/types";
import { activities as initialActivities } from "@/lib/mock-data";

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivities must be used within ActivityProvider");
  return ctx;
}
