const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY, JWT_EXPIRY } = require('../config/config.js');
const UtilService = require('./utilService.js');

class TokenService {
  async encodeJwtToken(data) {
    try {
      return jwt.sign(data, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY });
    } catch (error) {
      console.log(`Error: ${error}`);
      return false;
    }
  }

  async decodeJwtToken(token) {
    try {
      let verified = jwt.verify(token, JWT_SECRET_KEY);
      if (UtilService.checkValidObject(verified)) {
        return verified;
      }
      return false;
    } catch (error) {
      console.log(`Error: ${error}`);
      return false;
    }
  }
}

module.exports = new TokenService();