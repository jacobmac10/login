const {User} = require('./../models/user');
const {Image} = require('./../models/image');


Image.hasOne(User);
User.belongsTo(Image);