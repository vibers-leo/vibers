import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  CREDITS: '@vibers_credits',
  DRAFTS: '@vibers_drafts',
  USER_TOKEN: 'vibers_github_token',
  PROJECT_HISTORY: '@vibers_projects',
  CHAT_HISTORY: '@vibers_chat_history',
  GEMINI_KEY: 'vibers_gemini_key',
  VERTEX_PROJECT_ID: 'vibers_vertex_project_id',
  VERTEX_LOCATION: 'vibers_vertex_location',
  SUBSCRIPTION_TIER: '@vibers_subscription_tier',
  PC_IP: 'vibers_pc_ip',
  PC_TOKEN: 'vibers_pc_token',
  PC_PORT: '@vibers_pc_port',
};

export const StorageService = {
  // Credits Management
  async getCredits(): Promise<number> {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.CREDITS);
    return val ? parseInt(val, 10) : 100; // Default 100
  },
  async saveCredits(amount: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CREDITS, amount.toString());
  },
  async hasEnoughCredits(required: number): Promise<boolean> {
    const current = await this.getCredits();
    return current >= required;
  },
  async deductCredits(amount: number): Promise<boolean> {
    const current = await this.getCredits();
    if (current < amount) return false;
    await this.saveCredits(current - amount);
    return true;
  },

  // Chat History
  async saveChatHistory(messages: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  },
  async getChatHistory(): Promise<any[] | null> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      console.error("Failed to load chat history", e);
      return null;
    }
  },

  // Project Drafts
  async saveDraft(projectId: string, files: any): Promise<void> {
    const drafts = await this.getAllDrafts();
    drafts[projectId] = {
      files,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  },
  async getAllDrafts(): Promise<any> {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.DRAFTS);
    return val ? JSON.parse(val) : {};
  },

  // Secure Token Storage (expo-secure-store)
  async saveGitHubToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_TOKEN, token);
  },
  async getGitHubToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.USER_TOKEN);
  },

  // Gemini API Key (secure)
  async saveGeminiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.GEMINI_KEY, key);
  },
  async getGeminiKey(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.GEMINI_KEY);
  },

  // Vertex AI Configs (secure)
  async saveVertexConfig(projectId: string, location: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.VERTEX_PROJECT_ID, projectId);
    await SecureStore.setItemAsync(STORAGE_KEYS.VERTEX_LOCATION, location);
  },
  async getVertexConfig(): Promise<{ projectId: string | null, location: string | null }> {
    const projectId = await SecureStore.getItemAsync(STORAGE_KEYS.VERTEX_PROJECT_ID);
    const location = await SecureStore.getItemAsync(STORAGE_KEYS.VERTEX_LOCATION);
    return { projectId, location };
  },

  // PC Agent Config (secure for token, normal for IP/port)
  async savePcConfig(ip: string, token: string, port: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PC_PORT, port);
    await SecureStore.setItemAsync(STORAGE_KEYS.PC_IP, ip);
    await SecureStore.setItemAsync(STORAGE_KEYS.PC_TOKEN, token);
  },
  async getPcConfig(): Promise<{ ip: string | null, token: string | null, port: string | null }> {
    const ip = await SecureStore.getItemAsync(STORAGE_KEYS.PC_IP);
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.PC_TOKEN);
    const port = await AsyncStorage.getItem(STORAGE_KEYS.PC_PORT);
    return { ip, token, port };
  },

  // Subscription Management
  async getSubscriptionTier(): Promise<'Free' | 'Pro' | 'Enterprise'> {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_TIER);
    return (val as any) || 'Free';
  },
  async saveSubscriptionTier(tier: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_TIER, tier);
  }
};
