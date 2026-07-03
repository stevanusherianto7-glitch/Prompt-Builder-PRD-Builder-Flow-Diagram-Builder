import { useState, useCallback, useEffect } from "react";

export type ApiProviderId = "gemini" | "claude" | "openai" | "deepseek";

export interface ProviderModel {
  id: string;
  name: string;
}

export interface ApiProviderInfo {
  id: ApiProviderId;
  name: string;
  shortName: string;
  storageKey: string;
  envKey?: string;
  placeholder: string;
  url: string;
  urlLabel: string;
  maskPrefix: string;
  defaultModel: string;
  models: ProviderModel[];
}

export const API_PROVIDERS: Record<ApiProviderId, ApiProviderInfo> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    shortName: "Gemini",
    storageKey: "promptops_gemini_api_key",
    envKey: "VITE_GEMINI_API_KEY",
    placeholder: "AIzaSy...",
    url: "https://aistudio.google.com/apikey",
    urlLabel: "aistudio.google.com",
    maskPrefix: "AIza...",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-flash", name: "gemini-2.5-flash ⚡" },
      { id: "gemini-2.5-pro", name: "gemini-2.5-pro" },
      { id: "gemini-2.0-flash", name: "gemini-2.0-flash" },
      { id: "gemini-3.5-flash", name: "gemini-3.5-flash" },
      { id: "gemini-2.0-flash-lite", name: "gemini-2.0-flash-lite" },
    ],
  },
  claude: {
    id: "claude",
    name: "Anthropic Claude",
    shortName: "Claude",
    storageKey: "promptops_claude_api_key",
    envKey: "VITE_CLAUDE_API_KEY",
    placeholder: "sk-ant-api03...",
    url: "https://console.anthropic.com/settings/keys",
    urlLabel: "console.anthropic.com",
    maskPrefix: "sk-ant...",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "claude-3.5-sonnet ⚡" },
      { id: "claude-3-5-haiku-20241022", name: "claude-3.5-haiku" },
      { id: "claude-3-opus-20240229", name: "claude-3-opus" },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI GPT-4",
    shortName: "OpenAI",
    storageKey: "promptops_openai_api_key",
    envKey: "VITE_OPENAI_API_KEY",
    placeholder: "sk-proj-...",
    url: "https://platform.openai.com/api-keys",
    urlLabel: "platform.openai.com",
    maskPrefix: "sk-proj...",
    defaultModel: "gpt-4o",
    models: [
      { id: "gpt-4o", name: "gpt-4o ⚡" },
      { id: "gpt-4o-mini", name: "gpt-4o-mini" },
      { id: "o1-preview", name: "o1-preview" },
      { id: "o3-mini", name: "o3-mini" },
    ],
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek AI",
    shortName: "DeepSeek",
    storageKey: "promptops_deepseek_api_key",
    envKey: "VITE_DEEPSEEK_API_KEY",
    placeholder: "sk-...",
    url: "https://platform.deepseek.com/api_keys",
    urlLabel: "platform.deepseek.com",
    maskPrefix: "sk-...",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "deepseek-v3 ⚡" },
      { id: "deepseek-reasoner", name: "deepseek-r1" },
    ],
  },
};

const SELECTED_PROVIDER_KEY = "promptops_selected_provider";

export function useApiKey() {
  const [providerId, setProviderIdState] = useState<ApiProviderId>(() => {
    const saved = localStorage.getItem(SELECTED_PROVIDER_KEY) as ApiProviderId;
    return API_PROVIDERS[saved] ? saved : "gemini";
  });

  const provider = API_PROVIDERS[providerId];

  const getStoredKey = (prov: ApiProviderInfo): string => {
    const local = localStorage.getItem(prov.storageKey);
    if (local) return local;
    if (prov.id === "gemini") return import.meta.env.VITE_GEMINI_API_KEY || "";
    return "";
  };

  const [apiKey, setApiKeyState] = useState<string>(() => getStoredKey(provider));

  useEffect(() => {
    const handleSync = () => {
      const currentProvId = (localStorage.getItem(SELECTED_PROVIDER_KEY) as ApiProviderId) || "gemini";
      const validProvId = API_PROVIDERS[currentProvId] ? currentProvId : "gemini";
      setProviderIdState(validProvId);
      setApiKeyState(getStoredKey(API_PROVIDERS[validProvId]));
    };
    window.addEventListener("apikey_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("apikey_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const setProviderId = useCallback((id: ApiProviderId) => {
    if (!API_PROVIDERS[id]) return;
    localStorage.setItem(SELECTED_PROVIDER_KEY, id);
    setProviderIdState(id);
    setApiKeyState(getStoredKey(API_PROVIDERS[id]));
    window.dispatchEvent(new Event("apikey_change"));
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(provider.storageKey, trimmed);
    } else {
      localStorage.removeItem(provider.storageKey);
    }
    setApiKeyState(trimmed);
    window.dispatchEvent(new Event("apikey_change"));
  }, [provider]);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(provider.storageKey);
    setApiKeyState("");
    window.dispatchEvent(new Event("apikey_change"));
  }, [provider]);

  const hasKey = apiKey.length > 0;
  const maskedKey = apiKey
    ? `${provider.maskPrefix}${apiKey.slice(-4)}`
    : "";

  return {
    provider,
    providerId,
    setProviderId,
    apiKey,
    setApiKey,
    clearApiKey,
    hasKey,
    maskedKey,
  };
}
