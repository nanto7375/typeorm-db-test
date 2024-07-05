import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from './app.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transaction';
import { ChildApp } from './child-app.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App) private readonly appRepository: Repository<App>,
    @InjectRepository(ChildApp)
    private readonly childAppRepository: Repository<ChildApp>,
    private readonly transaction: Transaction,
  ) {}

  async setData() {
    const count = await this.appRepository.count();
    return this.appRepository.save(App.of(`test${count + 1}`));
  }

  async setDataUsingTransaction() {
    const { em, commit } = await this.transaction.start();
    return commit(async () => {
      const count = await em.count(App);
      return em.save(App.of(`test${count + 1}`));
    });
  }

  async setDataTwice() {
    return Promise.all([this.setData(), this.setData()]);
  }

  async setDataUsingTransactionTwice() {
    return Promise.all([
      this.setDataUsingTransaction(),
      this.setDataUsingTransaction(),
    ]);
  }

  async changeData() {
    const app = await this.appRepository.findOne({ where: { id: 1 } });
    // return this.appRepository.save(((app.count += 1), app));
    return this.appRepository.increment({ id: 1 }, 'count', 1);
  }

  async changeDataUsingTransaction(name?) {
    const { em, commit } = await this.transaction.start(name);
    return commit(async () => {
      const app = await em.findOne(App, {
        where: { id: 1 },
        lock: { mode: 'pessimistic_write' },
      });
      return await em.update(App, { id: app.id }, { count: app.count + 1 });
      // return em.save(((app.count += 1), app));
      // return em.increment(App, { id: 1 }, 'count', 1);
    });
  }

  async changeDataTwice() {
    const beforeApp = await this.appRepository.findOne({ where: { id: 1 } });
    console.log('before count: ', beforeApp.count);
    console.log('-----------------------------------');

    await Promise.all([this.changeData(), this.changeData()]);

    console.log('-----------------------------------');
    const afterApp = await this.appRepository.findOne({ where: { id: 1 } });
    console.log('after count: ', afterApp.count);
    console.log('gap: ', afterApp.count - beforeApp.count);
    return true;
  }

  async changeDataUsingTransactionTwice() {
    const beforeApp = await this.appRepository.findOne({ where: { id: 1 } });
    console.log('before count: ', beforeApp.count);
    console.log('----------------------------------------');

    await Promise.all([
      this.changeDataUsingTransaction('first'),
      this.changeDataUsingTransaction('second'),
      // this.changeDataUsingTransaction('third'),
    ]);

    console.log('----------------------------------------');
    const afterApp = await this.appRepository.findOne({ where: { id: 1 } });
    console.log('after count: ', afterApp.count);
    console.log('gap: ', afterApp.count - beforeApp.count);

    return true;
  }

  async insertChildUpdateParent() {
    const parantApp = await this.appRepository.findOne({ where: { id: 1 } });
    const logic = async () => {
      const childApp = ChildApp.of(parantApp);
      await this.childAppRepository.save(childApp);
      await this.appRepository.increment({ id: 1 }, 'count', 1);
    };
    await Promise.all([logic(), logic()]);
  }

  async insertChildUpdateParentUsingTransaction() {
    const parantApp = await this.appRepository.findOne({ where: { id: 1 } });
    const logic = async (name?) => {
      const { em, commit } = await this.transaction.start(name);
      return commit(async () => {
        const childApp = ChildApp.of(parantApp);
        await em.save(childApp);
        await em.increment(App, { id: 1 }, 'count', 1);
      });
    };
    await Promise.all([logic('first'), logic('second')]);
    return true;
  }
}
