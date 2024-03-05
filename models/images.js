const { DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const Images = sequelize.define('Images', {
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.url.replace('/upload', '/upload/w_200');
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        }
      }
  })
  
  return Images
}
