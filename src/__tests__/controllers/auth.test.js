// Remember to always mock your dependencies.
const { authRegisterController } = require('../../controllers/auth');
const User = require('../../database/schemas/User');
const { hashPassword } = require('../../utils/helpers');

// Mock out `findOne` method call.
jest.mock('../../database/schemas/User');
jest.mock('../../utils/helpers', () => ({
  // Mock named exports of the mocked module.
  hashPassword: jest.fn(() => 'hash password'),
}));

const request = {
  body: {
    email: 'fake_email',
    password: 'fake_password',
  },
};

const response = {
  send: jest.fn((x) => x),

  // Mock the `status` function, act as a proxy of the real implementation.
  status: jest.fn((x) => x),

  sendStatus: jest.fn((x) => x),
};

it('should send a status code of 400 when user exists', async () => {
  // Mock the `findOne` method to return a fake user.
  User.findOne.mockImplementationOnce(() => ({ 
    id: 1, 
    email: 'email',
    password: 'password',
  }));
  await authRegisterController(request, response);

  expect(response.status).toHaveBeenCalledWith(400);
  expect(response.send).toHaveBeenCalledTimes(1);
});

it('should send a status of 201 when new user is created', async () => {
  User.findOne.mockResolvedValueOnce(undefined);
  User.create.mockResolvedValueOnce({ id: 1, 
    email: 'email', 
    password: 'password',
  });

  await authRegisterController(request, response);

  expect(hashPassword).toHaveBeenCalledWith(request.body.password);
  expect(User.create).toHaveBeenCalledWith({
    password: 'hash password',
    email: request.body.email,
  });
  expect(response.sendStatus).toHaveBeenCalledWith(201);
});