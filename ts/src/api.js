import { ZKWasmAppRpc } from "zkwasm-ts-server";
function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
const CMD_INSTALL_PLAYER = 1n;
const CMD_INC_COUNTER = 2n;
function createCommand(nonce, command, feature) {
    return (nonce << 16n) + (feature << 8n) + command;
}
//const rpc = new ZKWasmAppRpc("http://114.119.187.224:8085");
//this.rpc = new ZKWasmAppRpc("http://localhost:3000");
export class Player {
    constructor(key, rpc) {
        this.processingKey = key;
        this.rpc = new ZKWasmAppRpc(rpc);
    }
    /* deposit
    async deposit(balance: bigint) {
      let nonce = await this.getNonce();
      let accountInfo = new LeHexBN(query(this.processingKey).pkx).toU64Array();
      try {
        let finished = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_DEPOSIT, 0n), accountInfo[1], accountInfo[2], balance]),
          this.processingKey
        );
        console.log("deposit processed at:", finished);
      } catch(e) {
        if(e instanceof Error) {
          console.log(e.message);
        }
        console.log("deposit error at processing key:", this.processingKey);
      }
    }
    */
    async getState() {
        let state = await this.rpc.queryState(this.processingKey);
        return JSON.parse(state.data);
    }
    async getNonce() {
        let state = await this.rpc.queryState(this.processingKey);
        let nonce = 0n;
        if (state.data) {
            let data = JSON.parse(state.data);
            if (data.player) {
                nonce = BigInt(data.player.nonce);
            }
        }
        return nonce;
    }
    async register() {
        let nonce = await this.getNonce();
        try {
            let result = await this.rpc.sendTransaction(new BigUint64Array([createCommand(nonce, CMD_INSTALL_PLAYER, 0n), 0n, 0n, 0n]), this.processingKey);
            return result;
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
        }
    }
    async incounter() {
        let nonce = await this.getNonce();
        try {
            let result = await this.rpc.sendTransaction(new BigUint64Array([createCommand(nonce, CMD_INC_COUNTER, 0n), 0n, 0n, 0n]), this.processingKey);
            // console.log("why");
            return result;
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
        }
    }
}
//# sourceMappingURL=api.js.map