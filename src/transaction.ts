import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Transaction {
  constructor(private readonly dataSource: DataSource) {}

  async start() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const timeoutId = setTimeout(async () => {
      if (queryRunner.isReleased) {
        return;
      }
      await queryRunner.release();
    }, 1000 * 60);

    return {
      em: queryRunner.manager,
      commit: async (cb) => {
        try {
          const result = await cb();
          await queryRunner.commitTransaction();
          return result;
        } catch (e) {
          console.error(e);
          await queryRunner.rollbackTransaction();
          throw e;
        } finally {
          await queryRunner.release();
          clearTimeout(timeoutId);
        }
      },
    };
  }
}
