var mongoose = require('mongoose');

var User = mongoose.model('User', {
    accno: Number,
    balance: Number,
    username: String,
    password: String,
    history: [
        {
            username: String,
            amount: Number,
            type_of_transaction: String
        }
    ]
})

module.exports=User;