import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { IUserRO } from './user.interface';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<IUserRO> {

    const { username, password, email } = createUserDto;
    const user  = new User(username, password, email);
    this.userRepository.persistAndFlush(user);
    return this.buildUserRO(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  private buildUserRO(user: User) {
    const userRO = {
      username: user.username,
      email: user.email
    }
    return { user: userRO }
  }
}
