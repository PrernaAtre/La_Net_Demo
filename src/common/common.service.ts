import { Injectable } from "@nestjs/common";
@Injectable()
export class CommonService {
  constructor() {}

  public publishablePostCount: number = 5;

  convertUnixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }
}
