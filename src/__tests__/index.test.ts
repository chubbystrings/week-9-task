import request from 'supertest';
import app from '../app';
import { Org, IUser } from '../types/index';
import { UserSchema } from '../models/user';
import { dbDisconnect } from '../db/mongoMemoryServer';

let ID: string = '';
let userToken: string = '';
let userID: string = '';
let preFilled: Org | {} = {};

afterAll(async () => {
  await UserSchema.findByIdAndDelete(userID);
  await dbDisconnect();
});

const user: IUser = {
  name: 'martins okwor',
  email: 'martinsokwor@yahoo.com',
  password: '12345678',
  repeat_password: '12345678',
};

const data: {
  organization: string
  products: string[]
  marketValue: string
  address: string
  ceo: string
  country: string
  noOfEmployees: number
  employees: string[]
} = {
  organization: 'beforeAll ninja',
  products: ['developers', 'pizza'],
  marketValue: '90%',
  address: 'sangotedo',
  ceo: 'cn',
  country: 'Taiwan',
  noOfEmployees: 2,
  employees: ['james bond', 'jackie chan'],
};

describe('User Authentication', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/week-6-task/users/signup')
      .send(user);
    expect(res.status).toBe(201);
  });

  it('should log in a user', async () => {
    const userLog = {
      email: user.email,
      password: user.password,
    };
    const res = await request(app)
      .post('/api/v1/week-6-task/users/login')
      .send(userLog);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
    userID = res.body.data._id;
  });
});

describe('create data / Update data', () => {
  it('should create a new organisation', async () => {
    data.organization = 'node ninja';
    const res: request.Response = await request(app)
      .post('/api/v1/week-6-task/organizations')
      .send(data)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('_id');
    expect(typeof (res.body.data) === 'object').toBe(true);
    expect(res.body.data.organization).toBe('node ninja');
    ID = res.body.data._id;
    preFilled = {
      ...res.body.data,
    };
  });

  it('should update an organization', async () => {
    data.organization = 'edited ninja';
    const res: request.Response = await request(app)
      .put(`/api/v1/week-6-task/organizations/${ID}`)
      .send(data)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('_id');
    expect(typeof (res.body.data) === 'object').toBe(true);
    expect(res.body.data._id).toBe(ID);
    expect(res.body.data.organization).toBe('edited ninja');
    preFilled = {
      ...res.body.data,
    };
  });
});

describe('fetch Data', () => {
  it('should fetch all organization', async () => {
    const res: request.Response = await request(app)
      .get('/api/v1/week-6-task/organizations')
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch a single organization', async () => {
    const res: request.Response = await request(app)
      .get(`/api/v1/week-6-task/organizations/${ID}`)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data).toStrictEqual(preFilled);
    expect(typeof (res.body.data) === 'object').toBe(true);
  });
});

describe('Delete Data', () => {
  it('should delete an organization', async () => {
    const res: request.Response = await request(app)
      .delete(`/api/v1/week-6-task/organizations/${ID}`)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
  });
});

describe('return correct fetch data error', () => {
  it('should return an error id is invalid', async () => {
    const id = 'a';
    const res: request.Response = await request(app)
      .get(`/api/v1/week-6-task/organizations/${id}`)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('error');
  });

  it('should return an error if id is unavailable', async () => {
    const res: request.Response = await request(app)
      .get(`/api/v1/week-6-task/organizations/${ID}`)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('error');
  });
});

describe('Returns correct create data Error', () => {
  it('should return error if data is not complete or empty', async () => {
    const errorData = {
      ceo: 'emeka',
    };
    const res: request.Response = await request(app)
      .post('/api/v1/week-6-task/organizations')
      .send(errorData)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('error');
  });
});

describe('Returns correct Update Error', () => {
  it('should return error if id is not in database', async () => {
    const errorData = {
      ceo: 'emeka',
    };
    const res: request.Response = await request(app)
      .put(`/api/v1/week-6-task/organizations/${ID}`)
      .send(errorData)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('error');
  });
});

describe('Returns correct Delete data Error', () => {
  it('should return error if id is not in database', async () => {
    const res: request.Response = await request(app)
      .delete(`/api/v1/week-6-task/organizations/${ID}`)
      .set('authorization', `Bearer ${userToken}`);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toBe('error');
  });
});
