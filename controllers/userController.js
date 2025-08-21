const { VALID_USER_ROLES } = require('../config/config.js');
const UtilService = require('../services/utilService.js');
const DatabaseService = require('../services/databaseService.js');
const PasswordService = require('../services/passwordService.js');
const TokenService = require('../services/tokenService.js');

class UserController {
  async register(req, res) {
    try {
      let reqBody = req.body;

      if (!UtilService.checkValidObject(reqBody)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid body',
        });
      }

      if (!UtilService.checkValidEmail(reqBody.email)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid email',
        });
      }
      if (!UtilService.checkValidString(reqBody.name)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid name',
        });
      }
      if (!UtilService.checkValidString(reqBody.password)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid password',
        });
      }
      if (!UtilService.checkValidString(reqBody.role) || !VALID_USER_ROLES.includes(reqBody.role)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid role',
        });
      }

      console.log("reqBody: ", reqBody);

      let selectResp = await DatabaseService.getData(`select id from users where email = ?`, [reqBody.email]);
      if (!UtilService.checkValidArray(selectResp) || selectResp.length > 0) {
        return res.status(404).json({
          status: 0,
          msg: 'email already exists',
        });
      }

      let encryptedPassword = await PasswordService.encryptPassword(reqBody.password);

      let insertData = await DatabaseService.setData(`insert into users (email, password, name, role) values (?, ?, ?, ?)`, [reqBody.email, encryptedPassword, reqBody.name, reqBody.role]);

      let userJwtToken = await TokenService.encodeJwtToken({
        email: reqBody.email,
        role: reqBody.role,
        userId: insertData,
        time: Date()
      });
      if (!userJwtToken) {
        console.log(`Error: Something went wrong in token creation`);
        return res.status(500).json({
          status: 0,
          msg: 'Something went wrong',
        });
      }

      return res.status(200).json({
        status: 1,
        msg: 'User registered successfully',
        userId: insertData,
        token: userJwtToken,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }

  async login(req, res) {
    try {
      let reqBody = req.body;

      if (!UtilService.checkValidObject(reqBody)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid body',
        });
      }

      if (!UtilService.checkValidEmail(reqBody.email)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid email',
        });
      }
      if (!UtilService.checkValidString(reqBody.password)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid password',
        });
      }

      let selectResp = await DatabaseService.getData(`select id, email, password, role from users where email = ?`, [reqBody.email]);
      if (!UtilService.checkValidArray(selectResp) || selectResp.length === 0) {
        return res.status(404).json({
          status: 0,
          msg: 'email not registered',
        });
      }

      let user = selectResp[0];
      let isPasswordValid = await PasswordService.validatePassword(reqBody.password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({
          status: 0,
          msg: 'Incorrect password',
        });
      }

      let userJwtToken = await TokenService.encodeJwtToken({
        email: reqBody.email,
        role: user.role,
        userId: user.id,
        time: Date()
      });
      if (!userJwtToken) {
        console.log(`Error: Something went wrong in token creation`);
        return res.status(500).json({
          status: 0,
          msg: 'Something went wrong',
        });
      }

      return res.status(200).json({
        status: 1,
        msg: 'User logged in successfully',
        userId: user.id,
        token: userJwtToken,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }

  async getProfile(req, res) {
    try{
      console.log("req.UserJwtData: ", req.UserJwtData);
      
      return res.status(200).json({
        status: 1,
        msg: 'User profile fetched successfully'
      });
    }catch(error){
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }
}

module.exports = new UserController();