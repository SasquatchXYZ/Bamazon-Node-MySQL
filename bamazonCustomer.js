const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM products";

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
        /*for (let k = 0; k < res.length; k++) {
            console.log(`Item ID: ${res[k].item_id} || Product Name: ${res[k].product_name} || Department: ${res[k].department_name} || Price: ${res[k].price} || Quantity: ${res[k].stock_quantity}`);
        }*/
        connection.end();
    });
}