import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Aaa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  count: number = 0;

  static of(name) {
    const aaa = new Aaa();
    aaa.name = name;
    return aaa;
  }
}
