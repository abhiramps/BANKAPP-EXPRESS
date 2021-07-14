const User = require('../models/user')

// var accountDetails = {
//     userone: { accno: 1000, balance: 1000, username: "userone", password: "testuser1", history: [] },
//     usertwo: { accno: 1001, balance: 1000, username: "usertwo", password: "testuser2", history: [] },
//     userthree: { accno: 1002, balance: 1000, username: "userthree", password: "testuser3", history: [] }
// }

// var avalBal;

const authenticateUser = (uname, pwd) => {

    return User.findOne({
        username: uname,    //if the uname and pwd are found in db,it will retrive the object.else nothing will return
        password: pwd
    })
    // .then((data)=>{   //it is a promise(asynchronous fn) used to fetch data from mongodb
    //     res.send(data);            //findOne() will retrive excact one object from db without enclosed in array
    // })

    // let dataset = accountDetails;
    // if (uname in dataset) {
    //     //alert("username exists")
    //     if (dataset[uname].password === pwd) {
    //         // avalBal = dataset[uname].balance;
    //         // return 1;
    //         return {one:1, avalBal:dataset[uname].balance}
    //         // window.location.href = "testhome.html"
    //         // alert("successful login")
    //     }
    //     else {
    //         return 0;
    //         // alert("invalid password")
    //     }
    // }
    // else {
    //     return -1;
    // }
}


const deposit = (_id, amnt) => {

    return User.findById(_id)
        .then((user) => {
            user.balance += amnt;
            user.history.push({
                username: user.username,
                amount: amnt,
                type_of_transaction: "credit"
            });
            user.save();
            return {
                balance: user.balance,
                message: "ur acc has been credited with amnt" + amnt + "aval balance " + user.balance
            }
        });

    // let dataset = accountDetails;
    // dataset[uname].balance += amnt;

    // dataset[uname].history.push({
    //     username: uname,
    //     amount: amnt,
    //     type_of_transaction: "credit"
    // })  //history

    // return {
    //     balance: dataset[uname].balance,
    //     message: "ur acc has been credited with amnt" + amnt + "aval balance " + dataset[uname].balance
    // }
}


const withdraw = (_id, amnt) => {
    return User.findById(_id)
        .then((user) => {
            if (user.balance >= amnt) {
                user.balance -= amnt;
                user.history.push({
                    username: user.username,
                    amount: amnt,
                    type_of_transaction: "debit"
                });
                user.save();
                return {
                    balance: user.balance,
                    message: "ur acc has been debited with amnt" + amnt + "aval balance " + user.balance
                }
            }
            else {
                return { message: "insufficient balance" }
            }

        })
    // let dataset = accountDetails;
    // if (dataset[uname].balance >= amnt) {
    //     dataset[uname].balance -= amnt;
    //     dataset[uname].history.push({ username: uname, amount: amnt, type_of_transaction: "debit" })  //history

    //     return {balance: dataset[uname].balance,
    //             message: "ur acc has been debited with amnt" + amnt + "aval balance " + dataset[uname].balance }
    // }
    // else {
    //     return { message: "insufficient balance" }
    // }
}

// onHistory = () => {
//     return { history: accountDetails[USERNAME].history }
//     // let dataset=this.accountDetails;
//    // return dataset["userone"].history;
// }
const getHistory = (_id) => {
    return User.findById(_id)
        .then((user) => {
            return { history: user.history }
        })
    // return { history: accountDetails[uname].history }
}

const registration = (uname, accno, balance, password) => {
    return User.findOne({
        username: uname,
        accno: accno
    })
        .then((user) => {
            if (user) {
                return { message: "user already exists" }
            }
            else {
                const regUser = new User({
                    "accno": accno,
                    "balance": balance,
                    "username": uname,
                    "password": password,
                    "history": []
                });
                regUser.save();
                return { message: "user :" + uname + " registered sucessfully" }
            }
        })

    // let dataset = accountDetails;
    // var regUser = {
    //     "accno": accno,
    //     "balance": balance,
    //     "username": uname,
    //     "password": password,
    //     "history": []
    // };

    // if (uname in accountDetails) {
    //     return { message: "user already exists" }
    // }
    // else {
    //     accountDetails[uname] = regUser;
    //     return { message: "user :" + uname + "registered sucessfully", accountsListDetails: accountDetails }
    // }
}

const getProfile = (_id) => {
    return User.findById(_id)
        .then((user) => {
            return { user };
        })
}

const updateUser = (_id, data) => {
    return User.findOneAndUpdate({ _id }, data) //it will find the object corresponding to the _id and update with (data)
    // .then((user)=>{
    //     return{message:"profile updated sucessfully"}
    // })
}

// **********user editing using query parametes passes through url****************
const getUsers = () => {
    return User.find()
}

const GETuser = (id) => {
    return User.findById(id)
        .then((user) => {
            return user
        })
}

const updateEditUser = (_id, data) => {
    return User.findOneAndUpdate({ _id }, data) 
  
}

const deleteUser=(id)=>{
    return User.findByIdAndDelete({
        id
    })
}



module.exports = {
    authenticateUser,
    deposit,
    withdraw,
    getHistory,
    registration,
    getProfile,
    updateUser,
    getUsers,
    GETuser,
    updateEditUser,
    deleteUser
}