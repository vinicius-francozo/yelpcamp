const {DataTypes} = require('sequelize')
const passportLocalSequelize = require('passport-local-sequelize');

module.exports = (sequelize) => {
	const User = passportLocalSequelize.defineUser(sequelize, {
		email: DataTypes.STRING,
	})

	return User
}
