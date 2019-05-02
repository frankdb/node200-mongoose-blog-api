const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all Users
router.get('/', (req, res) => {
  User
    .find()
    .then(users => {
      res.status(200).json(users);
    });
});

// Get single User
router.get('/:id', (req, res) => {
  const id = req.params.id;
  User
    .findById(id)
    .then(user => {
      res.status(200).json(user);
    });
});

// Create a User
router.post('/', (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  })

  user
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));

  res.status(201).json(user);
});

// Update a user
router.put('/:id', (req, res) => {
  const id = req.params.id;
  User
    .findByIdAndUpdate(id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      }
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(204).send(result);
    })
    .catch(err => console.log(err));

})

// Delete a user
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  User
    .findByIdAndRemove(id)
    .then(user => {
      res.status(200).json(user);
    });
})

module.exports = router;