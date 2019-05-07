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
      console.log('blog:', blog);
      if (blog === null) {
        return res.status(404).send('error: blog not found');
      } else {
        return res.status(200).json(blog);
      }
    })
    .catch(err => {
      return res.status(404).json({ error: err })
    });
});

// Create a blog
router.post('/', (req, res) => {
  var dbUser;

  User
    .findById(req.body.author)
    .then(user => {
      dbUser = user;
      const blog = new Blog(req.body);
      return blog.save()
        .catch(err => console.log(err));
    })
    .then(blog => {
      // Push the saved blog to the array of blogs associated with the User
      dbUser.blogs.push(blog);

      // Save the user back to the database and respond to the original HTTP request with a copy of the newly created blog.
      return dbUser.save().then(() => res.status(201).json(blog).send('saved'));
    })
    .catch(err => {
      console.log(err)
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
    .exec()
    .then(blog => {
      res.status(200).json(blog);
    })
    .catch(err => {
      res.status(400);
    });
})

module.exports = router;