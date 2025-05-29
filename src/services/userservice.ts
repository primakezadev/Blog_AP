import { User } from '../entities/User'; // Your TypeORM entity
import { UpdateUserInput } from '../schemas/user.schema';
import { ConflictError, NotFoundError } from '../Utils/errors';

export class UserService {
  async getAll(): Promise<User[]> {
    return await User.find();
  }

  async searchByName(name?: string): Promise<User[]> {
    return name ? await User.find({ where: { name } }) : [];
  }

  async getById(id: string): Promise<User> {
    const user = await User.findOne({ where: { id: Number(id) } });
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.getById(id);

    if (data.body.email && data.body.email !== user.email) {
     const emailExists = await User.findOne({ where: { email: data.body.email } });
      if (emailExists) throw new ConflictError('Email is already in use');
    }

    Object.assign(user, data);
    return await user.save();
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.getById(id);
    await User.remove(user);
    return true;
  }
}
