const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Review = sequelize.define('Review', {
        body: DataTypes.STRING,
        rating: DataTypes.INTEGER
    })

    return Review
}