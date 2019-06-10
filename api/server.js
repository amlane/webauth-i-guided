const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
//import bcryptjs
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  let user = req.body;
  //hash the password
  const hash = bcrypt.hashSync(user.password, 14); //password gets hashed 2 ^ 14 times

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', restricted, (req, res) => {
  let { username, password } = req.body;
 
  Users.findBy({ username })
    .first()
    .then(user => {
      // if (user && bcrypt.compareSync(password, user.password)) {
        if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// server.get('/api/users', (req, res) => {
//   Users.find()
//     .then(users => {
//       res.json(users);
//     })
//     .catch(err => res.send(err));
// });

function restricted(req, res, next) {
  // read username and password from the headers and verify them
  let { username, password } = req.headers;

  if (username && password){
    Users.findBy({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
         return next();
    }})
      .catch(error => {
        res.status(500).json(error);
      });
    } else {
    res.status(400).json({ message: "Please provide credentials." })
    }
  };

  module.exports = server;