import { Document, Model, Types } from "mongoose";

export interface IKeyState {
  row: number;
  col: number;
  state: "white" | "red" | "yellow";
}

export interface ICurrentControl {
  user: 1 | 2 | null;
  acquiredAt?: Date;
  timeout?: number;
}

export interface IKeyboardSchema extends Document {
  keys: IKeyState[];
  currentControl: ICurrentControl;
}

export interface IKeyboard extends IKeyboardSchema {}
export interface IKeyboardPopulated extends IKeyboard {}

// Extended Model Interface with static methods
export interface IKeyboardModel extends Model<IKeyboard> {
  generateAuthToken(userData: any): Promise<string>;
  addKeyBoard(KeyBoardData: any): Promise<IKeyboard>;
  getKeyBoardsByQuery(matchQuery: object): Promise<IKeyboard[]>;
  getKeyBoardInfoById(KeyBoardId: string): Promise<IKeyboard | null>;
  getOneKeyBoardInfo(
    matchQuery?: object,
    selectQuery?: object
  ): Promise<IKeyboard | null>;
  updateKeyBoard(
    matchQuery: object,
    modifiedData: object
  ): Promise<IKeyboard | null>;
}
