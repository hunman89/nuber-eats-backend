import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    const EMAIL = 'hunman@gmail.com';
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          createAccount(input:{
            email:"${EMAIL}"
            password:"121212"
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
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exist', () => {
      return request(app.getHttpServer())
        .post(GRAPQL_ENDPOINT)
        .send({
          query: `
        mutation{
          createAccount(input:{
            email:"${EMAIL}"
            password:"121212"
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
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
