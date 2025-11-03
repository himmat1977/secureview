import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

class StorageService {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Auth specific methods
  async saveToken(token: string): Promise<void> {
    console.log('=== SAVING TOKEN ===');
    console.log('Token to save:', token ? `${token.substring(0, 20)}...` : 'null');
    await this.setItem(STORAGE_KEYS.USER_TOKEN, token);
    console.log('Token saved successfully');
  }

  async getToken(): Promise<string | null> {
    const token = await this.getItem<string>(STORAGE_KEYS.USER_TOKEN);
    console.log('=== GETTING TOKEN ===');
    console.log('Retrieved token:', token ? `${token.substring(0, 50)}...` : 'null');
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length || 0);
    return token;
  }

  async removeToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER_TOKEN);
  }

  async saveUserData(userData: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData(): Promise<any> {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }

  async removeUserData(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER_DATA);
  }
}

export default new StorageService();
