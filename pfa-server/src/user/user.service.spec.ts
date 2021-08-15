import { EntityManager} from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { CreateUserDtoFixture, UpdateUserDtoFixture, UserFixture } from './user.fixtures';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let entityManagerMock : EntityManager;
  let userRepository : jest.Mocked<EntityRepository<User>>;

  let userFixture = new UserFixture();

  const userRepositoryMock = {
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    flush: jest.fn()
  }

  beforeEach(async () => {


    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(), 
        MikroOrmModule.forFeature({ entities: [User]})
      ],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock
        },
        UserService
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    entityManagerMock = module.get(EntityManager);
    userRepository = module.get(getRepositoryToken(User));

  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = userFixture.makeMany(5);
      userRepositoryMock.findAll.mockResolvedValue(users);
      expect(await userService.findAll()).toMatchObject(users);
    });
  });

  describe('create operation on user service', () => {
    it('should persist the user and return the new entity', async () => {
      const dto = new CreateUserDtoFixture().make();
      const newUser = await userService.create(dto);
      expect(newUser.username).toBe(dto.username);
      expect(newUser.password).toBe(dto.password);
      expect(newUser.email).toBe(dto.email);
      expect(userRepositoryMock.persistAndFlush).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return the expected user', async () => {
      const user = userFixture.make();
      const spy = userRepositoryMock.findOne;
      spy.mockResolvedValue(user);
      expect(await userService.findOne(user.uuid)).toMatchObject(user);
      expect(spy).toHaveBeenLastCalledWith(user.uuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    
    it('should throw an exception with the id is not found', async () => {
      const user = userFixture.make();
      const spy = userRepositoryMock.findOne;
      spy.mockResolvedValue(null);
      await expect(userService.findOne(user.uuid)).rejects.toThrowError(new NotFoundException('User not found'));
    });
  });

  describe('update', () => {
    //it('should return the updated user and persists it', async () => {
    //  const user = userFixture.make(); 
    //  const dto = new UpdateUserDtoFixture().make();
    //  const findOneSpy = userRepositoryMock.findOne;
    //  findOneSpy.mockResolvedValue(user);
    //  const updatedUser = new User(dto.username, dto.email, dto.password);
    //  updatedUser.uuid = user.uuid;
    //  const updateSpy = userRepositoryMock.flush;
    //  //jest.spyOn(wrap, 'assign').mockImplementation(jest.fn());
    //  expect(await userService.update(user.uuid, dto)).toMatchObject(updatedUser);
    //  expect(findOneSpy).toHaveBeenCalledWith(user.uuid);
    //  expect(updateSpy).toHaveBeenCalledWith(user.uuid, dto);
    //});

    it('should throw an exception with the id is not found', async () => {
      const user = userFixture.make();
      const dto = new UpdateUserDtoFixture().make();
      const spy = userRepositoryMock.findOne;
      spy.mockResolvedValue(null);
      await expect(userService.update(user.uuid, dto)).rejects.toThrowError(new NotFoundException('User not found'));
    });
  });

  describe('remove', () => {

    it('should remove the user when found', async () => {
      const user = userFixture.make(); 
      const findOneSpy = userRepositoryMock.findOne;
      findOneSpy.mockResolvedValue(user);
      await userService.remove(user.uuid);
      expect(userRepositoryMock.removeAndFlush).toHaveBeenCalledWith(user);
      expect(findOneSpy).toHaveBeenCalledWith(user.uuid);
    });

    it('should throw an exception with the id is not found', async () => {
      const user = userFixture.make();
      const spy = userRepositoryMock.findOne;
      spy.mockResolvedValue(null);
      await expect(userService.remove(user.uuid)).rejects.toThrowError(new NotFoundException('User not found'));
    });
  });

});