import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { App } from './app.entity';

@Entity()
export class ChildApp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => App)
  app: App;

  @Column()
  count: number = 0;

  static of(app) {
    const childApp = new ChildApp();
    childApp.app = app;
    return childApp;
  }
}
