import { createContext, useContext, useState, ReactNode } from "react";
import { ApiEndpoint } from "../types";

interface ApiContextType {
  apiEndpoints: ApiEndpoint[] | null;
  addApi: (endpoint: ApiEndpoint) => void;
  deleteApi: (id: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export default function ApiProvider({ children }: ApiProviderProps) {
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[] | null>(null);

  function addApi(apiEndpoint: ApiEndpoint) {
    setApiEndpoints((p) => (p ? [apiEndpoint, ...p] : [apiEndpoint]));
  }
  function deleteApi(id: string) {
    setApiEndpoints((p) => p && p.filter((a) => a.id !== id));
  }

  const value: ApiContextType = {
    apiEndpoints,
    addApi,
    deleteApi,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiEndpoint(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
