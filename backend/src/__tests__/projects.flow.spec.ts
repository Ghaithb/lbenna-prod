import { ProjectsService } from '../projects/projects.service';
import { ProjectsController } from '../projects/projects.controller';

const mockPrisma: any = {
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('Projects flow (integration-style)', () => {
  let service: ProjectsService;
  let controller: ProjectsController;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ProjectsService(mockPrisma as any);
    controller = new ProjectsController(service);
  });

  it('should create and retrieve a project via service/controller', async () => {
    const payload = { slug: 'proj-1', title: 'Project 1', published: true } as any;
    mockPrisma.project.create.mockResolvedValue({ id: 'p1', ...payload });
    mockPrisma.project.findUnique.mockResolvedValue({ id: 'p1', ...payload });

    const created = await service.create(payload);
    expect(mockPrisma.project.create).toHaveBeenCalledWith({ data: payload });
    expect(created).toHaveProperty('id', 'p1');

    const bySlug = await controller.findBySlug('proj-1');
    expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { slug: 'proj-1' } });
    expect(bySlug).toHaveProperty('slug', 'proj-1');
  });

  it('should list projects with pagination', async () => {
    mockPrisma.project.findMany.mockResolvedValue([{ id: 'p1', title: 'P1' }]);
    mockPrisma.project.count.mockResolvedValue(1);

    const res = await controller.findAll('0', '10');
    expect(res.total).toBe(1);
    expect(Array.isArray(res.data)).toBe(true);
  });
});
