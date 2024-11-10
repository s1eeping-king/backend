use crate::StorageData;
use crate::MERKLE_MAP;
use core::slice::IterMut;
use zkwasm_rest_abi::Player;
use serde::{Serialize, Deserialize};
use crate::settlement::SettlementInfo;

#[derive(Debug, Clone, Copy, Serialize)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Serialize)]
pub struct PlayerData {
    pub health: u64,        // 玩家生命值
    pub stamina: u64,       // 玩家体力值
    pub coins: u64,         // 玩家当前金币数量
    pub position: Position, // 玩家的当前位置
    pub eventMessage: u64,  // 本次移动的事件描述，是可选的
}

impl Default for PlayerData {
    fn default() -> Self {
        Self {
            health: 100,
            stamina: 100,
            coins: 0,
            position: Position { x: 0, y: 0 },
            eventMessage: 0,
        }
    }
}

impl PlayerData {
    // 扣除体力值
    pub fn reduce_stamina(&mut self, amount: u64) {
        if self.stamina >= amount {
            self.stamina -= amount;
        } else {
            self.stamina = 0;
        }
    }

    // 扣除体力值和生命值
    pub fn hit_trap(&mut self, damage: u64) {
        self.reduce_stamina(damage);
        if self.health >= damage {
            self.health -= damage;
        } else {
            self.health = 0;
        }
    }

    // 使用金币购买体力值或生命值
    pub fn buy_health_or_stamina(&mut self, health_amount: u64, stamina_amount: u64) -> bool {
        let cost = (health_amount + stamina_amount) * 10; // 每单位生命值或体力值的价格为10金币
        if self.coins >= cost {
            self.coins -= cost;
            self.health += health_amount;
            self.stamina += stamina_amount;
            true
        } else {
            false
        }
    }

    // 计算积分
    pub fn calculate_score(&self) -> u64 {
        self.coins * 10
    }
}

impl StorageData for PlayerData {
    fn from_data(u64data: &mut IterMut<u64>) -> Self {
        let health = *u64data.next().unwrap();
        let stamina = *u64data.next().unwrap();
        let coins = *u64data.next().unwrap();
        let x = *u64data.next().unwrap() as i32; // 假设 x 和 y 是 i32 类型
        let y = *u64data.next().unwrap() as i32; // 假设 x 和 y 是 i32 类型
        let eventMessage = *u64data.next().unwrap();
        PlayerData {
            health,
            stamina,
            coins,
            position: Position { x, y },
            eventMessage,
        }
    }
    fn to_data(&self, data: &mut Vec<u64>) {
        data.push(self.health);
        data.push(self.stamina);
        data.push(self.coins);
        data.push(self.position.x as u64);
        data.push(self.position.y as u64);
        data.push(self.eventMessage);
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SimpleRNG {
    state: u64,
}

impl SimpleRNG {
    // 初始化 RNG 并设置种子
    pub fn new(seed: u64) -> Self {
        SimpleRNG { state: seed }
    }

    // 生成一个伪随机 u32 值
    pub fn next_u32(&mut self) -> u32 {
        self.state = self.state.wrapping_mul(6364136223846793005).wrapping_add(1);
        (self.state >> 32) as u32
    }

    // Fisher-Yates shuffle 用于随机化给定向量
    pub fn shuffle<T>(&mut self, data: &mut [T]) {
        let len = data.len();
        for i in (1..len).rev() {
            let j = (self.next_u32() as usize) % (i + 1);
            data.swap(i, j);
        }
    }
}


pub type HelloWorldPlayer = Player<PlayerData>;

#[derive(Serialize, Deserialize, Debug)]
pub struct Gamemap {
    pub game_map: Vec<Vec<u64>>,
    pub trap_positions: Vec<(u64, u64)>,
    pub chest_positions: Vec<(u64, u64)>,
    pub treasure_position: (u64, u64),
    rng: SimpleRNG,
}

impl Gamemap {
    pub fn new(size: (usize, usize), level: u64, seed: u64) -> Self {
        const PATH: u64 = 0;
        const WALL: u64 = 1;
        const TRAP: u64 = 2;
        const CHEST: u64 = 3;
        const TREASURE: u64 = 4;

        let (width, height) = size;
        let mut game_map = vec![vec![WALL; width]; height];
        let mut trap_positions = Vec::new();
        let mut chest_positions = Vec::new();
        let mut treasure_position = (0, 0);

        let mut rng = SimpleRNG::new(seed);

        // 使用栈的非递归 DFS 生成迷宫
        let mut stack = vec![(1, 1)];
        game_map[1][1] = PATH;

        while let Some((x, y)) = stack.pop() {
            let mut directions = vec![(2, 0), (0, 2), (-2, 0), (0, -2)];
            rng.shuffle(&mut directions);

            for (dx, dy) in directions {
                let nx = (x as isize + dx) as usize;
                let ny = (y as isize + dy) as usize;

                // 检查新的坐标是否在地图边界内，并且是否是墙
                if nx > 0 && ny > 0 && nx < width - 1 && ny < height - 1 && game_map[nx][ny] == WALL {
                    game_map[(x as isize + dx / 2) as usize][(y as isize + dy / 2) as usize] = PATH;
                    game_map[nx][ny] = PATH;
                    stack.push((nx, ny));
                }
            }
        }

        // 设置终点（宝藏位置）为右下角
        game_map[width - 2][height - 2] = PATH;
        game_map[width - 1][height - 1] = TREASURE;
        treasure_position = ((width - 1) as u64, (height - 1) as u64);

        // 随机分配陷阱和宝箱
        let max_traps = usize::min(5 + level as usize, 15);
        let max_chests = usize::min(3 + level as usize, 10);
        let mut trap_count = 0;
        let mut chest_count = 0;

        for i in 1..width - 1 {
            for j in 1..height - 1 {
                if game_map[i][j] == PATH {
                    if trap_count < max_traps && rng.next_u32() % 7 == 0 {
                        game_map[i][j] = TRAP;
                        trap_positions.push((i as u64, j as u64));
                        trap_count += 1;
                    } else if chest_count < max_chests && rng.next_u32() % 11 == 0 {
                        game_map[i][j] = CHEST;
                        chest_positions.push((i as u64, j as u64));
                        chest_count += 1;
                    }
                }
            }
        }

        Gamemap {
            game_map,
            trap_positions,
            chest_positions,
            treasure_position,
            rng,
        }
    }
}
#[derive (Serialize)]
pub struct State {
    game_map: Gamemap,
    leaderboard: Leaderboard, // 添加 leaderboard 字段
}

impl State {
    pub fn get_state(pkey: Vec<u64>) -> String {
        let player = HelloWorldPlayer::get_from_pid(&HelloWorldPlayer::pkey_to_pid(&pkey.try_into().unwrap()));
        serde_json::to_string(&player).unwrap()
    }
    pub fn new(gamemap: Gamemap) -> Self {
        State {
            game_map: gamemap,
            leaderboard: Leaderboard { players: vec![] }, // 初始化 leaderboard
        }
    }


    pub fn rand_seed() -> u64 {
        0
    }
    pub fn snapshot() -> String {
        let state = unsafe { &GAME_STATE };
        unsafe { serde_json::to_string(&GAME_STATE).unwrap() }
    }
    pub fn store(&self) {
    }

    pub fn initialize() {
    }
    pub fn preempt() -> bool {
        // 在这里实现中断条件，当前返回 false
        false
    }

    pub fn flush_settlement() -> Vec<u8> {
        let data = SettlementInfo::flush_settlement();
        unsafe {GAME_STATE.store()};
        data
    }
}

// 使用 State::new 方法来创建一个 State 实例
pub static mut GAME_STATE: State = State::new(Gamemap {
    game_map: vec![],
    trap_positions: vec![],
    chest_positions: vec![],
    treasure_position: (0, 0),
    rng: SimpleRNG { state: 0 },
});

pub struct Transaction {
    pub command: u64,
    pub data: Vec<u64>,
}

const AUTOTICK: u64 = 0;
const INSTALL_PLAYER: u64 = 1;
const SET_GAME_MAP: u64 = 3;
const COINS_UP: u64 = 4;
const COINS_DOWN: u64 = 5;
const MOVEMENT: u64 = 6;
const BUY_HEALTH_OR_STAMINA: u64 = 7; // 新增购买体力或生命值命令

const ERROR_PLAYER_ALREADY_EXIST:u32 = 1;
const ERROR_PLAYER_NOT_EXIST:u32 = 2;

const ERROR_INSUFFICIENT_COINS: u32 = 3;

impl Transaction {
    const ERROR_PLAYER_ALREADY_EXIST:u32 = 1;
    const ERROR_PLAYER_NOT_EXIST:u32 = 2;

    const ERROR_INSUFFICIENT_COINS: u32 = 3;
    // 错误代码
    pub fn decode_error(e: u32) -> &'static str {
        match e {
            ERROR_PLAYER_NOT_EXIST => "PlayerNotExist",
            ERROR_PLAYER_ALREADY_EXIST => "PlayerAlreadyExist",
            _ => "Unknown"
        }
    }
    pub fn decode(params: [u64; 4]) -> Self {
        let command = params[0] & 0xff;
        let amount = params[1]; // 假设 params[1] 是 amount 参数
        let pkey = [params[2], params[3]]; // pkey[0], pkey[1]
        Transaction {
            command,
            data: vec![amount, pkey[0], pkey[1]], // 存储 amount 和 pkey
        }
    }

    // 安装玩家
    pub fn install_player(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        let player = HelloWorldPlayer::get_from_pid(&pid);
        if player.is_none() {
            let player = HelloWorldPlayer::new_from_pid(pid);
            player.store();
            0
        } else {
            0 // 不限制多个玩家注册
        }
    }

    // 增加玩家的金币
    pub fn coins_up(&self, pkey: &[u64; 4], amount: u64) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                player.data.coins += amount;
                player.store();
                0
            }
            None => Transaction::ERROR_PLAYER_NOT_EXIST,
        }
    }


    // 购买生命值或体力值
    pub fn buy_health_or_stamina(&self, pkey: &[u64; 4], health_amount: u64, stamina_amount: u64) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                if player.data.buy_health_or_stamina(health_amount, stamina_amount) {
                    player.store();
                    0
                } else {
                    Transaction::ERROR_INSUFFICIENT_COINS
                }
            }
            None => Transaction::ERROR_PLAYER_NOT_EXIST,
        }
    }

    // 获取玩家的分数
    pub fn get_score(&self, pkey: &[u64; 4]) -> Option<u64> {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        HelloWorldPlayer::get_from_pid(&pid).map(|player| player.data.calculate_score())
    }

    pub fn coins_down(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                // 更新玩家的金钱计数器
                player.data.coins -= 1;//不能先减一
                zkwasm_rust_sdk::dbg!("reach coins_down branch\n");
                // 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }

    pub fn movement(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        zkwasm_rust_sdk::dbg!("reach movement branch\n");
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                match self.data[0] {
                    0 =>{//up
                        player.data.position.y -= 1;
                        zkwasm_rust_sdk::dbg!("reach 0 branch\n");
                    },
                    1 =>{//down
                        player.data.position.y += 1;
                        zkwasm_rust_sdk::dbg!("reach 1 branch\n");
                    }
                    2 =>{//left
                        player.data.position.x -= 1;
                        zkwasm_rust_sdk::dbg!("reach 2 branch\n");
                    },
                    3 =>{//right
                        player.data.position.x += 1;
                        zkwasm_rust_sdk::dbg!("reach 3 branch\n");
                    }
                    _ => {
                        zkwasm_rust_sdk::dbg!("reach unknown branch\n");
                    }
                }// 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }
    pub fn process(&self, pkey: &[u64; 4], _rand: &[u64; 4]) -> u32 {
        match self.command {
            // AUTOTICK => {
            //     unsafe { STATE.tick() };
            //     return 0;
            // },
            INSTALL_PLAYER => self.install_player(pkey),
            COINS_UP => {
                if let Some(amount) = self.data.get(0) {
                    self.coins_up(pkey, *amount)
                } else {
                    // 处理错误情况，例如记录日志或返回错误代码
                    0 // 或者返回一个错误代码
                }
            },
            COINS_DOWN => self.coins_down(pkey),
            MOVEMENT => self.movement(pkey),
            _ => {
                return 0
            }
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Leaderboard {
    players: Vec<HelloWorldPlayer>,
}

impl Leaderboard {
    pub fn update_leaderboard(&mut self) {
        self.players.sort_by_key(|player| -(player.data.calculate_score() as i64));
    }

    pub fn get_top_n(&self, n: usize, pkey: &[u64; 4]) -> Vec<(u64, u64)> {
        self.players
            .iter()
            .take(n)
            .map(|player| {
                // 假设每个 player 都有一个 id 方法来获取他们的 ID 和一个 score 方法来获取分数
                let pid = player.id(); // 使用 player 的 id 方法获取玩家 ID
                let score = player.score(); // 使用 player 的 score 方法获取玩家的分数
                (pid, score) // 返回一个元组 (pid, score)
            })
            .collect()
    }
}
