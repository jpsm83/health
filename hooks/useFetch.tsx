import { useEffect, useState, useCallback } from "react";

interface IUseFetch<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  resetHook: () => void;
}

export function useFetch<T>(fetchFn: () => Promise<T>): IUseFetch<T> {
  const [data, setData] = useState<T | null>(null); // State to hold the fetched data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const result = await fetchFn();
      setData(result); // Set the fetched data
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      console.error("Fetch error:", message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData(); // Automatically fetch data on mount
  }, []);

  const resetHook = useCallback(() => {
    setData(null);
    setLoading(true);
    setError(null);
  }, []);

  return { data, loading, error, refetch: fetchData, resetHook };
}