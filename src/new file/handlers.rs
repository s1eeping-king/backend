// handlers.rs

use axum::{extract::ContentNegotiation, handler::Handler, routing::get, Router};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub async fn init_map_handler() {
    // 处理初始化地图请求
    todo!()
}

pub async fn move_handler() {
    // 处理玩家移动请求
    todo!()
}

pub async fn submit_score_handler() {
    // 处理提交分数请求
    todo!()
}

pub async fn update_health_handler() {
    // 处理更新体力请求
    todo!()
}

pub async fn purchase_item_handler() {
    // 处理购买道具请求
    todo!()
}

pub fn app() -> Router {
    Router::new()
        .route("/api/initMap", get(init_map_handler))
        .route("/api/move", post(move_handler))
        .route("/api/submitScore", post(submit_score_handler))
        .route("/api/updateHealth", post(update_health_handler))
        .route("/api/purchaseItem", post(purchase_item_handler))
}
