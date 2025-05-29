export interface Blog {
  id: number;
  title: string;
  content: string;
  author: User; 
}

export const blogPosts: Blog[] = [];
let blogIdCounter = 1;

export const generateBlogId = () => blogIdCounter++;


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('blogs')
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column('text')
  content!: string;

  @ManyToOne(() => User, (user) => user.id)
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
