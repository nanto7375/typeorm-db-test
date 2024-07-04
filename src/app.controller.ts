import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // curl로 편하게 요청하려고 그냥 get 사용
  @Get('set')
  setData() {
    return this.appService.setData();
  }
}
