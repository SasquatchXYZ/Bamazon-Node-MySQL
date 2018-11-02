const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM products";
const queryWhere = "WHERE ?";
let idArray = [];

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}`);
    //connection.end();
    displayInventory();
});

function displayInventory() {
    connection.query(queryAll, function(err, res) {
        if (err) throw err;
        //console.log(res);
        //connection.end();
        console.table(res);
        for (let k = 0; k < res.length; k++) {
            idArray.push(res[k].item_id);
        }

        queryUsers();
        //console.log(idArray);
        /*for (let k = 0; k < res.length; k++) {
            console.log(`Item ID: ${res[k].item_id} || Product Name: ${res[k].product_name} || Department: ${res[k].department_name} || Price: ${res[k].price} || Quantity: ${res[k].stock_quantity}`);
        }*/
        //connection.end();
    });
}

function queryUsers() {
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'list',
                message: 'What is the ID number of the product you would like to purchase?'.cyan,
                choices: idArray.toString().split(',')
            },
            {
                name: 'quantity_request',
                type: 'input',
                message: 'How many would you like to purchase?',
                validate: function(value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function(answers) {
            //console.log(answers.id, answers.quantity_request);
            connection.query(`${queryAll} ${queryWhere}`, {item_id: answers.id}, function(err, response) {
                console.log(`${response[0].item_id}, ${response[0].product_name}, ${response[0].stock_quantity}`);
                if (response[0].stock_quantity >= answers.quantity_request) {
                    console.log('you can buy this!'.rainbow);
                    connection.end();
                } else {
                    console.log('Insufficient Quantity! Please make another selection.'.bold.red);
                    queryUsers();
                }
            });
            //connection.end();
        });
}