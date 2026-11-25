import request from 'supertest';
import app from '../app.js';
describe('Health API',()=>{it('returns healthy status',async()=>{const res=await request(app).get('/api/health');expect(res.status).toBe(200);expect(res.body.success).toBe(true);});});
