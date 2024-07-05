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

  @Get('set/transaction')
  setDataUsingTransaction() {
    return this.appService.setDataUsingTransaction();
  }

  @Get('set/twice')
  setDataTwice() {
    return this.appService.setDataTwice();
  }

  @Get('set/transaction/twice')
  setDataUsingTransactionTwice() {
    return this.appService.setDataUsingTransactionTwice();
  }

  @Get('change/twice')
  changeDataTwice() {
    return this.appService.changeDataTwice();
  }

  @Get('change/transaction/twice')
  changeDataUsingTransactionTwice() {
    return this.appService.changeDataUsingTransactionTwice();
  }

  @Get('insert-update')
  insertChildUpdateParent() {
    return this.appService.insertChildUpdateParent();
  }

  @Get('insert-update/transaction')
  insertChildUpdateParentUsingTransaction() {
    return this.appService.insertChildUpdateParentUsingTransaction();
  }
}
