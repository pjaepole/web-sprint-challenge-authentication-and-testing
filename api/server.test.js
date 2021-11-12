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


describe('[POST] /api/auth/register', () => {
  test('db starts with 3 users', async () => {
    const sanitycheck = await request(server).get('/api/auth')
    expect(sanitycheck.body).toHaveLength(3)
  })
  test('able to register new user and return the user id and username', async()=>{
    const res = await request(server).post('/api/auth/register')
    .send({username:'tanjiro',password:'tanjiro'})
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({id:4,username:"tanjiro"})
  })
})

describe('[POST]/api/auth/login', ()=>{
  test('unable to login with username password that is not in the db', async()=>{
    const res = await request(server).post('/api/auth/login')
    .send({username:'tanjiro',password:'tanjiro'})
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({message:'Invalid credentials'})
  })
  test('able to login with username password that is in the db', async()=>{
    const test = await request(server).post('/api/auth/register')
    .send({username:'tanjiro',password:'tanjiro'})
    expect(test.status).toBe(201)
    expect(test.body).toMatchObject({id:4,username:"tanjiro"})
    const res = await request(server).post('/api/auth/login')
    .send({username:'tanjiro',password:'tanjiro'})
    expect(res.body).toMatchObject({message:`welcome, tanjiro`})
    const sanitycheck = await request(server).get('/api/auth')
    expect(sanitycheck.body).toHaveLength(4)
  })
})

describe('[GET]/api/jokes/',()=>{
  test('unable to get jokes without token',async()=>{
    const res = await request(server).post('/api/jokes')
    expect(res.body).toMatchObject({message:'token required'})
  })
  test('unable to get jokes without token',async()=>{
    const res = await request(server).post('/api/jokes')
    expect(res.body).toMatchObject({message:'token required'})
  })

})

describe("[GET]/api/jokes/ with token", () => {
  test('', async()=>{
    let header
    const test = await request(server).post('/api/auth/register')
    .send({username:'tanjiro',password:'tanjiro'})
    expect(test.status).toBe(201)
    expect(test.body).toMatchObject({id:4,username:"tanjiro"})
    const res = await request(server).post('/api/auth/login')
    .send({username:'tanjiro',password:'tanjiro'})
    let token=res.body.token
    if(token){
      header={Authorization:token}
      const result= await request(server).get('/api/jokes/').set(header)
      expect(result.body).toMatchObject([{"id":"0189hNRf2g","joke":"I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."},{"id":"08EQZ8EQukb","joke":"Did you hear about the guy whose whole left side was cut off? He's all right now."},{"id":"08xHQCdx5Ed","joke":"Why didn’t the skeleton cross the road? Because he had no guts."}] )
    }
  })
})