const request = require('supertest');
const app = require('../index'); 
describe('GET /api/user/test', () => {
  test('should return a message indicating the API is working', async () => {
    const response = await request(app).get('/api/user/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API is Working!');
  });
});
