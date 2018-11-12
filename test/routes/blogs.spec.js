/* global define, it, describe, beforeEach, document */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server/app');

const { fakeBlogs, nonExistentObjectId, createUserInDB, createBlogInDB } = require('../lib/fake');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/blogs', function () {
    this.timeout(6500);

    it('GET / should respond with blogs', (done) => {
        chai.request(app)
            .get('/api/blogs')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            })
    });

    it('GET /featured should respond with featured blogs only', (done) => {
        chai.request(app)
            .get('/api/blogs/featured')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.instanceOf(Array);
                expect(res.body.every(blog => blog.featured)).to.be.true;
                done();
            })
    });

    it('GET /:id should respond with a blog when a valid ID is presented', (done) => {
        createUserInDB().then(createBlogInDB).then(blog => {
            chai.request(app)
                .get(`/api/blogs/${blog._id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.instanceOf(Object);
                    expect(res.body._id).to.equal(String(blog._id));
                    done();
                })
        });
    });

    it('GET /:id should respond with 404 when an invalid ID is passed', (done) => {
        chai.request(app)
            .get(`/api/blogs/${nonExistentObjectId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('POST / should save a new blog to the database when userId passed in body', (done) => {
        createUserInDB().then(user => {
            chai.request(app)
                .post('/api/blogs')
                .send(Object.assign({ author: user._id}, fakeBlogs[1]))
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.not.be.null;
                    expect(res.body._id).to.exist;

                    const savedBlogId = res.body._id;

                    chai.request(app)
                        .get(`/api/blogs/${res.body._id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(err).to.be.null;
                            expect(res.body._id).to.exist;
                            expect(res.body._id).to.equal(savedBlogId);
                            expect(res.body.author).to.equal(String(user._id));

                            done();
                        });
                });
        })
    });

    it('PUT /:id should update a blog', (done) => {
        createUserInDB().then(createBlogInDB).then(blog => {
            chai.request(app)
                .put(`/api/blogs/${blog._id}`)
                .send({ title: 'Hello World' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);

                    chai.request(app)
                        .get(`/api/blogs/${blog._id}`)
                        .end((err, res) => {
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            expect(res.body._id).to.equal(String(blog._id));
                            expect(res.body.title).to.not.equal('Helo World');
                            done();
                        })
                });
        });
    });

    it('DELETE /:id should delete a blog', (done) => {
        createUserInDB().then(createBlogInDB).then(blog => {
            chai.request(app)
                .delete(`/api/blogs/${blog._id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    chai.request(app)
                        .get(`/api/blogs/${blog._id}`)
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        });
                });
        });
    });
});
