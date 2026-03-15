import { AuthService } from '../auth.service';

const mockPrisma: any = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  license: {
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  subscription: {
    findFirst: jest.fn(),
  },
};

describe('AuthService (unit)', () => {
  let service: AuthService;
  const mockJwt = { sign: jest.fn(), verify: jest.fn() } as any;

  const mockNotificationService = { notifyPasswordReset: jest.fn(), sendPasswordResetLink: jest.fn() } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuthService(mockPrisma as any, mockJwt, mockNotificationService);
  });

  it('should validate existing user with correct password', async () => {
    // arrange
    const user = { id: 'u1', email: 'a@b.com', passwordHash: 'hashed', role: 'CLIENT' } as any;
    mockPrisma.user.findUnique.mockResolvedValue(user);
    // mock bcrypt
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // act
    const result = await service.validateUser('a@b.com', 'secret');

    // assert
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    expect(result).toMatchObject({ id: 'u1', email: 'a@b.com', role: 'CLIENT' });
  });

  it('should return token and user on login', async () => {
    const user = { id: 'u1', email: 'a@b.com', firstName: 'F', lastName: 'L', role: 'CLIENT' } as any;
    mockJwt.sign.mockReturnValue('signed-token');

    const res = await service.login(user);

    expect(res).toHaveProperty('access_token', 'signed-token');
    expect(res.user).toMatchObject({ id: 'u1', email: 'a@b.com' });
  });
});
