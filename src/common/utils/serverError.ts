import { HttpException } from "@nestjs/common";

export enum ServerErrorCause {
  UNKNOWN,
}

interface ErrorDetails {
  code: number;
  message: string;
  cause?: any;
}

export class ServerError extends HttpException {
  code: number;
  message: string;
  cause: any;

  constructor({ code, message, cause }: ErrorDetails) {
    super(message, code);

    this.code = code;
    this.message = message;
    this.cause = cause || ServerErrorCause.UNKNOWN;
  }
}
