// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// 地图元素常量
const PATH = 0;
const WALL = 1;
const TRAP = 2;
const CHEST = 3;
const TREASURE = 4;

// 初始化玩家数据（可以扩展为数据库存储）
let playerData = {
    health: 100,
    coins: 0,
    points: 0,  // 积分字段
    position: { x: 1, y: 1 }
};

// 使用 JSON 解析请求体
app.use(bodyParser.json());

// 兑换率：1 金币 = 10 积分
const COIN_TO_POINT_RATE = 10;

// 生成迷宫路径的函数
const generateMazeWithPaths = (size, level) => {
    // 初始化地图为墙壁
    const map = Array.from({ length: size }, () => Array(size).fill(WALL));

    // 深度优先搜索生成路径
    const createMazePath = (x, y) => {
        map[x][y] = PATH;
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        directions.sort(() => Math.random() - 0.5); // 随机化方向

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && map[nx][ny] === WALL) {
                map[x + dx][y + dy] = PATH;
                createMazePath(nx, ny);
            }
        }
    };

    // 从起点 (1,1) 开始创建迷宫
    createMazePath(1, 1);

    // 设置终点（宝藏位置）为右下角
    map[size - 2][size - 2] = PATH;
    map[size - 1][size - 1] = TREASURE;

    // 确保起点和终点之间有一条路径
    const isPathToTreasure = (startX, startY) => {
        const queue = [[startX, startY]];
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        visited[startX][startY] = true;

        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x === size - 1 && y === size - 1) return true;
            for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 &&
                    ny >= 0 &&
                    nx < size &&
                    ny < size &&
                    !visited[nx][ny] &&
                    (map[nx][ny] === PATH || map[nx][ny] === TREASURE)
                ) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny]);
                }
            }
        }
        return false;
    };

    // 如果没有路径通向终点，重新生成
    while (!isPathToTreasure(1, 1)) {
        map.forEach(row => row.fill(WALL));
        createMazePath(1, 1);
        map[size - 2][size - 2] = PATH;
        map[size - 1][size - 1] = TREASURE;
    }

    // 随机分配陷阱和宝箱数量
    const maxTraps = Math.min(5 + level, 15);
    const maxChests = Math.min(3 + level, 10);
    let trapCount = 0;
    let chestCount = 0;

    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            if (map[i][j] === PATH && trapCount < maxTraps && Math.random() < 0.1) {
                map[i][j] = TRAP;
                trapCount++;
            } else if (map[i][j] === PATH && chestCount < maxChests && Math.random() < 0.05) {
                map[i][j] = CHEST;
                chestCount++;
            }
        }
    }

    return map;
};

// 初始化地图 API
app.get('/api/initMap', (req, res) => {
    const size = 15;
    const level = 1;
    const mapData = generateMazeWithPaths(size, level);
    playerData.position = { x: 1, y: 1 };
    res.json({ map: mapData, startPosition: playerData.position });
});

// 移动玩家 API
app.post('/api/move', (req, res) => {
    const direction = req.body.direction;
    const { x, y } = playerData.position;

    const directions = {
        up: { x: x - 1, y },
        down: { x: x + 1, y },
        left: { x, y: y - 1 },
        right: { x, y: y + 1 }
    };
    const newPosition = directions[direction];

    if (newPosition.x >= 0 && newPosition.y >= 0 && newPosition.x < 15 && newPosition.y < 15) {
        playerData.position = newPosition;
        res.json({
            health: playerData.health,
            coins: playerData.coins,
            position: playerData.position,
            eventMessage: 'Player moved'
        });
    } else {
        res.status(400).json({ error: 'Invalid move' });
    }
});

// 提交分数 API
app.post('/api/submitScore', (req, res) => {
    const coins = req.body.coins;
    playerData.coins += coins;
    console.log(`Score submitted: ${coins} coins.`);
    res.json({ message: 'Score submitted successfully' });
});

// 更新体力 API
app.post('/api/updateHealth', (req, res) => {
    const { health } = req.body;
    playerData.health = health;
    res.json({ message: 'Health updated successfully', health: playerData.health });
});

// 购买道具 API
app.post('/api/purchaseItem', (req, res) => {
    const { item, coins } = req.body;
    if (playerData.coins >= coins) {
        playerData.coins -= coins;
        if (item === 'Health Potion') {
            playerData.health += 20;
        }
        res.json({
            message: `Purchased ${item}. Coins deducted: ${coins}`,
            health: playerData.health,
            coins: playerData.coins
        });
    } else {
        res.status(400).json({ error: 'Not enough coins' });
    }
});

// 新增积分兑换 API
app.post('/api/convertCoinsToPoints', (req, res) => {
    const coinsToConvert = req.body.coins;
    if (playerData.coins >= coinsToConvert) {
        playerData.coins -= coinsToConvert;
        const pointsGained = coinsToConvert * COIN_TO_POINT_RATE;
        playerData.points += pointsGained;

        console.log(`Converted ${coinsToConvert} coins to ${pointsGained} points.`);
        res.json({
            message: 'Coins converted to points successfully',
            points: playerData.points,
            remainingCoins: playerData.coins
        });
    } else {
        res.status(400).json({ error: 'Not enough coins to convert' });
    }
});

// 奖励瓜分接口示例（假设有链上交互）
app.post('/api/distributeRewards', (req, res) => {
    const { points } = playerData;

    // 简单逻辑：积分达到一定标准，触发奖励瓜分（模拟上链操作）
    if (points >= 1000) {
        // 假设与区块链交互的操作在此处调用
        console.log('Distributing rewards on-chain...');
        playerData.points -= 1000;
        res.json({ message: 'Rewards distributed successfully on-chain' });
    } else {
        res.status(400).json({ error: 'Not enough points for reward distribution' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
