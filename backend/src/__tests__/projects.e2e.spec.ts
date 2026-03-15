import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// supertest is required dynamically below so tests are skipped by default when not available
let request: any;
let AppModule: any;

// This E2E test is guarded: it is skipped by default unless RUN_E2E=1
const runE2E = process.env.RUN_E2E === '1';

(runE2E ? describe : describe.skip)('Projects E2E (requires DB and migrations)', () => {
  let app: INestApplication;

  beforeAll(async () => {
  // require supertest and app module only when running E2E to avoid test-time dependency issues
  request = require('supertest');
  AppModule = require('../app.module').AppModule;
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /projects -> 201', async () => {
    const payload = { slug: 'e2e-proj', title: 'E2E Project', published: true };
    await request(app.getHttpServer())
      .post('/projects')
      .send(payload)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.slug).toBe(payload.slug);
      });
  });

  it('GET /projects -> 200 list', async () => {
    await request(app.getHttpServer())
      .get('/projects')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});
