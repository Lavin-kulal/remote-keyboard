import {
  encryptPayload,
  decryptPayload,
} from "../../common/Helper/cryptoHelper";
import Keyboard from "./keybaord.model";

export class KeyboardService {
  // Define a static constant
  private static readonly CONTROL_TIMEOUT = 120000; // 120 seconds

  async initializeKeyboard() {
    try {
      let keyboard = await Keyboard.findOne();

      if (!keyboard) {
        keyboard = new Keyboard({
          keys: Array(10)
            .fill({
              row: 0,
              col: 0,
              state: "white",
            })
            .map((_, index) => ({
              row: Math.floor(index / 5),
              col: index % 5,
              state: "white",
            })),
          currentControl: {
            user: null,
            acquiredAt: null,
            timeout: KeyboardService.CONTROL_TIMEOUT,
          },
        });

        await keyboard.save();
      }

      return keyboard;
    } catch (error) {
      console.error("Error initializing keyboard:", error);
      throw error;
    }
  }

  async getClientKeyboard() {
    try {
      const keyboard = await Keyboard.findOne();
      if (!keyboard) {
        return this.initializeKeyboard();
      }
      const now = Date.now();
      const controlAcquiredAt = keyboard.currentControl.acquiredAt
        ? new Date(keyboard.currentControl.acquiredAt).getTime()
        : null;

      if (
        keyboard.currentControl.user &&
        controlAcquiredAt &&
        now - controlAcquiredAt >= KeyboardService.CONTROL_TIMEOUT
      ) {
        keyboard.currentControl.user = null;
        keyboard.currentControl.acquiredAt = null;
        await keyboard.save();
      }

      return keyboard;
    } catch (error) {
      console.error("Error getting keyboard:", error);
      throw error;
    }
  }

  async getAcquireControl(userId: any) {
    try {
      let keyboard = await Keyboard.findOne();

      if (!keyboard) {
        keyboard = await this.initializeKeyboard();
      }
      if (keyboard.currentControl.user) {
        const elapsedTime =
          Date.now() -
          new Date(keyboard.currentControl.acquiredAt || 0).getTime();
        if (elapsedTime < KeyboardService.CONTROL_TIMEOUT) {
          throw new Error(
            "Another user currently has control of the keyboard."
          );
        }
      }
      keyboard.currentControl.user = userId;
      keyboard.currentControl.acquiredAt = new Date();
      await keyboard.save();
      return keyboard;
    } catch (error) {
      console.error("Error acquiring control:", error);
      throw error;
    }
  }

  async toggleKey(userData: { userId: any; row: number; col: number }) {
    try {
      const { userId, row, col } = userData;
      let keyboard = await Keyboard.findOne();

      if (!keyboard) {
        throw new Error("Keyboard not initialized");
      }
      if (keyboard.currentControl.user !== userId) {
        throw new Error("You do not have control of the keyboard.");
      }
      const keyIndex = keyboard.keys.findIndex(
        (k) => k.row === row && k.col === col
      );

      if (keyIndex !== -1) {
        const currentState = keyboard.keys[keyIndex].state;
        keyboard.keys[keyIndex].state =
          currentState === "white"
            ? userId === 1
              ? "red"
              : "yellow"
            : "white";
      }
      keyboard.currentControl.user = null;
      keyboard.currentControl.acquiredAt = null;
      await keyboard.save();
      return keyboard;
    } catch (error) {
      console.error("Error toggling key:", error);
      throw error;
    }
  }
}
