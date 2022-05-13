const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/octopus_event', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (error) {
  if (error) {
    console.log("数据库连接失败")
  } else {
    console.log("数据库连接成功")
  }
})

const Schema = mongoose.Schema
const OctopusEvent = new Schema({
  //这里是数据库自己创建的属性名：他的属性类型   如：
  'id':       { type: String,  require: true },
  'name':     { type: String,  require: true },
  'type':     { type: String,  require: true },
  'xpath':    { type: String,  require: true },
  'isHidden': { type: Boolean, require: false },
  'url':      { type: String,  require: true },
  'desc':     { type: String,  require: false },
})

const Event = mongoose.model('Event', OctopusEvent);




const app = new express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse text/plain
// app.use(bodyParser.text());

app.get('/', (req, res) => {
  res.send('aaa')
});

app.get('/getEventList', (req, res) => {
  Event.find({}, {_id: 0, __v: 0}).then(doc => {
    console.log(doc);
    const data = {
      code: 200,
      data: doc,
      msg: 'success',
    };
    res.send(data);
  })
})

app.post('/addEvent', (req, res) => {
  console.log(req.body);
  Event.create({...req.body}).then(res => {
    console.log(res);
  })
  // const event = new Event({...req.body});
  // event.save();
  const data = {
    code: 200,
    msg: 'success',
  }
  res.send(data);
})

app.post('/reportData', (req, res) => {
  console.log(req.body);
  res.send('123123')
})

app.listen(9000, () => {
  console.log('app is listneing at 9000')
})