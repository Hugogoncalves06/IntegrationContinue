const request = require("supertest")
const app = require("./app")
const mysql = require("mysql2");
require("dotenv").config();


jest.mock("mysql2");


describe('GET /users', function () {
    // let mockDB = mysql;
    // let connection = {
    //     query: jest.fn()
    // }
    // beforeEach(() => {
    //     mockDB = {
    //         createPool: jest.fn()
    //     };
    // });

    it.skip('responds with json', function (done) {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds with json', async function () {
        // let mockSql = jest.fn().mockResolvedValue([])
        // mysql.createPool.mockResolvedValue({
        //     query: mockSql
        // })
        // createUser.mockResolvedValue(1)
        // let pool = mysql.createPool.mockImplementation(() => mysql.createPool({
        //     host: "",
        //     database: "",
        //     user: "",
        //     password: "",
        // }));
        // pool.query.mockImplementation(() => pool.query(""))
        const response = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ "utilisateurs": [] });
    });
});