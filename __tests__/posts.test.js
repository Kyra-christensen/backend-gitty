const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should not allow unauthorized user to POST', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ 
        title: 'World is on fire',
        text: '...and all is fine' 
      });

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401
    });
  });

  it('should allow authorized user to POST', async () => {
    const agent = request.agent(app);

    await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    const res = await agent
      .post('/api/v1/posts')
      .send({ 
        title: 'This is fine',
        text: '...everything is just fine' 
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'This is fine',
      text: '...everything is just fine',
      createdAt: expect.any(String),
    });
  });

  it('should get a list of posts for logged in user', async () => {
    const agent = request.agent(app);

    await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    
    const res = await agent 
      .get('/api/v1/posts');

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        title: 'Need Sleep',
        text: 'Cant sleep....',
        createdAt: expect.any(String),
      }, 
      {
        id: expect.any(String),
        title: 'Follow-up post',
        text: 'Because of my cats.',
        createdAt: expect.any(String),
      }
    ]);
  });
});
