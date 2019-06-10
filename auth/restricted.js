const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

 module.exports = function restricted(req, res, next) {
    // read username and password from the headers and verify them
    let { username, password } = req.headers;
  
    if (username && password){
      Users.findBy({ username })
      .first()
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
         next();
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
} else {
  res.status(400).json({ message: 'Please provide credentials' });
}
};