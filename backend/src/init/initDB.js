const db = require('../db/connection')
const sequelize = require('../db/sequelize')
const User = require('../models/user')
const Article = require('../models/article')
const Tag = require('../models/tag')
const Comment = require('../models/comment')

/*
	A.hasOne(B); // A 有一个 B
	A.belongsTo(B); // A 属于 B
	A.hasMany(B); // A 有多个 B
	A.belongsToMany(B, { through: 'C' }); // A 属于多个 B , 通过联结表 C
 */
// 初始化
const initRelation = () => {
	// 用户和文章的关系
	User.hasMany(Article, {
		onDelete:'CASCADE'
	})
	Article.belongsTo(User)
	// 用户和评论的关系
	User.hasMany(Comment, {
		onDelete:'CASCADE'
	})
	Comment.belongsTo(User)
	// 用户和喜欢
	User.belongsToMany(Article, {
		through: 'Favourites',
		timestamps: false
	})
	Article.belongsToMany(User, {
		through: 'Favourites',
		timestamps: false
	})
	// 用户和用户之间
	User.belongsToMany(User, {
		through: 'Followers',
		as: 'followers',
		timestamps: false
	})
	// 文章和标签关系
	Article.belongsToMany(Tag, {
		through: 'TagList',
		uniqueKey:false,
		timestamps:false
	})
	Tag.belongsToMany(Article,{
		through: 'TagList',
		uniqueKey:false,
		timestamps:false
	})
}

const initDB = () => {
	return new Promise(async (resolve, reject) => {
		try {
			// 数据库连接
			await db()
			//	初始化model关系
			initRelation()
			//	其他操作
			// 同步所有模型
			await sequelize.sync()
			resolve()
		} catch (e) {
			console.log(e)
			reject()
		}
	})
}

module.exports = initDB