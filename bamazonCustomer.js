'use strict';

// Required Modules ====================================================================================================

const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console-table');

// Various Query Options ===============================================================================================

const customerQuery = "SELECT item_id, product_name, price FROM products";
const queryAll = "SELECT * FROM products";
const queryWhere = "WHERE ?";
const queryUpdate = "UPDATE products SET ?";
let idArray;

// Creating the MySQL Connection =======================================================================================

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}`);
    //connection.end();
    displayInventory();
});

// Initial Customer Display of Products and Prompt for Purchase ========================================================

function displayInventory() {
    connection.query(customerQuery, function (err, res) {
        if (err) throw err;
        idArray = [];
        console.table(res);
        for (let k = 0; k < res.length; k++) {
            idArray.push(res[k].item_id);
        }
        //console.log(idArray);
        queryUsers();
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
                validate: function (value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function (answers) {
            //console.log(answers.id, answers.quantity_request);
            connection.query(`${queryAll} ${queryWhere}`, {item_id: answers.id}, function (err, response) {
                if (err) throw err;
                //console.log(response);
                //console.log(`${response[0].item_id}, ${response[0].product_name}, ${response[0].stock_quantity}`);
                if (response[0].stock_quantity >= answers.quantity_request) {
                    //console.log('you can buy this!'.rainbow);
                    let subTotal = (answers.quantity_request * response[0].price).toFixed(2);
                    connection.query(`${queryUpdate} ${queryWhere}`,
                        [{
                            stock_quantity: (response[0].stock_quantity - answers.quantity_request)
                        },
                            {
                                item_id: answers.id
                            }],
                        function (error, response) {
                            //console.log(`${response.affectedRows} Updated.`.green);
                        });
                    console.log(`Your total is $${subTotal}.  Thank you for your purchase!`.green);
                    updateProductSales(answers.id, subTotal);
                } else {
                    console.log('Insufficient Quantity! Please make another selection.'.bold.red);
                    exitOption();
                }
            });
        });
}

// Updating the product_sales information for the purchased option following successful purchase =======================

function updateProductSales(id, sales) {
    connection.query(`SELECT product_sales FROM products ${queryWhere}`, {item_id: id}, function (err, res) {
        if (err) throw err;
        let salesTotal = (parseFloat(sales) + res[0].product_sales);
        connection.query(`${queryUpdate} ${queryWhere}`, [{product_sales: salesTotal}, {item_id: id}], function (err, res) {
            if (err) throw err;
            console.log(`${res.affectedRows} updated.`);
            exitOption();
        })
    });
}

// Function to allow the Customer to Exit Bamazon ======================================================================

function exitOption() {
    inquirer
        .prompt({
            name: 'another',
            type: 'confirm',
            message: 'Would you like to make another purchase?',
            default: true
        })
        .then(function (response) {
            if (response.another) {
                displayInventory();
            } else {
                console.log('Thank you for your business.  Please come again!'.yellow);
                connection.end();
            }
        });
}

// =====================================================================================================================
// This is reserved for if the store expands and has a very large amount of different items
// (i.e Walmart or Target), where instead of a list of the item IDs the customer can scroll through,
// which might take eons with 200+ items.  The customer will simply be able to enter the number.
// I made this function just in case... optimism, American Dream...
function queryUsersManyItems() {
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'input',
                message: 'What is the ID number of the product you would like to purchase?'.magenta,
                validate: function (value) {
                    return isNaN(value) === false;
                }
            },
            {
                name: 'quantity_request',
                type: 'input',
                message: 'How many would you like to purchase?',
                validate: function (value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function (answers) {
            if (idArray.indexOf(parseInt(answers.id)) > -1) {
                connection.query(`${queryAll} ${queryWhere}`, {item_id: answers.id}, function (err, response) {
                    if (err) throw err;
                    if (response[0].stock_quantity >= answers.quantity_request) {
                        let subTotal = (answers.quantity_request * response[0].price).toFixed(2);
                        connection.query(`${queryUpdate} ${queryWhere}`,
                            [{
                                stock_quantity: (response[0].stock_quantity - answers.quantity_request)
                            },
                                {
                                    item_id: answers.id
                                }],
                            function (error, response) {
                            });
                        console.log(`Your total is $${subTotal}.  Thank you for your purchase!`.green);
                        updateProductSales(answers.id, subTotal);
                    } else {
                        console.log('Insufficient Quantity! Please make another selection.'.bold.red);
                    }
                    exitOption();
                });
            } else {
                console.log(`${answers.id} is not an appropriate ID Number.`.red);
                exitOption();
            }
        });
}