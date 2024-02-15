import { HttpException, HttpStatus } from "@nestjs/common";



export class BadRequestException extends HttpException {
    constructor(status: number, msg: string) {
      super({ status: status, message: msg }, HttpStatus.BAD_REQUEST);
    }
  }