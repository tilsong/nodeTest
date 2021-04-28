if(process.env.NODE_ENV === 'production') { //환경 변수가 프로덕션이면!
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}