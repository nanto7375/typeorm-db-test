import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  count: number = 0;

  static of(name) {
    const app = new App();
    app.name = name;
    return app;
  }
}
