'use strict';
const request = require('supertest');
const express = require('express');
const app = require('./expressServer');

describe('Express Server', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /api/v1/weather/current', () => {
    it('should return 400 without city param', async () => {
      const res = await request(app).get('/api/v1/weather/current');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'city query param is required' });
    });
  });

  describe('GET /api/v1/weather/forecast', () => {
    it('should return 400 without city param', async () => {
      const res = await request(app).get('/api/v1/weather/forecast');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'city query param is required' });
    });
  });

  describe('GET /api-docs', () => {
    it('should serve Swagger UI or redirect to it', async () => {
      const res = await request(app).get('/api-docs/');
      expect([200, 301]).toContain(res.status);
      if (res.status === 200) {
        expect(res.type).toMatch(/html/);
      }
    });
  });

  describe('CORS', () => {
    it('should allow cross-origin requests', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');
      expect(res.header['access-control-allow-origin']).toBe('*');
    });
  });
});
