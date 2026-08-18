'use strict';
const request = require('supertest');
const express = require('express');
const app = require('./expressServer');

describe('Express Server', () => {
  describe('GET /reshma/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/reshma/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /reshma/api/v1/weather/current', () => {
    it('should return 400 without city param', async () => {
      const res = await request(app).get('/reshma/api/v1/weather/current');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'city query param is required' });
    });
  });

  describe('GET /reshma/api/v1/weather/forecast', () => {
    it('should return 400 without city param', async () => {
      const res = await request(app).get('/reshma/api/v1/weather/forecast');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'city query param is required' });
    });
  });

  describe('GET /reshma/api-docs', () => {
    it('should serve Swagger UI or redirect to it', async () => {
      const res = await request(app).get('/reshma/api-docs/');
      expect([200, 301]).toContain(res.status);
      if (res.status === 200) {
        expect(res.type).toMatch(/html/);
      }
    });
  });

  describe('CORS', () => {
    it('should allow the configured frontend origin', async () => {
      const res = await request(app)
        .get('/reshma/health')
        .set('Origin', 'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com');
      expect(res.header['access-control-allow-origin']).toBe(
        'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com'
      );
    });
  });
});
