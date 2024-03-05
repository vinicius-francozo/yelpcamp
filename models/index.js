const {Sequelize} = require('sequelize')
const config = require('../config/database')
const sequelize = new Sequelize(config.development)  

const Campgrounds = require('./campground')(sequelize)
const Reviews = require('./review')(sequelize)
const Images = require('./images')(sequelize)
const Users = require('./user')(sequelize);


(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to db');
        await sequelize.sync({force: false});
        console.log('Models synchronized');
    } catch (err) {
        console.error('Error in db:', err);
    }
})()


Campgrounds.hasMany(Reviews, {onDelete: 'CASCADE'})
Campgrounds.Images = Campgrounds.hasMany(Images)
Campgrounds.belongsTo(Users, {as: 'author'})
Reviews.belongsTo(Campgrounds)
Reviews.belongsTo(Users, {as: 'author'})
Images.belongsTo(Campgrounds)
Users.hasMany(Campgrounds)
Users.hasMany(Reviews)



module.exports = {
    Campgrounds,
    Reviews,
    Images,
    Users,
    sequelize
}