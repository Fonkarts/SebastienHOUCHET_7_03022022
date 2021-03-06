const dbConfig = require("../config/dbConfig.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./userModel.js")(sequelize, Sequelize);
db.article = require("./articleModel.js")(sequelize, Sequelize);
db.role = require("./roleModel.js")(sequelize, Sequelize);
db.comment = require("./commentModel.js")(sequelize, Sequelize);
db.likes = require("./likesModel.js")(sequelize, Sequelize);

// RELATIONS ENTRE TABLES
// Certaines de ces tables de liaisons ne sont pas encore utilisées.
// Il était dans un premier temps prévu de supprimer les tables non-utilisées, mais ce faisant
// une erreur est apparue dans le node et bloquait le lancement de l'application.
// Ceci ayant été découvert juste avant la livraison du prototype, et n'ayant plus le temps
// de me pencher sur le problème, ces tables non utilisées ont été gardées.

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(
db.role, {
through: "user_roles",
foreignKey: "userId",
otherKey: "roleId"
});

db.article.belongsToMany(
db.user, {
through: "user_articles",
foreignKey: "articleId",
otherKey: "userId"
});

db.user.belongsToMany(db.article, {
through: "user_articles",
foreignKey: "userId",
otherKey: "articleId"
});

db.comment.belongsToMany(
db.user, {
through: "user_comments",
foreignKey: "commentId",
otherKey: "userId"
});

db.user.belongsToMany(db.comment, {
through: "user_comments",
foreignKey: "userId",
otherKey: "commentId"
});

db.article.belongsToMany(db.comment, {
through: "article_comments",
foreignKey: "articleId",
otherKey: "commentId"
});

db.comment.belongsToMany(db.article, {
through: "article_comments",
foreignKey: "commentId",
otherKey: "articleId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;