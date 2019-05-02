const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all blogs
router.get('/', (req, res) => {
  Blog
    .find()
    .then(blogs => {
      res.status(200).json(blogs);
    })
    .catch(err => {
      res.status(404)
    });
});

// Get all featured blogs
router.get('/featured', (req, res) => {
  Blog
    .where('featured')
    .equals(true)
    .then(blogs => {
      res.status(200).json(blogs);
    });
});

// Get single blog
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Blog
    .findById(id)
    .then(blog => {
      res.status(200).json(blog);
    });
});

// Create a blog
router.post('/', (req, res) => {
  var dbUser;

  User
    .findById(req.body.authorId)
    .then(user => {
      dbUser = user;
      const blog = new Blog({
        title: req.body.title,
        article: req.body.article,
        published: req.body.published,
        featured: req.body.featured,
        author: user._id
      });

      return blog.save();
    })
    .then(blog => {
      // Push the saved blog to the array of blogs associated with the User
      dbUser.blogs.push(blog);

      // Save the user back to the database and respond to the original HTTP request with a copy of the newly created blog.
      dbUser.save().then(() => res.status(201).json(blog));
    })

});

// Update a blog
router.put('/:id', (req, res) => {
  const id = req.params.id;
  Blog
    .findByIdAndUpdate(id, {
      $set: {
        title: req.body.title,
        article: req.body.article,
        published: req.body.published,
        featured: req.body.featured,
      }
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(204).send(result);
    })
    .catch(err => console.log(err));

})

// Delete a blog
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Blog
    .findByIdAndRemove(id)
    .then(blog => {
      res.status(200).json(blog);
    });
})

module.exports = router;