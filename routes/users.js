const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

const userValidationRules = () => [
  check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
  check('email').isEmail().withMessage('El email no es válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({ errors: errors.array() });
};

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

router.post('/', userValidationRules(), validate, async (req, res) => {
  const { name, email, password } = req.body;

  // Hashear la contraseña antes de guardarla
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  


  const newUser = new User({
    name,
    email,
    password: hashedPassword, // Almacena la contraseña hasheada
  });

  await newUser.save();
  res.redirect('/users');
});

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', userValidationRules(), validate,async (req, res) => {
  const { name, email, password } = req.body;

  // Hashear la nueva contraseña antes de actualizarla
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.findByIdAndUpdate(req.params.id, {
    name,
    email,
    password: hashedPassword, // Actualiza la contraseña hasheada
  });

  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
