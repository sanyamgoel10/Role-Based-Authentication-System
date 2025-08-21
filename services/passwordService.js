const bcrypt = require('bcrypt');

const { BCRYPT_ENCRYPTION_ROUNDS } = require("../config/config.js");

class PasswordService {
  async encryptPassword(password) {
    try {
      return await bcrypt.hash(password, BCRYPT_ENCRYPTION_ROUNDS);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error('Password hashing failed');
    }
  }

  async validatePassword(enteredPassword, storedHashedPassword) {
    try {
      return await bcrypt.compare(enteredPassword, storedHashedPassword)
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error('Password comparison failed');
    }
  }
}

module.exports = new PasswordService();