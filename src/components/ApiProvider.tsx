import { createContext, useContext, useState, ReactNode } from "react";
import { ApiEndpoint } from "../types";

interface ApiContextType {
  baseUrls: string[];
  apiEndpoints: ApiEndpoint[] | null;
  selectedEndpoint?: ApiEndpoint;
  setSelectedEndpoint: (endpoint?: ApiEndpoint) => void;
  addApi: (endpoint: ApiEndpoint) => void;
  deleteApi: (id: string) => void;
  addBaseUrl: (url: string) => void;
  deleteBaseUrl: (url: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export default function ApiProvider({ children }: ApiProviderProps) {
  const [baseUrls, setBaseUrls] = useState<string[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>();
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[] | null>(null);

  function addApi(apiEndpoint: ApiEndpoint) {
    setApiEndpoints((p) => (p ? [apiEndpoint, ...p] : [apiEndpoint]));
  }

  function deleteApi(id: string) {
    setApiEndpoints((p) => p && p.filter((a) => a.id !== id));
  }

  function addBaseUrl(url: string) {
    setBaseUrls((p) => [url, ...p]);
  }

  function deleteBaseUrl(url: string) {
    setBaseUrls((p) => p.filter((u) => u !== url));
  }

  const value: ApiContextType = {
    baseUrls,
    apiEndpoints,
    selectedEndpoint,
    setSelectedEndpoint,
    addApi,
    deleteApi,
    addBaseUrl,
    deleteBaseUrl,
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
