const request = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const databaseName = 'itemsTestDatabase'
const Item = require('../models/item')

beforeAll(async () => {
    const MONGODB_URI = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
})

let item

describe('Items API', () => {
    it('should show all items', async done => {
        const res = await request(app).get('/api/items')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('items')
        done()
    }),
        it('should create a new item', async done => {
            const res = await request(app)
                .post('/api/items')
                .send({
                    title: 'Test Item',
                    link: 'http://www.testing.com'
                })
            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('_id')
            item = res.body._id
            done()
        }),
        it('should show an item', async done => {
            const res = await request(app).get(`/api/items/${item}`)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('_id')
            done()
        }),
        it('should update an item', async done => {
            const res = await request(app)
                .put(`/api/items/${item}`)
                .send({
                    title: 'Update Test Item',
                    link: 'http://www.testing.com'
                })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('_id')
            done()
        }),
        it('should delete an item', async done => {
            const res = await request(app)
                .del(`/api/items/${item}`)
                .send({
                    title: 'Update Test Item',
                    link: 'http://www.testing.com'
                })
            expect(res.statusCode).toEqual(200)
            expect(res.text).toEqual("Item deleted")
            done()
        })
})

afterAll(async () => {
    // await Item.drop()
    await mongoose.connection.close()
})
