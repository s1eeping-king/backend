// player.rs

pub struct Player {
    pub money: i32,
    pub health: i32,
    pub position: (i32, i32),
}

impl Player {
    pub fn new() -> Self {
        Player {
            money: 0, // 假设初始金币为0
            health: 100, // 假设初始健康值为100
            position: (0, 0), // 假设初始位置为(0, 0)
        }
    }

    pub fn update_position(&mut self, x: i32, y: i32) {
        self.position = (x, y); // 更新位置
    }

    pub fn update_health(&mut self, health: i32) {
        self.health = health; // 更新健康值
    }

    pub fn update_coins(&mut self, coins: i32) {
        self.money = coins; // 更新金币数量
    }
}