/* global define, it, describe, beforeEach, document */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/app');

const { fakeUser, createUserInDB, nonExistentObjectId } = require('../lib/fake');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/users', function () {
    this.timeout(6500);

    it('GET / should respond with users', (done) => {
        chai.request(app)
            .get('/api/users')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it('GET /:id should respond with a user when a valid ID is passed', (done) => {
        createUserInDB().then(user => {
            chai.request(app)
                .get(`/api/users/${user._id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body._id).to.equal(String(user._id));
                    done();
                });
        });
    });

    it('GET /:id should respond with 404 when an invalid ID is passed', (done) => {
        chai.request(app)
            .get(`/api/users/${nonExistentObjectId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('POST / should save a new user to the database', (done) => {
        chai.request(app)
            .post('/api/users')
            .send(fakeUser)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.not.be.null;
                expect(res.body._id).to.exist;

                const savedUserId = res.body._id;

                chai.request(app)
                    .get(`/api/users/${res.body._id}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(err).to.be.null;
                        expect(res.body._id).to.exist;
                        expect(res.body._id).to.equal(savedUserId)

                        done();
                    });
            });
    });

    it('PUT /:id should update a user', (done) => {
        createUserInDB().then(user => {
            chai.request(app)
                .put(`/api/users/${user._id}`)
                .send({ firstName: 'Jane', lastName: 'Doe' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);
                    
                    chai.request(app)
                        .get(`/api/users/${user._id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            expect(res.body._id).to.equal(String(user._id));
                            expect(res.firstName).to.not.equal('John');
                            expect(res.lastName).to.not.equal('Smith');
                            done();
                        });
                });
        });
    });

    it('DELETE /:id should delete a user', (done) => {
        createUserInDB().then(user => {
            chai.request(app)
                .delete(`/api/users/${user._id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    chai.request(app)
                        .get(`/api/users/${user._id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        })
                });
        })
    });
});