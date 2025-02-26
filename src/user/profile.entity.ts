import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  gender: number;

  @Column()
  @Expose()
  images: string;

  @Column()
  @Expose()
  avatar: string;

  @Column()
  @Expose()
  address: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;
}
