//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import { Player } from "./api.js";
let account = "1234";
let player = new Player(account, "http://localhost:3000");
async function main() {
    //let towerId = 10038n + y;
    
    let state = await player.coins_down();
    console.log(state);
}
main();
//# sourceMappingURL=test.js.map