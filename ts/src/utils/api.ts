// src/utils/api.ts

import axios from 'axios';
import { MapData, PlayerData } from '../App';

const API_URL = 'http://localhost:3000/api';

export const initMap = async (): Promise<MapData | null> => {
    try {
        const response = await axios.get<MapData>(`${API_URL}/initMap`);
        return response.data;
    } catch (error) {
        console.error('Error initializing map:', error);
        return null;
    }
};

export const movePlayer = async (direction: string): Promise<PlayerData | null> => {
    try {
        const response = await axios.post<PlayerData>(`${API_URL}/move`, { direction });
        return response.data;
    } catch (error) {
        console.error('Error moving player:', error);
        return null;
    }
};

export const submitScore = async (coins: number): Promise<void> => {
    try {
        await axios.post(`${API_URL}/submitScore`, { coins });
        console.log('Score submitted successfully');
    } catch (error) {
        console.error('Error submitting score:', error);
    }
};

// 新增的 updateHealth 函数，用于更新玩家体力
export const updateHealth = async (newHealth: number): Promise<void> => {
    try {
        await axios.post(`${API_URL}/updateHealth`, { health: newHealth });
        console.log('Health updated successfully');
    } catch (error) {
        console.error('Error updating health:', error);
    }
};

// 新增的 purchaseItem 函数，用于购买增加体力的道具
export const purchaseItem = async (item: string, coins: number): Promise<void> => {
    try {
        await axios.post(`${API_URL}/purchaseItem`, { item, coins });
        console.log('Item purchased successfully');
    } catch (error) {
        console.error('Error purchasing item:', error);
    }
};
