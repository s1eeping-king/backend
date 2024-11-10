// async function main() {
//     //let towerId = 10038n + y;

//     const a = BigInt(1);
//     let state = await player.movement(a);
//     console.log(state.player.data.position);
//     current_position = state.player.data.position;
// }

import { Player } from "./api.js";
let account = "1234";
let player = new Player(account, "http://localhost:3000");
async function main() {
    //let towerId = 10038n + y;

    const a = BigInt(1);
    let state = await player.movement(a);
    console.log(state.player.data.position);
    let current_position = state.player.data.position;
}
main();