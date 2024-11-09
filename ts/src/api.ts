import { query, ZKWasmAppRpc, LeHexBN } from "zkwasm-ts-server";
import BN from 'bn.js';

function bytesToHex(bytes: Array<number>): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

const CMD_INSTALL_PLAYER = 1n;
const CMD_INC_COUNTER = 2n;
const CMD_SET_GAME_MAP = 3n;
const CMD_BUY_HEALTH = 4n;
const CMD_BUY_STAMINA = 5n;
const CMD_MOVE_PLAYER = 6n;
const CMD_UPDATE_LEADERBOARD = 7n;

function createCommand(nonce: bigint, command: bigint, feature: bigint) {
  return (nonce << 16n) + (feature << 8n) + command;
}

export class Player {
  processingKey: string;
  rpc: ZKWasmAppRpc;

  constructor(key: string, rpc: string) {
    this.processingKey = key;
    this.rpc = new ZKWasmAppRpc(rpc);
  }

  async getState(): Promise<any> {
    let state: any = await this.rpc.queryState(this.processingKey);
    return JSON.parse(state.data);
  }

  async getNonce(): Promise<bigint> {
    let state: any = await this.rpc.queryState(this.processingKey);
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
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_INSTALL_PLAYER, 0n), 0n, 0n, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async getMap() {
    let nonce = await this.getNonce();
    try {
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_SET_GAME_MAP, 0n), 0n, 0n, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async buyHealth(amount: bigint) {
    let nonce = await this.getNonce();
    try {
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_BUY_HEALTH, amount), 0n, 0n, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async buyStamina(amount: bigint) {
    let nonce = await this.getNonce();
    try {
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_BUY_STAMINA, amount), 0n, 0n, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async movePlayer(newX: bigint, newY: bigint) {
    let nonce = await this.getNonce();
    try {
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_MOVE_PLAYER, 0n), newX, newY, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  async updateLeaderboard() {
    let nonce = await this.getNonce();
    try {
      let result = await this.rpc.sendTransaction(
          new BigUint64Array([createCommand(nonce, CMD_UPDATE_LEADERBOARD, 0n), 0n, 0n, 0n]),
          this.processingKey
      );
      return result;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }
}
