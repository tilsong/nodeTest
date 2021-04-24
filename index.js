const express = require('express'); //express 모듈을 가져온다. 다운 받았기 때문에 가능
const app = express(); //새로운 express 앱을 만든다.
const PORT = 8000; //서버 포트
///
//app.use(express.static('public'));
const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require("./models/User");

//application/x-www-form-urlencoded를 가져옴
app.use(bodyParser.urlencoded({extended: true})); //클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 함

//application/json 가져옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~ 안녕하세요 추가'))

app.post('/register',(req, res) =>{
    //회원 가입 할 때 필요한 정보들을  client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body) //bodyparser로 클라이언트의 정보를 받아준다.

    user.save((err, userInfo) =>{ //몽고디비의 메소드
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(PORT, () => console.log(`Server is running at: ${PORT}!`));// '아니고 `임!! 주의^^