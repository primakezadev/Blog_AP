import {Entity, Column, CreateDateColumn, UpdateDateColumn,PrimaryGeneratedColumn,  BaseEntity,OneToMany } from 'typeorm';
import { Blog} from "./blog"
export type UserRole = 'user' | 'admin';

@Entity('users')   
export class User extends BaseEntity {
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

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs!: Blog[];
}
