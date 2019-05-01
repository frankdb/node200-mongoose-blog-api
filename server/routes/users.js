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
// router.put('/:id', (req, res) => {
//   const id = req.params.id;
//   User
//     .findByIdAndUpdate(id)

// })

module.exports = router;