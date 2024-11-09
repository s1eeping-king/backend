// main.rs

use game_server::handlers;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let app = game_server::app();
    let server = axum::Server::bind(&"0.0.0.0:5000".parse().unwrap())
        .serve(app.into_make_service());
    log::info!("Server running on 0.0.0.0:5000");
    tokio::spawn(async move {
        server.await.unwrap();
    });
}
