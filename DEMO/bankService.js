
accountDetails = {
    userone: { accno: 1000, balance: 1000, username: "userone", password: "testuser1", history: [] },
    usertwo: { accno: 1001, balance: 1000, username: "usertwo", password: "testuser2", history: [] },
    userthree: { accno: 1002, balance: 1000, username: "userthree", password: "testuser3", history: [] }
}

var USERNAME

authenticateUser = (uname, pwd) => {
    let dataset = accountDetails;
    if (uname in dataset) {
        //alert("username exists")
        if (dataset[uname].password === pwd) {
            USERNAME = uname;
            return 1;
            // window.location.href = "testhome.html"
            // alert("successful login")
        }
        else {
            return 0;
            // alert("invalid password")
        }
    }
    else {
        return -1;
    }
}


deposit = (uname, pwd, amnt) => {

    var user = authenticateUser(uname, pwd);
    let dataset = accountDetails;
    // var amount=parseInt(amnt);

    if (user == 1) {
        dataset[uname].balance += amnt;
        //   alert("ur acc has been credited with amnt" + amnt + "aval balance " + dataset[uname].balance);


        dataset[uname].history.push({
            username: uname,
            amount: amnt,
            type_of_transaction: "credit"
        })  //history

        return {balance:dataset[uname].balance, 
                message: "ur acc has been credited with amnt" + amnt + "aval balance " + dataset[uname].balance}
    }
    else if (user == 0) {
        //   alert("invalid password")

        return {message:"invalid password"}
    }
    else {

        //   alert("username dosent exist")
        return {message:"username dosent exist"};
    }
    // return user;
}


withdraw = (uname, pwd, amnt) => {

    var user = authenticateUser(uname, pwd);
    let dataset = accountDetails;

    if (user == 1) {

        if (dataset[uname].balance >= amnt) {

            dataset[uname].balance -= amnt;

            // alert("ur acc has been debited with amnt" + amnt + "aval balance " + dataset[uname].balance)

            dataset[uname].history.push({ username: uname, amount: amnt, type_of_transaction: "debit" })  //history

            return {message:"ur acc has been debited with amnt" + amnt + "aval balance " + dataset[uname].balance}

        }
        else {
            // alert("insufficient balance");
            return {message:"insufficient balance"}
        }
    }
    else if (user == 0) {
        //   alert("invalid password")
        return {message:"invalid password"}

    }
    else {
        //   alert("username dosent exist")
        return {message:"username dosent exist"}
    }


}

onHistory=()=>{
    return {history: accountDetails[USERNAME].history}
    // let dataset=this.accountDetails;
    // return dataset["userone"].history;
}


module.exports = {
    authenticateUser, accountDetails, deposit, withdraw,onHistory
}