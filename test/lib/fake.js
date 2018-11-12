const mongoose = require('mongoose');
const User = require('../../server/models/User');
const Blog = require('../../server/models/Blog');

mongoose.models = {};
mongoose.modelSchemas = {};

const fakeUser = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@gmail.com',
    social: {
        twitter: '@johnsmith',
        linkedIn: 'https://www.linkedin.com/in/johnsmith',
        facebook: 'john.smith'
    }
};

const fakeBlogs = [{
    title: 'Helo World',
    article: `Brian Kernighan wrote the first "hello, world" program as part of the
        documentation for the BCPL programming language developed by Martin Richards. 
        BCPL was used while C was being developed at Bell Labs a few years before the 
        publication of Kernighan and Ritchie's C book in 1972.`,
    published: Date.now(),
    featured: false
}, {
    title: 'Yak Shaving',
    article: `Yak shaving is programming lingo for the seemingly endless series of small
        tasks that have to be completed before the next step in a project can move forward.`,
    published: Date.now(),
    featured: true
}];

const nonExistentObjectId = '507f191e810c19729de860ea';

const createUserInDB = () => new User(fakeUser).save();
const createBlogInDB = (author) => {
    const newBlog = new Blog(fakeBlogs[0]);

    newBlog.author = author;

    return newBlog
        .save()
        .then(blog => {
            author.blogs.push(blog);

            author.save();

            return blog;
        })
}

module.exports = {
    fakeUser,
    fakeBlogs,
    nonExistentObjectId,
    createUserInDB,
    createBlogInDB,
};
