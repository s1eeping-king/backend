// index.js


// childModule.js
// export const greet = () => {
//   console.log('Hello from ES6 module!');
// };

// export default function() {
//   console.log('Default export from ES6 module!');
// }


export function sayHello(name) {
    return `Hello, ${name}!`;
}





// import { Player } from "./api.js";

// const account = "1234";
// const endpoint = "http://localhost:3000";

// const moneyUtils = {
//   account: "1234",
//   endpoint: "http://localhost:3000",
//   async to_require() {
//     let player = new Player(this.account, this.endpoint);
//     let state = await player.coins_down();
//     console.log(state);
//   },
//   goodbye: () => 'Goodbye from my-utils!29248',
// };

// exports = moneyUtils;




// money_up.js
// import { Player } from "./api.js";

// const moneyUtils = {
//   account: "1234",
//   endpoint: "http://localhost:3000",
//   async to_require() {
//     let player = new Player(this.account, this.endpoint);
//     let state = await player.coins_down();
//     console.log(state);
//   },
//   goodbye: () => 'Goodbye from my-utils!29248'
// };

// module.exports = moneyUtils;

// const myUtils = {
//     hello: () => 'Hello from my-utils!',
//     goodbye: () => 'Goodbye from my-utils!1'
//   };
  
//   module.exports = myUtils;