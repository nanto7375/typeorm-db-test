import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aaa } from './aaa.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transaction';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Aaa) private readonly aaaRepository: Repository<Aaa>,
    private readonly transaction: Transaction,
  ) {}

  setData() {
    const aaa = Aaa.of('test4');
    return this.aaaRepository.save(aaa);
  }
}
