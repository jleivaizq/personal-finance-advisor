import { internet } from 'faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

abstract class Fixture<type> {

    abstract make() : type;

    makeMany(n : number) : Array<type> {
        return Array.from({length: n}, (_, key) => key)
                    .map( i => this.make());
    }
}

export class UserFixture extends Fixture<User> {
    make() {
        return new User(
            internet.userName(),
            internet.password(),
            internet.email())
    }
}

export class CreateUserDtoFixture extends Fixture<CreateUserDto> {
    make() : CreateUserDto {
        const result : CreateUserDto = {
            username: internet.userName(),
            password: internet.password(),
            email: internet.email()
        };
        return result;
    }
}

export class UpdateUserDtoFixture extends Fixture<UpdateUserDto> {
    make() : UpdateUserDto {
        const result : UpdateUserDto = {
            username: internet.userName(),
            password: internet.password(),
            email: internet.email()
        };
        return result;
    }
}

