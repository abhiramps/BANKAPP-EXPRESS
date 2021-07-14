var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");

const jwtSecret="secretkey#*"

var bankService=require('../services/bankServices')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hellow world' });
});

// router.post('/', function(req, res, next) {
//   console.log(req.body)
//   res.render('index', { title: 'hellow world' });
// });


router.post('/login',(req, res, next)=> {

  // console.log(req.body);
  // res.send(req.body)
  let uname=req.body.username;
  let pwd=req.body.password;
  let result=bankService.authenticateUser(uname,pwd);
  
  if(result==1){

    const token=jwt.sign({   //sigining the username with secret key  to generate unique token
      username:req.body.username
    },jwtSecret)   //secret key must be unique

    res.send({message:"logged in sucessfully",token:token})
  }
  else{
    // res.send("invalid credintals")
    res.send({message:"invalid credentials"});
  }
 
});


//deposit
router.post('/deposit',(req,res)=>{
  let uname=req.body.username;
  let pwd=req.body.password;
  let amnt=req.body.amount;

  let message=bankService.deposit(uname,pwd,parseInt(amnt));
  res.send(message);
  // if(deposit==1){
  //   res.send("deposit sucessfully");
    
  // }
  // else{
  //   res.send("deposit unsucessful")
  // }
})

router.post('/withdraw',(req,res)=>{
  let uname=req.body.username;
  let pwd=req.body.password;
  let amnt=req.body.amount;

  let message=bankService.withdraw(uname,pwd,parseInt(amnt));
  res.send(message);
})

router.get('/history',(req,res)=>{
  // let history=bankService.accountDetails.userone.history;
  let history=bankService.onHistory()
  res.send(history)
})

module.exports = router;
