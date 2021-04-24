const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
//몽구스 함수임. index.js의 register router 부분에서 save함수를 실행하기 전에!
userSchema.pre('save', function (next) { //next()하면 save()로 바로 넘어감
    var user = this; //userSchema

    //다른 것 바꿀 때x, 비밀번호 만들거나 바꿀 때만 암호화해주어야 하므로 조건문을 건다.   
    if (user.isModified('password')) {

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltrounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) { //hash -> 암호화된 비밀번호
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else { //비밀번호 외의 것을 바꿀 때 save()로 연결
        next()
    }

})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567   암호화된 비밀번호 $2b$10$MYFmJEtkMmzgRwZ.iPzE..wgLbtsapO5FgiBNX3vy7VO3uEVDCl/u
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id" : decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}