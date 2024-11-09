use crate::StorageData;
use crate::MERKLE_MAP;
use core::slice::IterMut;
use zkwasm_rest_abi::Player;
use serde::Serialize;
use crate::settlement::SettlementInfo;


#[derive(Debug, Serialize)]
pub struct PlayerData {
    pub health: u64,        // 更新后的体力值
    pub coins: u64,         // 玩家当前金币数量
    pub position_x: i32,
    pub position_y: i32,
    pub eventMessage: u64, // 本次移动的事件描述，是可选的
}

impl Default for PlayerData {
    fn default() -> Self {
        Self {
            health: 100,
            coins: 0,
            position_x: 0,
            position_y: 0,
            eventMessage: 0,
        }
    }
}

impl StorageData for PlayerData {
    fn from_data(u64data: &mut IterMut<u64>) -> Self {
        let health = *u64data.next().unwrap();
        let coins = *u64data.next().unwrap();
        let position_x = *u64data.next().unwrap() as i32; // 假设 x 和 y 是 i32 类型
        let position_y = *u64data.next().unwrap() as i32; // 假设 x 和 y 是 i32 类型
        let eventMessage = *u64data.next().unwrap();
        PlayerData {
            health,
            coins,
            position_x,
            position_y,
            eventMessage,
        }
    }
    fn to_data(&self, data: &mut Vec<u64>) {
        data.push(self.health);
        data.push(self.coins);
        data.push(self.position_x as i32);
        data.push(self.position_y as i32);
        data.push(self.eventMessage);
    }
}

pub type HelloWorldPlayer = Player<PlayerData>;

#[derive (Serialize)]
pub struct State {
    counter: u64
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
    }

    pub fn new() -> Self {
        State {
            counter: 0,
        }
    }

    pub fn snapshot() -> String {
        let state = unsafe { &STATE };
        serde_json::to_string(&state).unwrap()
    }

    pub fn preempt() -> bool {
        let state = unsafe {&STATE};
        return state.counter >= 20;
    }

    pub fn flush_settlement() -> Vec<u8> {
        let data = SettlementInfo::flush_settlement();
        unsafe {STATE.store()};
        data
    }

    pub fn tick(&mut self) {
        self.counter += 1;
    }
}

pub static mut STATE: State  = State {
    counter: 0
};

pub struct Transaction {
    pub command: u64,
    pub data: Vec<u64>,
}

const AUTOTICK: u64 = 0;
const INSTALL_PLAYER: u64 = 1;
const INC_COUNTER: u64 = 2;
const COINS_UP: u64 = 3;
const COINS_DOWN: u64 = 4;


const ERROR_PLAYER_ALREADY_EXIST:u32 = 1;
const ERROR_PLAYER_NOT_EXIST:u32 = 2;

enum movement_direction {
    Up,
    DOWN,
    RIGHT,
    LEFT,
}

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
                player.data.coins += 1;

                // 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }

    pub fn coins_up(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                // 更新玩家的金钱计数器
                player.data.coins += 1;

                // 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }

    pub fn coins_down(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                // 更新玩家的金钱计数器
                player.data.coins -= 1;

                // 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }

    pub fn movement(&self, pkey: &[u64; 4]) -> u32 {
        let pid = HelloWorldPlayer::pkey_to_pid(pkey);
        match HelloWorldPlayer::get_from_pid(&pid) {
            Some(mut player) => {
                match self.data[1] {
                    0 =>{
                        player.data.position_y += 1;
                    },
                    1 =>{
                        player.data.position_y -= 1;
                    }
                    2 =>{
                        player.data.position_x -= 1;
                    },
                    3 =>{
                        player.data.position_x += 1;
                    }
                    _ => {}
                }// 保存更新后的玩家数据
                player.store();
                0 // 成功的返回值
            },
            None => ERROR_PLAYER_NOT_EXIST, // 如果玩家不存在，返回错误
        }
    }

    pub fn process(&self, pkey: &[u64; 4], _rand: &[u64; 4]) -> u32 {
        match self.command {
            AUTOTICK => {
                unsafe { STATE.tick() };
                return 0;
            },
            INSTALL_PLAYER => self.install_player(pkey),
            INC_COUNTER => self.inc_counter(pkey),
            COINS_UP => self.coins_up(pkey),
            COINS_DOWN => self.coins_down(pkey),
            _ => {
                return 0
            }
        }
    }
}
