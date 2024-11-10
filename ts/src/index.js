// index.js
// const myUtils = {
//     hello: () => 'Hello from my-utils!',
//     goodbye: () => 'Goodbye from my-utils!10293'
//   };
  
//   module.exports = myUtils;

// async function addmoney() {
//     //let towerId = 10038n + y;
    
//     let state = await player.coins_down();
//     console.log(state);
// }


import { Player } from "./api.js";
let account = "1234";
let player = new Player(account, "http://localhost:3000");

export async function addmoney() {
  let state = await player.coins_down();
  console.log(state);
  return `Hello!`;
}

export async function register() {
  let state = await player.register();
  console.log(state);
  return `Hello!`;
}

