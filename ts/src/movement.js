//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
//import initHostBind, * as hostbind from "./wasmbind/hostbind.js";
import { Player } from "./api.js";
let account = "1234";
let player = new Player(account, "http://localhost:3030");

const a = BigInt(1);

// 移动玩家 API
app.post('/api/move', (req, res) => {
    const directionMap = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    };

    const direction = req.body.direction;

    const directionIndex = directionMap[direction];

    a = BigInt(directionIndex);
    current_position = to_require_position();
    state = to_require_state();
    
    if (current_position.x >= 0 && current_position.y >= 0 && current_position.x < 15 && current_position.y < 15) {
        playerData.position = current_position;
        res.json({
            health: state.health,
            coins: state.coins,
            position: current_position,
            eventMessage: 'Player moved'
        });
    } else {
        res.status(400).json({ error: 'Invalid move' });
    }
});


async function to_require_state() {
    //let towerId = 10038n + y;

    let state = await player.movement(a);
    console.log(state.player.data.position);
    return state;
}

async function to_require_position() {
    //let towerId = 10038n + y;

    let state = await player.movement(a);
    console.log(state.player.data.position);
    current_position = state.player.data.position;
    return current_position;
}

//# sourceMappingURL=test.js.map