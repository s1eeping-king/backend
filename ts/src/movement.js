//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import { Player } from "./api.js";

const API_URL = 'http://localhost:3000';
let account = "1234";
let player = new Player(account, API_URL);

let a = BigInt(1);

export async function movePlayer(direction) {
    const directionMap = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    };

    const directionIndex = directionMap[direction];
    if (directionIndex === undefined) {
        return null; // 如果方向无效，返回 null
    }

    a = BigInt(directionIndex);

    console.log(a); // 移动到此处，直接在 movePlayer 中打印
    let state = await player.movement(a); // 直接在 movePlayer 中调用 player.movement
    // console.log(state);
    // console.log(state.player.data.position);

    let real_state = state;
    let real_position = state.player.data.position;

    const playerState = {
        health: state.player.data.health,
        coins: state.player.data.coins,
        position: real_position,
        eventMessage: 'Player moved'
    };

    // 假设 current_position 是有效的，这里需要根据实际情况来检查
    return playerState;
};

// 定义 main 函数作为程序的入口点
export async function main() {
    try {
        const direction = 'down'; // 你可以根据需要改变方向
        const playerState = await movePlayer(direction);
        console.log('Player state after moving:', playerState);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 调用 main 函数
main();

// async function main() {
//     //let towerId = 10038n + y;

//     const a = BigInt(1);
//     let state = await player.movement(a);
//     console.log(state.player.data.position);
//     current_position = state.player.data.position;
// }

// export const movePlayer = async (direction: string): Promise<PlayerData | null> => {
//     try {
//         const response = await axios.post<PlayerData>(`${API_URL}/move`, { direction });
//         return response.data;
//     } catch (error) {
//         console.error('Error moving player:', error);
//         return null;
//     }
// };

// async function to_require_position() {
//     //let towerId = 10038n + y;

//     let state = await player.movement(a);
//     current_position = state.player.data.position;
//     return current_position;
// }

//# sourceMappingURL=test.js.map//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import axios from 'axios';
import { Player } from "./api.js";

const API_URL = 'http://localhost:3000';
let account = "1234";
let player = new Player(account, API_URL);

let a = BigInt(1);

export async function movePlayer(direction) {
    const directionMap = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    };

    const directionIndex = directionMap[direction];
    if (directionIndex === undefined) {
        return null; // 如果方向无效，返回 null
    }

    a = BigInt(directionIndex);

    console.log(a); // 移动到此处，直接在 movePlayer 中打印
    let state = await player.movement(a); // 直接在 movePlayer 中调用 player.movement
    // console.log(state);
    // console.log(state.player.data.position);

    let real_state = state;
    let real_position = state.player.data.position;

    const playerState = {
        health: state.player.data.health,
        coins: state.player.data.coins,
        position: real_position,
        eventMessage: 'Player moved'
    };

    // 假设 current_position 是有效的，这里需要根据实际情况来检查
    return playerState;
};

// 定义 main 函数作为程序的入口点
export async function main(direction) {
    try {
        // const direction = 'right'; // 你可以根据需要改变方向
        const playerState = await movePlayer(direction);
        console.log('Player state after moving:', playerState);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 调用 main 函数
main('down');

// async function main() {
//     //let towerId = 10038n + y;

//     const a = BigInt(1);
//     let state = await player.movement(a);
//     console.log(state.player.data.position);
//     current_position = state.player.data.position;
// }

// export const movePlayer = async (direction: string): Promise<PlayerData | null> => {
//     try {
//         const response = await axios.post<PlayerData>(`${API_URL}/move`, { direction });
//         return response.data;
//     } catch (error) {
//         console.error('Error moving player:', error);
//         return null;
//     }
// };

// async function to_require_position() {
//     //let towerId = 10038n + y;

//     let state = await player.movement(a);
//     current_position = state.player.data.position;
//     return current_position;
// }

//# sourceMappingURL=down.js.map//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import axios from 'axios';
import { Player } from "./api.js";

const API_URL = 'http://localhost:3000';
let account = "1234";
let player = new Player(account, API_URL);

let a = BigInt(1);

export async function movePlayer(direction) {
    const directionMap = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    };

    const directionIndex = directionMap[direction];
    if (directionIndex === undefined) {
        return null; // 如果方向无效，返回 null
    }

    a = BigInt(directionIndex);

    console.log(a); // 移动到此处，直接在 movePlayer 中打印
    let state = await player.movement(a); // 直接在 movePlayer 中调用 player.movement
    // console.log(state);
    // console.log(state.player.data.position);

    let real_state = state;
    let real_position = state.player.data.position;

    const playerState = {
        health: state.player.data.health,
        coins: state.player.data.coins,
        position: real_position,
        eventMessage: 'Player moved'
    };

    // 假设 current_position 是有效的，这里需要根据实际情况来检查
    return playerState;
};

// 定义 main 函数作为程序的入口点
export async function main(direction) {
    try {
        // const direction = 'right'; // 你可以根据需要改变方向
        const playerState = await movePlayer(direction);
        console.log('Player state after moving:', playerState);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 调用 main 函数
main('down');

// async function main() {
//     //let towerId = 10038n + y;

//     const a = BigInt(1);
//     let state = await player.movement(a);
//     console.log(state.player.data.position);
//     current_position = state.player.data.position;
// }

// export const movePlayer = async (direction: string): Promise<PlayerData | null> => {
//     try {
//         const response = await axios.post<PlayerData>(`${API_URL}/move`, { direction });
//         return response.data;
//     } catch (error) {
//         console.error('Error moving player:', error);
//         return null;
//     }
// };

// async function to_require_position() {
//     //let towerId = 10038n + y;

//     let state = await player.movement(a);
//     current_position = state.player.data.position;
//     return current_position;
// }

//# sourceMappingURL=test.js.map//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import axios from 'axios';
import { Player } from "./api.js";

const API_URL = 'http://localhost:3000';
let account = "1234";
let player = new Player(account, API_URL);

let a = BigInt(1);

export async function movePlayer(direction) {
    const directionMap = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    };

    const directionIndex = directionMap[direction];
    if (directionIndex === undefined) {
        return null; // 如果方向无效，返回 null
    }

    a = BigInt(directionIndex);

    console.log(a); // 移动到此处，直接在 movePlayer 中打印
    let state = await player.movement(a); // 直接在 movePlayer 中调用 player.movement
    // console.log(state);
    // console.log(state.player.data.position);

    let real_state = state;
    let real_position = state.player.data.position;

    const playerState = {
        health: state.player.data.health,
        coins: state.player.data.coins,
        position: real_position,
        eventMessage: 'Player moved'
    };

    // 假设 current_position 是有效的，这里需要根据实际情况来检查
    return playerState;
};

// 定义 main 函数作为程序的入口点
export async function main(direction) {
    try {
        // const direction = 'right'; // 你可以根据需要改变方向
        const playerState = await movePlayer(direction);
        console.log('Player state after moving:', playerState);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 调用 main 函数
main('down');

// async function main() {
//     //let towerId = 10038n + y;

//     const a = BigInt(1);
//     let state = await player.movement(a);
//     console.log(state.player.data.position);
//     current_position = state.player.data.position;
// }

// export const movePlayer = async (direction: string): Promise<PlayerData | null> => {
//     try {
//         const response = await axios.post<PlayerData>(`${API_URL}/move`, { direction });
//         return response.data;
//     } catch (error) {
//         console.error('Error moving player:', error);
//         return null;
//     }
// };

// async function to_require_position() {
//     //let towerId = 10038n + y;

//     let state = await player.movement(a);
//     current_position = state.player.data.position;
//     return current_position;
// }

//# sourceMappingURL=down.js.map