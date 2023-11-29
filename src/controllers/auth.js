const { dbQuery } = require('../db');
const { hashPassword } = require('../utils');

/**
 * Registers a new user.
 * 
 * Extract this function out for unit testing.
 * 
 * Both arguments have to be mocked in the testing.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user is registered successfully.
 */
async function registerUserController(req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    const missingFields = [];

    if (!email) { missingFields.push('email') }
    if (!username) { missingFields.push('username') }
    if (!password) { missingFields.push('password') }
    
    return res.status(400).send({
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
}

module.exports = { registerUserController };