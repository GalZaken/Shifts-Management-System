var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({

    username: String,
    password: String,
    firstname: String,
    lastname: String,
    idNumber: String,
    email: String,
    phoneNumber: String,
    role: String,
    status: String,
    priority: String
});

var User = module.exports = mongoose.model('users', UserSchema);

// ------- USER METHODS: ------- //

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUsersList = function(callback) {
    var query = {};
    User.find(query, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.removeUserById = function(id, callback) {
    User.findByIdAndRemove(id, callback);
}

module.exports.updateUserById = function(id, updatedUser, callback) {
    User.findByIdAndUpdate(id, updatedUser, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

//     module.exports.createAdminUser = function() {
//         var newUser = new User({
//             username: 'admin',
//             password: '123'
//         });
//
//         User.createUser(newUser, function(err, user){
//             if(err) throw err;
//             console.log(user);
//         });
// }
