import { Schema, model } from "mongoose";
import { IKeyboard, IKeyboardModel } from "./keyboard.interface";
import jwt from "jsonwebtoken";

export const KeyboardSchema = new Schema(
  {
    keys: [
      {
        row: Number,
        col: Number,
        state: {
          type: String,
          enum: ["white", "red", "yellow"],
          default: "white",
        },
      },
    ],
    currentControl: {
      user: {
        type: Number,
        enum: [1, 2],
        default: null,
      },
      acquiredAt: Date,
      timeout: {
        type: Number,
        default: 120000,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

KeyboardSchema.statics = {
  addKeyBoard: async (userData) => {
    try {
      const KeyboardDoc = new Keyboard(userData);
      const doc = await KeyboardDoc.save();
      return doc;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getKeyBoardsByQuery: async function (matchQuery) {
    try {
      const assignedKeyBoards = await this.find(matchQuery);
      return assignedKeyBoards;
    } catch (err) {
      throw err;
    }
  },
  getKeyBoardInfoById: async function (KeyBoardId, selectQuery) {
    try {
      const KeyBoardDoc = await this.findById(KeyBoardId).select(selectQuery);
      return KeyBoardDoc;
    } catch (err) {
      throw err;
    }
  },
  getOneKeyBoardInfo: async function (matchQuery = {}, selectQuery = {}) {
    try {
      const KeyBoardDoc = await this.findOne(matchQuery).select(selectQuery);

      return KeyBoardDoc;
    } catch (err) {
      throw err;
    }
  },
  updateKeyBoard: async function (matchQuery, modifiedData) {
    try {
      const updatedDoc = await this.findByIdAndUpdate(
        matchQuery,
        { $set: modifiedData },
        {
          new: true,
        }
      );
      return updatedDoc;
    } catch (error) {
      throw error;
    }
  },
};

const Keyboard = model<IKeyboard, IKeyboardModel>("keyboard", KeyboardSchema);
export default Keyboard;
