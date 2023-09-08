const { discordVerifyFunction } = require('../../strategies/discord');
const DiscordUser = require('../../database/schemas/DiscordUser');

jest.mock('../../database/schemas/DiscordUser');

const accessToken = '234';
const refreshToken = '456';
const profile = {
  id: '123123',
};
const done = jest.fn((x, y) => x);

describe('Discord Verify Function', () => {
  it('should return user if found', async () => {
    const mockedUser = {
      id: 'id_123',
      discordId: profile.id,
      createdAt: new Date(),
    };
    
    DiscordUser.findOne.mockResolvedValueOnce(mockedUser);

    await discordVerifyFunction(accessToken, refreshToken, profile, done);
  
    expect(DiscordUser.findOne).toHaveBeenCalledWith({ discordId: profile.id, });
    expect(done).toHaveBeenCalledWith(null, mockedUser);
  });

  it('should create user & return if not found', async () => {
    const newProfile = {
      id: '123',
    }
    const newUser = {
      id: '1',
      discordId: newProfile.id,
      createdAt: new Date(),
    };
    
    DiscordUser.create.mockResolvedValueOnce(newUser);
    DiscordUser.findOne.mockImplementationOnce(() => null);

    await discordVerifyFunction(accessToken, refreshToken, newProfile, done);
  
    expect(DiscordUser.findOne).toHaveBeenCalledWith({ discordId: newProfile.id, });
    expect(DiscordUser.findOne).toHaveReturnedWith(null);
    expect(DiscordUser.create).toHaveBeenCalledWith({ discordId: newProfile.id, });
    expect(done).toHaveBeenCalledWith(null, newUser);
  });

  // Better to use end-to-end testing to test the error block.
  describe('should handle errors', () => {
    it('should handle thrown error from findOne', async () => {
      const error = new Error('Mocked error from findOne');
      const stubProfile = {
        id: '123',
      }

      DiscordUser.findOne.mockImplementationOnce(() => {
        throw error;
      });

      await discordVerifyFunction(accessToken, refreshToken, stubProfile, done);

      expect(done).toHaveBeenCalledWith(error, null);
    });

    it('should handle thrown error from create', async () => {
      const error = new Error('Mocked error from create');
      const stubProfile = {
        id: '123',
      }

      DiscordUser.findOne.mockImplementationOnce(() => null);
      DiscordUser.create.mockImplementationOnce(() => {
        throw error;
      });

      await discordVerifyFunction(accessToken, refreshToken, stubProfile, done);

      expect(DiscordUser.findOne).toHaveBeenCalledWith({ discordId: stubProfile.id });
      expect(DiscordUser.create).toHaveBeenCalledWith({ discordId: stubProfile.id });
      expect(done).toHaveBeenCalledWith(error, null);
    });
  });
  
})