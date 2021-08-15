import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDtoFixture, UpdateUserDtoFixture, UserFixture } from './user.fixtures';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let userFixture: UserFixture = new UserFixture();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(),
        MikroOrmModule.forFeature({ entities: [User] }),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create should delegate on UserService', () => {
    it('should update the user when found', async () => {
      const dto = new CreateUserDtoFixture().make();
      const user = new User(dto.username, dto.password, dto.email);
      const spy = jest.spyOn(userService, 'create');
      spy.mockResolvedValue(user);
      expect(await controller.create(dto)).toMatchObject(user);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll should delegate on UserService findAll', () => {
    it('should return an array of users as part of the delegation', async () => {
      const users = userFixture.makeMany(5);
      const spy = jest.spyOn(userService, 'findAll');
      spy.mockResolvedValue(users);
      expect(await controller.findAll()).toMatchObject(users);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne should delegateon UserService findOne', () => {
    it('should return the expected user', async () => {
      const user = userFixture.make();
      const spy = jest.spyOn(userService, 'findOne');
      spy.mockResolvedValue(user);
      expect(await controller.findOne(user.uuid)).toMatchObject(user);
      expect(spy).toHaveBeenLastCalledWith(user.uuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update should delegate on UserService', () => {
    it('should update the user when found', async () => {
      const user = userFixture.make(); 
      const dto = new UpdateUserDtoFixture().make();
      const updatedUser = new User(dto.username, dto.email, dto.password);
      updatedUser.uuid = user.uuid;
      const spy = jest.spyOn(userService, 'update');
      spy.mockResolvedValue(updatedUser);
      expect(await controller.update(user.uuid, dto)).toMatchObject(updatedUser);
      expect(spy).toHaveBeenCalledWith(user.uuid, dto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove should delegate on UserService', () => {
    it('should remove the user when found', async () => {
      const user = userFixture.make(); 
      const spy = jest.spyOn(userService, 'remove');
      spy.mockImplementation(jest.fn());
      controller.remove(user.uuid);
      expect(spy).toHaveBeenCalledWith(user.uuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
