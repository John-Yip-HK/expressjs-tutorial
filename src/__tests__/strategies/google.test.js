const { googleOAuth2Verify } = require('../../strategies/google');
const { dbQuery } = require('../../db');

jest.mock('../../db', () => ({
  dbQuery: jest.fn(() => []),
}));

const accessToken = 'aT';
const refreshToken = 'rT';
const profile = {
  id: '12345',
  displayName: 'Google User',
  emails: [{ value: 'googleUser@gmail.com' }],
  provider: 'google',
};
const done = jest.fn((error, user) => {});

describe('Google Verify Function', () => {
  it('should return user if found', async () => {
    const mockedUser = { id: profile.id, };

    dbQuery.mockResolvedValueOnce([{}]);

    await googleOAuth2Verify(accessToken, refreshToken, mockedUser, done);

    expect(dbQuery).toHaveBeenCalledTimes(1);
    expect(dbQuery.mock.calls[0][1]).toEqual([mockedUser.id]);
    expect(done).toHaveBeenCalledWith(null, mockedUser);
  });

  it('should create user & return if not found', async () => {
    const newProfile = {
      emails: [{ value: 'haha@gmail.com' }],
      displayName: 'haha',
      provider: profile.provider,
      id: '123',
    }

    dbQuery
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{}]);

    await googleOAuth2Verify(accessToken, refreshToken, newProfile, done);

    expect(dbQuery).toHaveReturnedTimes(2);
    expect(dbQuery.mock.calls[0][1]).toEqual([newProfile.id]);
    expect(dbQuery.mock.calls[1][1]).toEqual([newProfile.emails[0].value, ...Object.values(newProfile).slice(1)]);
    expect(done).toHaveBeenCalledWith(null, newProfile);
  });

  // Better to use end-to-end testing to test the error block.
  describe('should handle errors', () => {
    it('should handle thrown error when finding user', async () => {
      const error = new Error('Mocked error from finding if the user already exists.');
      const stubProfile = {
        emails: [{ value: 'haha@gmail.com' }],
        displayName: 'haha',
        provider: profile.provider,
        id: '123',
      }

      dbQuery.mockImplementationOnce(() => {
        throw error;
      });

      await googleOAuth2Verify(accessToken, refreshToken, stubProfile, done);

      expect(done).toHaveBeenCalledWith(error);
    });

    it('should handle thrown error from creating user', async () => {
      const error = new Error('Mocked error from creating user');
      const stubProfile = {
        emails: [{ value: 'haha@gmail.com' }],
        displayName: 'haha',
        provider: profile.provider,
        id: '123',
      }

      dbQuery
        .mockResolvedValueOnce([])
        .mockImplementationOnce(() => {
          throw error;
        });

      await googleOAuth2Verify(accessToken, refreshToken, stubProfile, done);

      expect(dbQuery).toHaveBeenCalledTimes(2);
      expect(dbQuery.mock.calls[0][1]).toEqual([stubProfile.id]);
      expect(dbQuery.mock.calls[1][1]).toEqual([stubProfile.emails[0].value, ...Object.values(stubProfile).slice(1)]);
      expect(done).toHaveBeenCalledWith(error);
    });
  });
});
