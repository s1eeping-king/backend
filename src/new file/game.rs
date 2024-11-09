// game.rs

use crate::Player;


pub struct Game {
    pub player: Player,
    // 可以添加更多游戏状态字段，比如地图、敌人等
}

impl Game {
    // 创建一个新的游戏实例
    pub fn new() -> Self {
        Game {
            player: Player::new(),
            // 初始化其他游戏状态
        }
    }

    // 移动玩家到新的位置
    pub fn move_player(&mut self, x: i32, y: i32) {
        self.player.update_position(x, y);
    }

    // 更新玩家的健康值
    pub fn update_player_health(&mut self, health: i32) {
        self.player.update_health(health);
    }

    // 更新玩家的金币数量
    pub fn update_player_coins(&mut self, coins: i32) {
        self.player.update_coins(coins);
    }

    // 可以添加更多的游戏逻辑方法，比如处理玩家与敌人的交互等
}