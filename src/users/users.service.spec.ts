import { Test } from '@nestjs/testing';
import { UserService } from './users.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const modules = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('Should be definded', () => {
    expect(service).toBeDefined();
  });
  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
