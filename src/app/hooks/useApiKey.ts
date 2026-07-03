import { useState, useCallback } from "react";

const STORAGE_KEY = "promptops_gemini_api_key";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? ""
  );

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setApiKeyState(trimmed);
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState("");
  }, []);

  const hasKey = apiKey.length > 0;
  const maskedKey = apiKey
    ? `AIza...${apiKey.slice(-4)}`
    : "";

  return { apiKey, setApiKey, clearApiKey, hasKey, maskedKey };
}
