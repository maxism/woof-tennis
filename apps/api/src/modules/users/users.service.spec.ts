import { UsersService } from './users.service';

describe('UsersService searchPublicByUsername', () => {
  const qb = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const repo = {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
    manager: {},
  };

  const service = new UsersService(repo as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes @username and returns public fields', async () => {
    qb.getMany.mockResolvedValue([
      {
        id: 'u1',
        firstName: 'Иван',
        lastName: null,
        username: 'ivan_tennis',
        photoUrl: null,
        isCoach: false,
        telegramId: 123456,
      },
    ]);

    const result = await service.searchPublicByUsername('@Ivan_Tennis');

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('u');
    expect(qb.andWhere).toHaveBeenCalledWith('LOWER(u.username) = :username', {
      username: 'ivan_tennis',
    });
    expect(result).toEqual([
      {
        id: 'u1',
        firstName: 'Иван',
        lastName: null,
        username: 'ivan_tennis',
        photoUrl: null,
        isCoach: false,
      },
    ]);
  });

  it('returns empty result for blank username', async () => {
    const result = await service.searchPublicByUsername('   @   ');
    expect(result).toEqual([]);
    expect(repo.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('returns empty result when username not found', async () => {
    qb.getMany.mockResolvedValue([]);
    const result = await service.searchPublicByUsername('missing_user');
    expect(result).toEqual([]);
  });
});

