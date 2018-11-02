
const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM products";
const queryWhere = "WHERE ?";
const queryUpdate = "UPDATE products SET ?";
let idArray;

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function (error) {
    if (error) throw error;
    //console.log(`Connected as ID: ${connection.threadId}`);
    managerMenu();
});

function managerMenu() {
    inquirer
        .prompt({
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?'.yellow,
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Exit'
            ]
        })
        .then(function (response) {
            switch(response.selection) {
                case 'View Products for Sale':
                    viewInventory();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    restockInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

function viewInventory() {
    connection.query(queryAll, function(error, res) {
        if (error) throw error;
        console.table(res);
        managerMenu();
    });
}

function lowInventory() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 100`, function(error, res) {
        if (error) throw error;
        console.table(res);
        managerMenu();
    });
}

function restockInventory() {

}