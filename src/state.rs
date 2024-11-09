use crate::StorageData;
use crate::MERKLE_MAP;
use core::slice::IterMut;
use zkwasm_rest_abi::Player;
use serde::Serialize;
use crate::settlement::SettlementInfo;

#[derive(Debug, Serialize)]
pub struct PlayerData {
    pub counter: u64,
    // pub width: u64,
    // pub height: u64,
    // pub level: u64,
    // pub seed: u64,
    // game_map: Gamemap

}

impl Default for PlayerData {
    fn default() -> Self {
        Self {
            counter: 0,
            // width: 0,
            // height: 0,
            // level: 0,
            // seed: 0,
            // game_map:Gamemap {
            //     game_map:vec![],
            //     trap_positions:vec![],
            //     chest_positions:vec![],
            //     treasure_position: (0,0),
            //     rng: SimpleRNG { state: 0 },
            // }
        }
    }
}

impl StorageData for PlayerData {
    fn from_data(u64data: &mut IterMut<u64>) -> Self {
        let counter = *u64data.next().unwrap();
        // let width = *u64data.next().unwrap();
        // let height = *u64data.next().unwrap();
        // let level = *u64data.next().unwrap();
        // let seed = *u64data.next().unwrap();
        // let game_map = Gamemap::new((width as usize, height as usize), level, seed);
        PlayerData {
            counter,
            // width,
            // height,
            // level,
            // seed,
            // game_map:game_map

        }
    }
    fn to_data(&self, data: &mut Vec<u64>) {
        data.push(self.counter);
        // data.push(self.width);
        // data.push(self.height);
        // data.push(self.level);
        // data.push(self.seed);

    }

}

pub type HelloWorldPlayer = Player<PlayerData>;

#[derive (Serialize)]
pub struct State {
    counter: u64,
    game_map: Gamemap
}

impl State {
    pub fn get_state(pkey: Vec<u64>) -> String {
        let player = HelloWorldPlayer::get_from_pid(&HelloWorldPlayer::pkey_to_pid(&pkey.try_into().unwrap()));
        serde_json::to_string(&player).unwrap()

    }

    pub fn rand_seed() -> u64 {
        0
    }

    pub fn store(&self) {
    }

    pub fn initialize() {
        // zkwasm_rust_sdk::dbg!("initialize\n");
        // unsafe {
        //     GameState.game_map = Gamemap::new((18, 35), 2, 10086);
        // }
        // zkwasm_rust_sdk::dbg!("initialized\n");

    }

    pub fn new(gamemap: Gamemap) -> Self {
        State {
            counter: 0,
            game_map:gamemap
        }
    }

    pub fn snapshot() -> String {
        let state = unsafe { &GameState };
        serde_json::to_string(&state).unwrap()
    }

    pub fn preempt() -> bool {
        let state = unsafe {&GameState };
        return state.counter >= 20;
    }

    pub fn flush_settlement() -> Vec<u8> {
        let data = SettlementInfo::flush_settlement();
        unsafe { GameState.store()};
        data
    }

    pub fn tick(&mut self) {
        self.counter += 1;
    }
}

pub static mut GameState: State  = State {
    counter: 0,
    game_map:Gamemap {
        // pub game_map: Vec<Vec<u64>>,
        // pub trap_positions:Vec<(u64, u64)>,
        // pub chest_positions:Vec<(u64, u64)>,
        // pub treasure_position: (u64, u64)
        game_map:vec![],
        trap_positions:vec![],
        chest_positions:vec![],
        treasure_position: (0,0),
        rng: SimpleRNG { state: 0 },
    }
};

pub struct Transaction {
    pub command: u64,
    pub data: Vec<u64>,
}

const AUTOTICK: u64 = 0;
const INSTALL_PLAYER: u64 = 1;
const INC_COUNTER: u64 = 2;
const SET_GAME_MAP: u64 = 3;

const ERROR_PLAYER_ALREADY_EXIST:u32 = 1;
const ERROR_PLAYER_NOT_EXIST:u32 = 2;

impl Transaction {
    pub fn decode_error(e: u32) -> &'static str {
        match e {
            ERROR_PLAYER_NOT_EXIST => "PlayerNotExist",
            ERROR_PLAYER_ALREADY_EXIST => "PlayerAlreadyExist",
            _ => "Unknown"
        }
    }
    pub fn decode(params: [u64; 4]) -> Self {
        let command = params[0] & 0xff;
        let data = vec![params[1], params[2], params[3]]; // pkey[0], pkey[1], amount
        Transaction {
            command,
            data,
        }
    }
    pub fn install_player(&self, pkey: &[u64; 4]) -> u32 {
        zkwasm_rust_sdk::dbg!("install \n");
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        let player = HelloWorldPlayer::get_from_pid(&pid);
        match player {
            Some(_) => ERROR_PLAYER_ALREADY_EXIST,
            None => {
                let player = HelloWorldPlayer::new_from_pid(pid);
                player.store();
                0
            }
        }
    }

    pub fn inc_counter(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                // 更新玩家的计数器
                player.data.counter += 1;

                // 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }
    pub fn set_game_map(&self,pkey:&[u64; 4])->u32 {
        zkwasm_rust_sdk::dbg!("set game map \n");
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                unsafe {
                    // State::initialize();
                    let game_map = Gamemap::new((18, 35), 2, 10086);
                    State::new(game_map);
                    player.store();
                }
                0
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }



    pub fn process(&self, pkey: &[u64; 4], _rand: &[u64; 4]) -> u32 {
        match self.command {
            AUTOTICK => {
                unsafe { GameState.tick() };
                return 0;
            },
            INSTALL_PLAYER => self.install_player(pkey),
            INC_COUNTER => self.inc_counter(pkey),
            SET_GAME_MAP =>self.set_game_map(pkey),
            _ => {
                return 0
            }
        }
    }
}



use serde::{ Deserialize};

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

// 伪随机数生成器结构体，支持序列化和反序列化
#[derive(Serialize, Deserialize, Debug)]
struct SimpleRNG {
    state: u64,
}

impl SimpleRNG {
    fn new(seed: u64) -> Self {
        SimpleRNG { state: seed }
    }

    fn next_u32(&mut self) -> u32 {
        self.state = self.state.wrapping_mul(1664525).wrapping_add(1013904223);
        (self.state >> 16) as u32
    }

    fn shuffle<T>(&mut self, items: &mut [T]) {
        let len = items.len();
        for i in 0..len {
            let j = self.next_u32() as usize % len;
            items.swap(i, j);
        }
    }
}
