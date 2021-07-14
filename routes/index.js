var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
const { token } = require('morgan');

const jwtSecret = "secretkey#*"

const User = require('../models/user')

var bankService = require('../services/bankServices')

/* GET home page. */
router.get('/', function (req, res, next) {

  // const user =new User({    //it is used to add data to db
  //   accno: 1234,
  //   balance: 1000,
  //   username: "abhiram",
  //   password: "Abhi@123",
  //   history: [
  //          ]
  // })
  // user.save();

  // User.find().then((data)=>{   //it is a promise(asynchronous fn) used to fetch data from mongodb
  //   res.send(data);
  // })

  // res.render('index', { title: 'hellow world' });
});

// router.post('/', function(req, res, next) {
//   console.log(req.body)
//   res.render('index', { title: 'hellow world' });
// });



const authMiddleware = (req, res, next) => {  //for validating the keys
  try {
    // console.log(req.headers.authorization);
    var token = req.headers.authorization.split(" ")[1];//it will split the tocken in to 2 parts . bearer and tocken.split using space
    // let decoded = jwt.verify(req.body.token, jwtSecret);  //decoding the username from token using secret key
    let decoded = jwt.verify(token, jwtSecret); //here token (authorization) is passed through the headers instead of body.we can access it by using req.headers.authorization
    req.decoded = decoded;
    next()
  }
  catch {
    res.status(401).send({ message: "invalid details" })
  }
}



router.post('/login', (req, res, next) => {
  // console.log(req.body);
  // res.send(req.body)
  let uname = req.body.username;
  let pwd = req.body.password;
  // let result = bankService.authenticateUser(uname, pwd);
  bankService.authenticateUser(uname, pwd)
    .then((user) => {   //it is a promise(asynchronous fn) used to fetch data from mongodb
      
      if (user){
        const token = jwt.sign({   //sigining the username with secret key  to generate unique token
          // username: req.body.username,
          username:user.username,
          _id:user._id
        }, jwtSecret)   //secret key must be unique

        // var avalBalance = bankService.accountDetails[uname].balance;
        // console.log(avalBalance);

        res.send({ message: "logged in sucessfully", token: token, avalBalance: user.balance})
      }
      else {
        // res.send("invalid credintals")
        res.status(422).send({ message: "invalid credentials" });
      }
    })


   

  // console.log(avalBal);
  // if (result.one == 1) {
  //   const token = jwt.sign({   //sigining the username with secret key  to generate unique token
  //     username: req.body.username
  //   }, jwtSecret)   //secret key must be unique
  //   var avalBalance= bankService.accountDetails[uname].balance;
  //   console.log(avalBalance)
  //   res.send({ message: "logged in sucessfully", token: token ,avalBalance:result.avalBal})
  // }
  // else {
  //   // res.send("invalid credintals")
  //   res.status(422).send({ message: "invalid credentials" });
  // }
});


//deposit
router.post('/deposit', authMiddleware, (req, res) => {
  // let uname=req.body.username;
  // let pwd=req.body.password;
  console.log(req.headers)
  let amnt = req.body.amount;
  // let decoded = jwt.verify(req.body.token, jwtSecret);  //decoding the username from token using secret key
  bankService.deposit(req.decoded._id, parseInt(amnt))//sending decoded username to deposit fn//req.decoded contain the decoded username
  .then((message)=>{    // promise will be returned
    res.send(message); //response is send to frontent
  })
  
})

router.post('/withdraw', authMiddleware, (req, res) => {
  // let uname=req.body.username;
  // let pwd=req.body.password;

  let amnt = req.body.amount;
  // let decoded = jwt.verify(req.body.token, jwtSecret);
  bankService.withdraw(req.decoded._id, parseInt(amnt)) //here req.decoded will recive decoded from the authMiddleware
  .then((message)=>{
    res.send(message);
  })
  
})

// router.get('/history', (req, res) => {
//   // let history=bankService.accountDetails.userone.history;
//   let history = bankService.onHistory()
//   res.send(history)
// })

router.get('/transHistory', authMiddleware, (req, res) => {

  // let decoded = jwt.verify(req.body.token, jwtSecret);
  bankService.getHistory(req.decoded._id)   //here req.decoded will recive decoded from the authMiddleware 
  .then((message)=>{
    res.send(message);
  })
  //  console.log(message)
})

router.post('/registration', (req, res) => {
  let uname = req.body.username;
  let accno = parseInt(req.body.accno);
  let balance = req.body.balance;
  let password = req.body.password;
  console.log(req.body)
  bankService.registration(uname, accno, balance, password)
  .then((message)=>{
    res.send(message);
  })
})

router.get('/userProfile', authMiddleware, (req, res) => {
  bankService.getProfile(req.decoded._id) 
  .then((message)=>{
    res.send(message);
  })
})

router.patch('/userProfile',authMiddleware,(req,res)=>{
  bankService.updateUser(req.decoded._id,req.body)  //req.body contains the updated data as an object.ie,username,balance,accno
  .then((user)=>{
    res.send({message:"user profile updated sucessfully"})
  })
})

// **********user editing using query parametes passes through url****************

router.get('/user',(req,res)=>{
  bankService.getUsers()
  .then(user=>{
    res.send(user);
  })
});

router.get('/user/:id',(req,res)=>{
  bankService.GETuser(req.params.id)
  .then(user=>{
    res.send(user);
  })
});

router.patch('/user/:id',(req,res)=>{
  bankService.updateEditUser(req.params.id,req.body)
  .then(user=>{
    res.send({message:"user edited sucessfully"});
  })
});

//*********************** */ deleting*****************
router.delete('/user/:id',(req,res)=>{
  bankService.deleteUser(req.params.id)
  .then((result)=>{
    res.send({message:"user deleted sucessfully",result:result})
  })
})

// **********seraching a string using regex***************
router.get('/name',(req,res)=>{
  User.find({
    username:{
      $regex:/^messi$/
    },
    balance:{
      $gt:2000  //$lt,$lte,$gte can also used  //thes are acalled mongodb operators
    }
  })
  .then((users)=>{
    res.send(users)
  })
})

module.exports = router;
