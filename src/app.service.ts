import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from './app.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transaction';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App) private readonly appRepository: Repository<App>,
    private readonly transaction: Transaction,
  ) {}

  setData() {
    const app = App.of('test4');
    return this.appRepository.save(app);
  }
}
