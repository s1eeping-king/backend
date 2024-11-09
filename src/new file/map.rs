// map.rs
use rand::Rng; // 引入随机数生成器

pub struct Map {
    width: i32,
    height: i32,
    tiles: Vec<Vec<u32>>, // 使用 u32 来表示地图上的每个格子，可以根据需要存储更多信息
}

impl Map {
    // 创建一个新的地图实例

    // 创建一个新的随机地图实例
    pub fn new(width: i32, height: i32,seed:u64) -> Self {
        let mut rng = rand::thread_rng(); // 创建一个随机数生成器
        let mut tiles = vec![vec![0; width as usize]; height as usize]; // 初始化二维向量

        // 填充地图格子，边界设置为墙，内部随机生成墙和空地
        for y in 0..height {
            for x in 0..width {
                if x == 0 || x == (width - 1) || y == 0 || y == (height - 1) {
                    tiles[y as usize][x as usize] = 1; // 边界设为墙
                } else {
                    // 随机决定内部格子是墙（1）还是空地（0），可以调整概率
                    if rng.gen_range(0..100) < 30 { // 30% 的概率是墙
                        tiles[y as usize][x as usize] = 1; // 墙
                    } else {
                        tiles[y as usize][x as usize] = 0; // 空地
                    }
                }
            }
        }

        // 返回新的地图实例
        Map {
            width,
            height,
            tiles,
        }
    }


    // 获取起始位置
    pub fn get_start_position(&self) -> (i32, i32) {
        // 假设起始位置总是在左上角
        (0, 0)
    }

    // 可以添加更多地图相关的方法，比如检查位置是否可行走，获取周围地形等
}