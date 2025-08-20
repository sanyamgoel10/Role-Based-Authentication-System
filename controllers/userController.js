class UserController{
  async register(req, res){
    return res.status(200).json({
      status: 1,
      msg: 'User registered successfully',
    });
  }
}

module.exports = new UserController();