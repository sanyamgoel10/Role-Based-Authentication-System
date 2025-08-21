require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  VALID_USER_ROLES: ['Admin', 'Legal', 'PM', 'Sales', 'HR', 'Support', 'Operations']
}