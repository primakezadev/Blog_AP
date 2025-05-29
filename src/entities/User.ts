import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UserRole = 'user' | 'admin';

@Entity('users') // ✅ table name in plural is a good convention
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: UserRole;

  @Column({ length: 255 })
  password!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
