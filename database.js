const { Sequelize, DataTypes } = require("sequelize");
const { Model } = require("sequelize");
const sequelize = new Sequelize("test-db", "user", "password", {
  dialect: "sqlite",
  host: "./dev.sqlite",
});
class User extends Model {}
class Message extends Model {}
User.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    map: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

Message.init(
  {
    text: {
      type: DataTypes.STRING,
    },
    from: {
      type: DataTypes.STRING,
    },
    to: {
      type: DataTypes.STRING,
    },
    senderMap: {
      type: DataTypes.STRING,
    },
    receiverMap: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize,
    modelName: "Usermsg",
  }
);
module.exports = { sequelize, User, Message };
