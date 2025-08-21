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

      let selectResp = await DatabaseService.getData(`select id from users where email = ?`, [reqBody.email]);
      if (!UtilService.checkValidArray(selectResp) || selectResp.length > 0) {
        return res.status(404).json({
          status: 0,
          msg: 'email already exists',
        });
      }

      let encryptedPassword = await PasswordService.encryptPassword(reqBody.password);

      let insertData = await DatabaseService.setData(`insert into users (email, password, name, role, last_login) values (?, ?, ?, ?, datetime('now'))`, [reqBody.email, encryptedPassword, reqBody.name, reqBody.role]);

      let userJwtToken = await TokenService.encodeJwtToken({
        userId: insertData,
        role: reqBody.role,
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

      await DatabaseService.setData(`update users set last_login = datetime('now') where id = ?`, [user.id]);

      let userJwtToken = await TokenService.encodeJwtToken({
        userId: user.id,
        role: user.role,
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
    try {
      if (!UtilService.checkValidObject(req.UserJwtData) || !UtilService.checkValidNumber(req.UserJwtData.userId)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid authorization data',
        });
      }
      req.UserJwtData.userId = Number(req.UserJwtData.userId);

      let selectResp = await DatabaseService.getData(`select id as userId, email, name, role from users where id = ?`, [req.UserJwtData.userId]);
      if (!UtilService.checkValidArray(selectResp) || selectResp.length == 0 || !UtilService.checkValidObject(selectResp[0])) {
        return res.status(404).json({
          status: 0,
          msg: 'User not found',
        });
      }

      return res.status(200).json({
        status: 1,
        msg: 'User profile fetched successfully',
        data: selectResp[0]
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }

  async getUsers(req, res) {
    try {
      if (!UtilService.checkValidObject(req.UserJwtData) || !UtilService.checkValidNumber(req.UserJwtData.userId) || !UtilService.checkValidString(req.UserJwtData.role)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid authorization data',
        });
      }
      req.UserJwtData.userId = Number(req.UserJwtData.userId);

      if (req.UserJwtData.role != 'Admin') {
        return res.status(404).json({
          status: 0,
          msg: 'Unauthorised user -> API only accessible to Admin',
        });
      }

      let usersData = await DatabaseService.getData(`select id as userId, email, name, role from users`);
      if (!UtilService.checkValidArray(usersData) || usersData.length == 0) {
        return res.status(404).json({
          status: 0,
          msg: 'No users found',
        });
      }

      return res.status(200).json({
        status: 1,
        msg: 'All users data fetched successfully',
        data: usersData
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }

  async updateUserProfile(req, res) {
    try {
      if (!UtilService.checkValidNumber(req.params.id)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid params',
        });
      }
      let userId = Number(req.params.id);

      let findUser = await DatabaseService.getData(`select id, name, email, role from users where id = ?`, [userId]);
      if (!UtilService.checkValidArray(findUser) || findUser.length != 1) {
        return res.status(404).json({
          status: 0,
          msg: 'userId not found',
        });
      }

      let reqBody = req.body;
      if (!UtilService.checkValidObject(reqBody)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid body',
        });
      }

      if (!UtilService.checkValidEmail(reqBody.email) && !UtilService.checkValidString(reqBody.name) && !UtilService.checkValidString(reqBody.role)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid body params',
        });
      }

      if (UtilService.checkValidString(reqBody.role) && !VALID_USER_ROLES.includes(reqBody.role)) {
        return res.status(404).json({
          status: 0,
          msg: 'Invalid role in body',
        });
      }

      if (UtilService.checkValidEmail(reqBody.email)) {
        let checkExistingEmail = await DatabaseService.getData(`select id from users where email = ? and id != ?`, [reqBody.email, userId]);
        if (UtilService.checkValidArray(checkExistingEmail) && checkExistingEmail.length > 0) {
          return res.status(404).json({
            status: 0,
            msg: 'email already present for other user',
          });
        }
      }

      if (UtilService.checkValidEmail(reqBody.email) && UtilService.checkValidString(reqBody.name) && UtilService.checkValidString(reqBody.role)) {
        await DatabaseService.setData(`update users set email = ?, name = ?, role = ? where id = ?`, [reqBody.email, reqBody.name, reqBody.role, userId]);
      } else if (UtilService.checkValidEmail(reqBody.email) && UtilService.checkValidString(reqBody.name)) {
        await DatabaseService.setData(`update users set email = ?, name = ? where id = ?`, [reqBody.email, reqBody.name, userId]);
      } else if (UtilService.checkValidString(reqBody.name) && UtilService.checkValidString(reqBody.role)) {
        await DatabaseService.setData(`update users set name = ?, role = ? where id = ?`, [reqBody.name, reqBody.role, userId]);
      } else if (UtilService.checkValidEmail(reqBody.email) && UtilService.checkValidString(reqBody.role)) {
        await DatabaseService.setData(`update users set email = ?, role = ? where id = ?`, [reqBody.email, reqBody.role, userId]);
      } else if (UtilService.checkValidEmail(reqBody.email)) {
        await DatabaseService.setData(`update users set email = ? where id = ?`, [reqBody.email, userId]);
      } else if (UtilService.checkValidString(reqBody.name)) {
        await DatabaseService.setData(`update users set name = ? where id = ?`, [reqBody.name, userId]);
      } else if (UtilService.checkValidString(reqBody.role)) {
        await DatabaseService.setData(`update users set role = ? where id = ?`, [reqBody.role, userId]);
      }

      return res.status(200).json({
        status: 1,
        msg: 'Profile updated successfully',
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        status: 0,
        msg: 'Internal server error',
      });
    }
  }
}

module.exports = new UserController();