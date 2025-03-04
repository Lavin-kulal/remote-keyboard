import {
  Body,
  Controller,
  Request,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Get,
  Query,
  Put,
} from "tsoa";
import express from "express";
import { HttpResponseMessage } from "../../common/Constants/httpResponseMessage.enum";
import { HttpException, HttpSuccess } from "../../common/Helper/HttpResponse";
import { KeyboardService } from "./keybaord.service";

@Tags("Keyboard")
@Route("api/keyboard")
export class ClientController extends Controller {
  @SuccessResponse("200", HttpResponseMessage.FETCHED)
  @Get("/acquire-control")
  public async getAcquireControl(@Query() userId: string) {
    try {
      const keyboard = await new KeyboardService().getAcquireControl(userId);
      return new HttpSuccess(HttpResponseMessage.CREATED, keyboard);
    } catch (error) {
      throw new HttpException(400, error);
    }
  }
  @SuccessResponse(201, HttpResponseMessage.CREATED)
  @Post("/toggle-key")
  public async toggleKey(@Request() req: express.Request, @Body() userData) {
    try {
      const keyboard = await new KeyboardService().toggleKey(userData);
      return new HttpSuccess(HttpResponseMessage.CREATED, keyboard);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(400, error, error?.message);
    }
  }

  @SuccessResponse("200", HttpResponseMessage.FETCHED)
  @Get("/initialize-keyboard")
  public async initializeKeyboard(@Request() req: express.Request) {
    try {
      const keyboard = await new KeyboardService().initializeKeyboard();
      return new HttpSuccess(HttpResponseMessage.CREATED, keyboard);
    } catch (error: any) {
      console.log(error);
      throw new HttpException(400, error, error?.message);
    }
  }
  @Get("/get-keyboard")
  public async getKeyboard() {
    try {
      const data = await new KeyboardService().getClientKeyboard();
      return new HttpSuccess(HttpResponseMessage.FETCHED, data);
    } catch (error) {
      throw new HttpException(400, error);
    }
  }
}
