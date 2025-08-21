const TokenService = require('../services/tokenService.js');
const UtilService = require('../services/utilService.js');

class AuthMiddleware {
  async validateJwtToken(req, res, next) {
    try {
      const headerAuth = req.headers['authorization'];
      if (!UtilService.checkValidString(headerAuth)) {
        return res.status(401).json({
          status: 0,
          msg: "Access Denied -> Invalid Authorization"
        });
      }

      const authParams = headerAuth.split(' ');
      if (authParams.length != 2 || authParams[0] != 'Bearer') {
        return res.status(401).json({
          status: 0,
          msg: "Access Denied -> Invalid Bearer"
        });
      }

      const jwtData = await TokenService.decodeJwtToken(authParams[1]);
      if (!jwtData) {
        return res.status(401).json({
          status: 0,
          msg: "Access Denied -> Invalid Bearer token"
        });
      }

      req.UserJwtData = {
        email: jwtData.email,
        role: jwtData.role,
        userId: jwtData.userId,
      }

      next();
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: "Internal server error"
      });
    }
  }
}

module.exports = new AuthMiddleware();