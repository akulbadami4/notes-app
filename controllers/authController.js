const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup = async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = new User({ username, password: password });
      const userExists = await User.findOne({ username: username });
      if(userExists){
        return res.status(300).json({
            message:"User with user name already exists"
        })
      }
      await user.save();
      return res.json({ message: 'Registration successful' });
    } catch (err) {
        return res.status(500).json({
            message:"Something went wrong",
            error : err
        })
    }
  };

  const login = async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1 hour'
      });
      res.json({ message:"Logged in successfuly",token : token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong",
            error : err
        })
    }
  };
  
  module.exports = { signup, login };