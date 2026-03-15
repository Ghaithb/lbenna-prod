import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

let request: any;
let AppModule: any;

const runE2E = process.env.RUN_E2E === '1';

(runE2E ? describe : describe.skip)('Courses/Formation E2E (requires DB)', () => {
  let app: INestApplication;
  let adminToken = '';
  let courseId = '';
  let moduleId = '';
  let lessonId = '';
  let labId = '';

  beforeAll(async () => {
    request = require('supertest');
    AppModule = require('../app.module').AppModule;
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    // Login as admin
    const res = await request(app.getHttpServer())
      .post('/auth/admin/login')
      .send({ email: 'admin@lbenna.tn', password: 'password123' })
      .expect(201);
    adminToken = res.body.access_token;
    expect(typeof adminToken).toBe('string');
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /courses -> create course', async () => {
    const payload = { title: 'E2E Course', description: 'Desc', order: 1 };
    const res = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);
    courseId = res.body.id;
    expect(res.body.title).toBe(payload.title);
  });

  it('POST /courses/:id/modules -> create module', async () => {
    const payload = { title: 'Module 1', order: 1 };
    const res = await request(app.getHttpServer())
      .post(`/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);
    moduleId = res.body.id;
    expect(res.body.title).toBe(payload.title);
  });

  it('POST /courses/modules/:moduleId/lessons -> create lesson', async () => {
    const payload = { title: 'Lesson A', order: 1 };
    const res = await request(app.getHttpServer())
      .post(`/courses/modules/${moduleId}/lessons`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);
    lessonId = res.body.id;
    expect(res.body.title).toBe(payload.title);
  });

  it('POST /courses/:id/labs -> create lab', async () => {
    const payload = { title: 'Lab 1', description: 'Try presets', preset: JSON.stringify({ scene: 'basic' }), order: 0, isActive: true };
    const res = await request(app.getHttpServer())
      .post(`/courses/${courseId}/labs`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload)
      .expect(201);
    labId = res.body.id;
    expect(res.body.title).toBe(payload.title);
  });

  it('GET lists -> modules, lessons, labs', async () => {
    await request(app.getHttpServer())
      .get(`/courses/${courseId}/modules`)
      .expect(200)
      .then((r) => expect(Array.isArray(r.body)).toBe(true));
    await request(app.getHttpServer())
      .get(`/courses/modules/${moduleId}/lessons`)
      .expect(200)
      .then((r) => expect(Array.isArray(r.body)).toBe(true));
    await request(app.getHttpServer())
      .get(`/courses/${courseId}/labs`)
      .expect(200)
      .then((r) => expect(Array.isArray(r.body)).toBe(true));
  });

  it('PUT updates -> course, module, lesson, lab', async () => {
    await request(app.getHttpServer())
      .put(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'E2E Course Updated' })
      .expect(200)
      .then((r) => expect(r.body.title).toBe('E2E Course Updated'));

    await request(app.getHttpServer())
      .put(`/courses/modules/${moduleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Module 1 Updated' })
      .expect(200)
      .then((r) => expect(r.body.title).toBe('Module 1 Updated'));

    await request(app.getHttpServer())
      .put(`/courses/lessons/${lessonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Lesson A Updated' })
      .expect(200)
      .then((r) => expect(r.body.title).toBe('Lesson A Updated'));

    await request(app.getHttpServer())
      .put(`/courses/labs/${labId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Lab 1 Updated', preset: JSON.stringify({ scene: 'pro' }) })
      .expect(200)
      .then((r) => expect(r.body.title).toBe('Lab 1 Updated'));
  });

  it('POST submission and update progress', async () => {
    await request(app.getHttpServer())
      .post(`/courses/labs/${labId}/submissions`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ imageUrl: 'http://example.com/img.jpg', settings: JSON.stringify({ iso: 100 }), score: 95 })
      .expect(201)
      .then((r) => expect(r.body.labId).toBe(labId));

    await request(app.getHttpServer())
      .post(`/courses/modules/${moduleId}/progress`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ completed: true, score: 90, timeSpent: 120 })
      .expect(201)
      .then((r) => expect(r.body.completed).toBe(true));
  });

  it('DELETE entities -> lab, lesson, module, course', async () => {
    await request(app.getHttpServer())
      .delete(`/courses/labs/${labId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/courses/lessons/${lessonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/courses/modules/${moduleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
