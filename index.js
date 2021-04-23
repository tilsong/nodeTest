const express = require('express'); //express 모듈을 가져온다. 다운 받았기 때문에 가능
const app = express(); //새로운 express 앱을 만든다.
const PORT = process.env.PORT = 8000; //서버 포트
///
//app.use(express.static('public'));
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://eun:asdf1234@boilerplate.8bsgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~ 안녕하세요'))

app.listen(PORT, () => console.log(`Server is running at: ${PORT}!`));// '아니고 `임!! 주의^^