const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Campground = sequelize.define('Campground', {
        title: DataTypes.STRING,
        price: DataTypes.INTEGER,
        description: DataTypes.STRING,
        location: DataTypes.STRING,
    })

    return Campground
}