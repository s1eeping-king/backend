// src/App.tsx

import React, { useState } from 'react';
import Map from './components/Map';
import PlayerStatus from './components/PlayerStatus';
import Controls from './components/Controls';
import EventLog from './components/EventLog';
import { initMap, movePlayer, submitScore, updateHealth, purchaseItem } from './utils/api';
import './styles.css';

export interface Position {
    x: number;
    y: number;
}

export interface PlayerData {
    health: number;
    coins: number;
    position: Position;
    eventMessage?: string;
}

export interface MapData {
    map: number[][];
    startPosition: Position;
    eventMessage: string;
}

// 地图元素常量
const PATH = 0;
const WALL = 1;
const TRAP = 2;
const CHEST = 3;
const TREASURE = 4;

// 生成确保通达终点的迷宫结构函数
const generateMazeWithPaths = (width: number, height: number, level: number): number[][] => {
    const map = Array.from({ length: height }, () => Array(width).fill(WALL));
    const treasureX = height - 2;
    const treasureY = width - 2;

    // 创建迷宫路径的DFS算法
    const createMazePath = (x: number, y: number) => {
        map[x][y] = PATH;
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        directions.sort(() => Math.random() - 0.5); // 随机化方向以生成不同路径
        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < height - 1 && ny < width - 1 && map[nx][ny] === WALL) {
                map[x + dx][y + dy] = PATH;
                createMazePath(nx, ny);
            }
        }
    };

    // 从左上角开始创建迷宫
    createMazePath(1, 1);

    // 确保宝藏位置为 PATH，并且放置宝藏
    map[treasureX][treasureY] = PATH;
    map[treasureX][treasureY - 1] = PATH;
    map[treasureX][treasureY + 1] = TREASURE;

    // 确保起点和宝藏终点之间有路径
    const ensurePathToTreasure = () => {
        const queue = [[1, 1]];
        const visited = Array.from({ length: height }, () => Array(width).fill(false));
        visited[1][1] = true;

        while (queue.length) {
            const [x, y] = queue.shift()!;
            if (x === treasureX && y === treasureY) {
                return; // 路径已找到
            }
            for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 &&
                    ny >= 0 &&
                    nx < height &&
                    ny < width &&
                    !visited[nx][ny] &&
                    (map[nx][ny] === PATH || map[nx][ny] === TREASURE)
                ) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny]);
                }
            }
        }

        // 如果没有路径连接到宝藏，则从起点创建一条路径
        createMazePath(1, 1);
    };

    // 确保终点可达
    ensurePathToTreasure();

    // 限制陷阱和宝箱的数量，根据关卡逐步增加，但不超过最大值
    const maxTraps = Math.min(5 + level, 15);
    const maxChests = Math.min(3 + level, 10);
    let trapCount = 0;
    let chestCount = 0;

    for (let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            if (map[i][j] === PATH && Math.random() < 0.1 && trapCount < maxTraps) {
                map[i][j] = TRAP;
                trapCount++;
            } else if (map[i][j] === PATH && Math.random() < 0.05 && chestCount < maxChests) {
                map[i][j] = CHEST;
                chestCount++;
            }
        }
    }

    return map;
};

// 健康条组件，动态显示健康条和百分比
const HealthBar: React.FC<{ health: number }> = ({ health }) => {
    const healthPercentage = Math.max(0, Math.min(100, health));

    return (
        <div className="health-bar">
            <div
                className="health-bar-fill"
                style={{
                    width: `${healthPercentage}%`,
                    background: `linear-gradient(90deg, ${healthPercentage > 50 ? '#4CAF50' : healthPercentage > 20 ? '#FFC107' : '#FF5722'}, #c0392b)`,
                }}
            ></div>
            <div className="health-text">{healthPercentage}%</div>
        </div>
    );
};

const App: React.FC = () => {
    const [level, setLevel] = useState(1); // 当前关卡数
    const [mapData, setMapData] = useState<number[][]>(generateMazeWithPaths(18, 36, level)); // 设置地图宽度为36，高度为18
    const [playerData, setPlayerData] = useState<PlayerData>({
        health: 100,
        coins: 0,
        position: { x: 1, y: 1 },
    });
    const [eventLog, setEventLog] = useState<string[]>([]);

    const handleStart = () => {
        setMapData(generateMazeWithPaths(18, 36, level)); // 重新生成宽度为36的迷宫
        setPlayerData({
            health: 100,
            coins: 0,
            position: { x: 1, y: 1 },
        });
        setEventLog(["游戏开始"]);
    };

    const handleMove = async (direction: string) => {
        const updatedData = await movePlayer(direction);
        if (updatedData) {
            const { x, y } = updatedData.position;
            if (mapData[x][y] !== WALL) { // 确保玩家不能走到墙上
                setPlayerData({
                    health: updatedData.health,
                    coins: updatedData.coins,
                    position: updatedData.position,
                });
                if (updatedData.eventMessage) {
                    setEventLog([...eventLog, updatedData.eventMessage]);
                }
            } else {
                setEventLog([...eventLog, "无法移动到该位置！"]);
            }
        }
    };

    const handleUpdateHealth = async (healthChange: number) => {
        const newHealth = playerData.health + healthChange;
        setPlayerData({ ...playerData, health: newHealth });
        await updateHealth(newHealth);
        setEventLog([...eventLog, `健康值更新：${healthChange}，新健康值：${newHealth}`]);
    };

    const handlePurchaseItem = async (item: string, cost: number, healthIncrease: number) => {
        if (playerData.coins >= cost) {
            const newCoins = playerData.coins - cost;
            const newHealth = playerData.health + healthIncrease;
            setPlayerData({ ...playerData, coins: newCoins, health: newHealth });
            await purchaseItem(item, newCoins);
            setEventLog([
                ...eventLog,
                `购买 ${item}。消耗金币：-${cost}，健康值增加：+${healthIncrease}`,
            ]);
        } else {
            setEventLog([...eventLog, "金币不足，无法购买该物品。"]);
        }
    };

    return (
        <div className="game-container-horizontal">
            <div className="left-panel">
                <HealthBar health={playerData.health} />

                <Map mapData={mapData} playerPosition={playerData.position} />
            </div>
            <div className="right-panel">
                <Controls onMove={handleMove} onStart={handleStart} />
                <EventLog events={eventLog} />
                <button className="submit-score-button" onClick={() => submitScore(playerData.coins)}>
                    提交分数
                </button>
                <button className="purchase-button" onClick={() => handlePurchaseItem("体力药水", 10, 20)}>
                    购买体力药水 (+20)
                </button>
            </div>
        </div>
    );
};

export default App;
