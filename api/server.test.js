const server = require('./server')
const request= require('supertest')
const db = require('../data/dbConfig')
const jd=require('../api/jokes/jokes-data')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
  expect(1+1).toBe(2)
})

describe('[GET] /api/auth', () => {
  test('responds with all the users', async () => {
    const res = await request(server).get('/api/auth')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
  })
})