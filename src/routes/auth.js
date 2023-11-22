const { Router } = require('express');
const { dbQuery } = require('../db');
const { hashPassword, comparePassword } = require('../utils');

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingFields = [];

    if (!email) { missingFields.push('email') }
    if (!password) { missingFields.push('password') }
    
    return res.status(400).send({
      error: 'Missing fields',
      missingFields,
    });
  }

  try {
    const userExistsQuery = `
      SELECT * FROM users 
      WHERE email = $1
      LIMIT 1;
    `;
    const userExistsResult = await dbQuery(userExistsQuery, [email]);

    if (userExistsResult.length === 0) {
      res.status(401).send({
        error: 'User not found',
      });
    }

    const user = userExistsResult[0];
    const isValid = await comparePassword(password, user.hashed_password);
    
    if (isValid) {
      req.session.user = user;
      return res.sendStatus(201);
    } else {
      return res.status(401).send({
        error: 'Password is incorrect.'
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Cannot log in.',
      user: { email, password },
      originalError: error,
    });
  }
});

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    const missingFields = [];

    if (!email) { missingFields.push('email') }
    if (!username) { missingFields.push('username') }
    if (!password) { missingFields.push('password') }
    
    res.status(400).send({
      error: 'Missing fields',
      missingFields,
    });
  }
  
  try {
    // Check if user already exists in the database
    const userExistsQuery = `
      SELECT * FROM users 
      WHERE email = $1
    `;
    const userExistsResult = await dbQuery(userExistsQuery, [email]);

    if (userExistsResult.length > 0) {
      return res.status(400).send({
        error: 'User already exists',
        user: { email, username, password },
      });
    }

    const hashedPassword = await hashPassword(password);
    // Insert new user into the database
    const insertUserQuery = `
      INSERT INTO users (email, username, hashed_password) 
      VALUES ($1, $2, $3)
    `;
    await dbQuery(insertUserQuery, [email, username, hashedPassword]);

    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: 'Cannot register user',
      user: { email, username, password },
      originalError: error,
    });
  }
});

module.exports = router;