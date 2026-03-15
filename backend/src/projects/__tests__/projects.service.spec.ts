import { ProjectsService } from '../projects.service';

const mockPrisma: any = {
  project: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProjectsService (unit)', () => {
  let service: ProjectsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ProjectsService(mockPrisma as any);
  });

  it('should return paginated list', async () => {
    mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1', title: 'P1' }]);
    mockPrisma.project.count.mockResolvedValue(1);

    const res = await service.findAll(0, 10);

    expect(res.total).toBe(1);
    expect(Array.isArray(res.data)).toBe(true);
    expect(mockPrisma.project.findMany).toHaveBeenCalled();
  });

  it('should create a project', async () => {
    const payload = { slug: 'p1', title: 'P1' };
    mockPrisma.project.create.mockResolvedValue({ id: 'p1', ...payload });

    const res = await service.create(payload as any);

    expect(res).toHaveProperty('id', 'p1');
    expect(mockPrisma.project.create).toHaveBeenCalledWith({ data: payload });
  });
});
