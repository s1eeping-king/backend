//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import { Player } from "./api.js";
let account = "12345";
let player = new Player(account, "http://localhost:3000");
async function main() {
  //let towerId = 10038n + y;
  let state = await player.getState();
  console.log(state);
  state = await player.register();
  console.log(state);
  state = await player.incounter();
  console.log(state);
}

main();

