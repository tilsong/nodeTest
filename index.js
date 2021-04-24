const express = require('express'); //express 모듈을 가져온다. 다운 받았기 때문에 가능
const app = express(); //새로운 express 앱을 만든다.
const PORT = 8000; //서버 포트
const bodyParser = require('body-parser'); //json body 정보
const cookieParser = require('cookie-parser'); //쿠키
const config = require('./config/key'); //비밀 정보 외부로 감추기

const { User } = require("./models/User"); //User 모델 사용
const { auth } = require('./middleware/auth');//auth 사용

//application/x-www-form-urlencoded를 가져옴
app.use(bodyParser.urlencoded({
    extended: true
})); //클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 함

//application/json 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~ 안녕하세요 추가'))

//register router
app.post('/api/users/register', (req, res) => {
    //회원 가입 할 때 필요한 정보들을  client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body) //bodyparser로 클라이언트의 정보를 받아준다.

    user.save((err, userInfo) => { //몽고디비의 메소드
        if (err) return res.json({
            success: false,
            err
        })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => { //메소드는 User.js에서 만듦
             if (!isMatch){
                  return res.json({
                      loginSuccess: false,
                      message: "비밀번호가 틀렸습니다."
                  })
             }
             //비밀번호까지 맞다면 Token을 생성하기.
             user.generateToken((err, user) => {
                 if(err) return res.status(400).send(err);
                
                 // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션 등
                 // 쿠키로 해봄
                 res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id});
             })
        })
    })
})

//role의 값에 대한 정책을 어떻게 정하냐에 따라 내용이 달라질 수도 있다.
// role 1 어드민   role 2 특정 부서 어드민
// role 0 -> 일반유저   role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res)=> {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({ success:false, err });
        return res.status(200).send({
            success: true
        })
    })
})


app.listen(PORT, () => console.log(`Server is running at: ${PORT}!`)); // '아니고 `임!! 주의^^