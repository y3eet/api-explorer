import { OpenAPIObject } from "openapi3-ts/oas30";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ApiContextType {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  openAPI: OpenAPIObject | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

async function fetchOpenAPI(url: string): Promise<OpenAPIObject> {
  const res = await fetch(url + "http://localhost:8001/openapi.json");
  if (!res.ok) throw new Error(`Failed to fetch OpenAPI: ${res.statusText}`);
  const json = await res.json();
  return json as OpenAPIObject;
}

interface ApiProviderProps {
  children: ReactNode;
}

export default function ApiProvider({ children }: ApiProviderProps) {
  const [url, setUrl] = useState("");
  const [openAPI, setOpenAPI] = useState<OpenAPIObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOpenAPI(url);
      setOpenAPI(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const value: ApiContextType = {
    url,
    setUrl,
    openAPI,
    loading,
    error,
    refetch: fetchData,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
