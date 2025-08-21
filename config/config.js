require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  VALID_USER_ROLES: ['Admin', 'Legal', 'PM', 'Sales', 'HR', 'Support', 'Operations'],
  BCRYPT_ENCRYPTION_ROUNDS: parseInt(process.env.BCRYPT_ENCRYPTION_ROUNDS) || 12,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRY: '1h',
  
}