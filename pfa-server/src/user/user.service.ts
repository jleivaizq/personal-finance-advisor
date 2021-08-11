import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    const user  = new User(username, password, email);
    this.userRepository.persistAndFlush(user);
    return user;
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: string) {
    return await this.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    wrap(user).assign(updateUserDto);
    await this.userRepository.flush(); 
    return user;
  }

  async remove(id: string) {
    await this.userRepository.removeAndFlush(await this.findById(id));
  }

  private async findById(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
