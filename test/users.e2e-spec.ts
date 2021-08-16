import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

jest.mock('got');

const GRAPQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'hunman@gmail.com',
  password: '121212',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          createAccount(input:{
            email:"${testUser.email}"
            password:"${testUser.password}"
            role:Owner
          }){
            ok
            error
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(true);
          expect(createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exist', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          createAccount(input:{
            email:"${testUser.email}"
            password:"${testUser.password}"
            role:Owner
          }){
            ok
            error
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(false);
          expect(createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email:"${testUser.email}"
            password:"${testUser.password}"
          }){
            ok
            error
            token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          login(input:{
            email:"${testUser.email}"
            password:"11"
          }){
            ok
            error
            token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password');
          expect(login.token).toEqual(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await userRepository.find();
      userId = user.id;
    });

    it("should see a user's profile", () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
        {
          userProfile(userId:${userId}){
            ok
            error
            user {
              id
            }
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it('should not be able find user', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
      {
        userProfile(userId:66){
          ok
          error
          user {
            id
          }
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('User Not Found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
        {
          me {
            email
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email);
        });
    });

    it('should not allow logged out user', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        {
          me {
            email
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  it.todo('editProfile');
  it.todo('verifyEmail');
});
