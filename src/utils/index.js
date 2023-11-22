const argon2 = require('argon2');

async function hashPassword(password) {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    // Handle error
    console.error('Error hashing password:', error);
    throw error;
  }
}

async function comparePassword(rawPassword, hashedPassword) {
  try {
    const isMatch = await argon2.verify(hashedPassword, rawPassword);
    return isMatch;
  } catch (error) {
    // Handle error
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

module.exports = { hashPassword, comparePassword };
