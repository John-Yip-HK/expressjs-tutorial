const { registerUserController } = require('../../controllers/auth');
const { dbQuery } = require('../../db');
const { hashPassword } = require('../../utils');

const FAKE_HASHED_PASSWORD = 'hashed password';

jest.mock('../../db', () => ({
  dbQuery: jest.fn(() => []),
}));
jest.mock('../../utils', () => ({
  hashPassword: jest.fn(() => FAKE_HASHED_PASSWORD),
}));

const request = {
  body: {
    email: 'fake@email.io',
    username: 'fake user',
    password: 'fake-password',
  },
}

const statusObject = {
  send: jest.fn(),
}
const response = {
  status: jest.fn(() => statusObject),
  sendStatus: jest.fn((x) => x),
}

it('should send a status code of 400 when the user exists', async () => {
  dbQuery.mockImplementationOnce(() => [{
    id: 1,
    email: 'haha@hehe.com',
    username: 'user One',
    hashed_password: 'YOLO',
    oauth2_provider: null,
    oauth2_user_id: null,
  }]);

  await registerUserController(request, response);

  expect(response.status).toHaveBeenCalledWith(400);
  expect(statusObject.send).toHaveBeenCalledTimes(1);
});

it('should send a status code of 201 when the user registration is successful', async () => {
  dbQuery.mockResolvedValueOnce([]);

  await registerUserController(request, response);

  expect(hashPassword).toHaveBeenCalledWith(request.body.password);
  expect(dbQuery).toHaveBeenCalledTimes(2);
  expect(dbQuery.mock.calls[1][1]).toEqual([...Object.values(request.body).slice(0, -1), FAKE_HASHED_PASSWORD]);
  expect(response.sendStatus).toHaveBeenCalledWith(201);
});
