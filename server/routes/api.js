//define all api endpoints
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');


const mongoose = require('mongoose');
const db = "mongodb+srv://kenya_231:kenya_231@eventsdb.trmvx.mongodb.net/events?retryWrites=true&w=majority"


mongoose.connect(db, err => {
  if(err) {
    console.error('Error!' + err)
  }else{
    console.log('Connected to mongodb')
  }
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null'){
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}


router.get('/', (req, res) => {
  res.send('From API route')
})
//handles post request

router.post('/register', (req, res) => {
  //extract user info
  let userData = req.body
  let user = new User(userData)
  user.save((error, registeredUser) => {
    if (error) {
      console.log(error)
    }else {
      let payload = { subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }

  })
})
//create the login api
router.post('/login', (req, res) =>{
  let userData = req.body

  //check for the email to allow login
  User.findOne({ email: userData.email}, (error, user) => {
    if (error) {
      console.log(error)
    }else {
      if (!user) {
        res.status(401).send('Invalid email')
      } else
      if (user.password !== userData.password) {
        res.status(403).send('Invalid password')
      } else {
        let payload = { subject: user._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }

    }

  })

})

//api for regular events

router.get('/events', (req, res) =>{
  let events =  [
    {
      "_id": "1",
      "name": "Soko Ugali",
      "description": "maize flour",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "2",
      "name": "Sugar",
      "description": "sweet brown",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "3",
      "name": "Biscuits",
      "description": "crunchy",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "4",
      "name": "Indomie",
      "description": "sweet and yummy",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "5",
      "name": "Sphaghetti",
      "description": "ready-made pasta",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "6",
      "name": "Diapers",
      "description": "Soft and gentle",
      "date": "2021-11-15T09:06:43.511z"
    }
  ]
  res.json(events)
})

router.get('/special', verifyToken, (req, res) =>{
  let events =  [
    {
      "_id": "1",
      "name": "Soko Ugali",
      "description": "maize flour",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "2",
      "name": "Sugar",
      "description": "sweet brown",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "3",
      "name": "Biscuits",
      "description": "crunchy",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "4",
      "name": "Indomie",
      "description": "sweet and yummy",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "5",
      "name": "Sphaghetti",
      "description": "ready-made pasta",
      "date": "2021-11-15T09:06:43.511z"
    },
    {
      "_id": "6",
      "name": "Diapers",
      "description": "Soft and gentle",
      "date": "2021-11-15T09:06:43.511z"
    }
  ]
  res.json(events)
})




module.exports = router
