const { VALID_USER_ROLES } = require('../config/config.js');
const UtilService = require('../services/utilService.js');
const DatabaseService = require('../services/databaseService.js');

class UserController{
  async register(req, res){
    let reqBody = req.body;

    if(!UtilService.checkValidObject(reqBody)){
      return res.status(404).json({
        status: 0,
        msg: 'Invalid body',
      });
    }

    if(!UtilService.checkValidEmail(reqBody.email)){
      return res.status(404).json({
        status: 0,
        msg: 'Invalid email',
      });
    }
    if(!UtilService.checkValidString(reqBody.name)){
      return res.status(404).json({
        status: 0,
        msg: 'Invalid name',
      });
    }
    if(!UtilService.checkValidString(reqBody.password)){
      return res.status(404).json({
        status: 0,
        msg: 'Invalid password',
      });
    }
    if(!UtilService.checkValidString(reqBody.role) || !VALID_USER_ROLES.includes(reqBody.role)){
      return res.status(404).json({
        status: 0,
        msg: 'Invalid role',
      });
    }

    console.log("reqBody: ", reqBody);

    let selectResp = await DatabaseService.getData(`select id from users where email = ?`, [reqBody.email]);
    if(!UtilService.checkValidArray(selectResp) || selectResp.length > 0){
      return res.status(404).json({
        status: 0,
        msg: 'email already exists',
      });
    }

    await DatabaseService.setData(`insert into users (email, password, name, role) values (?, ?, ?, ?)`, [reqBody.email, reqBody.password, reqBody.name, reqBody.role]);

    return res.status(200).json({
      status: 1,
      msg: 'User registered successfully',
    });
  }

  async login(req, res){
    return res.status(200).json({
      status: 1,
      msg: 'User logged in successfully',
    });
  }
}

module.exports = new UserController();