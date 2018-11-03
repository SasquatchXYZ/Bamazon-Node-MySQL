'use strict';

const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM products";
const queryWhere = "WHERE ?";
const queryUpdate = "UPDATE products SET ?";
const queryNew = "INSERT INTO products SET ?";
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
            switch (response.selection) {
                case 'View Products for Sale':
                    viewInventory();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    restockInfo();
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
    connection.query(queryAll, function (error, res) {
        if (error) throw error;
        console.table(res);
        managerMenu();
    });
}

function lowInventory() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 100`, function (error, res) {
        if (error) throw error;
        if (res.length > 0) {
            console.table(res);
            managerMenu();
        } else {
            console.log('There are no low inventory items.'.green);
            managerMenu();
        }
    });
}

function restockInfo() {
    idArray = [];
    //let updateID;
    //let updateQuantity;
    connection.query("SELECT item_id FROM products", function (error, res) {
        if (error) throw error;
        res.forEach(item => {
            idArray.push(item.item_id);
        });
    });
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'input',
                message: 'What is the ID number of the product you wish to restock?',
                validate: function (value) {
                    return isNaN(value) === false;
                }
            },
            {
                name: 'restock_quantity',
                type: 'input',
                message: 'How many should be added to the inventory?',
                validate: function (value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function (update) {
            let updateID = parseInt(update.id);
            if (idArray.includes(updateID) === true) {
                connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: update.id}, function (err, res) {
                    if (err) throw err;
                    //console.log(res[0].stock_quantity);
                    let updateQuantity = res[0].stock_quantity + parseInt(update.restock_quantity);
                    //console.log(updateID, updateQuantity);
                    restockInventory(updateID, updateQuantity);
                });
            } else {
                console.log(`!! ${update.id} is not a valid ID Number currently in the Stock System !!`.red);
                restockInfo();
            }
        });
}

function restockInventory(id, quantity) {
    connection.query(`${queryUpdate} ${queryWhere}`, [{stock_quantity: quantity}, {item_id: id}], function (err, res) {
        console.log(`${res.affectedRows} successfully updated.`);
        restockMenu();
    });
}

function restockMenu() {
    inquirer
        .prompt({
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?'.yellow,
            choices: [
                'Main Menu',
                'Restock More Items',
                'Exit'
            ]
        })
        .then(function (response) {
            switch (response.selection) {
                case 'Main Menu':
                    managerMenu();
                    break;
                case 'Restock More Items':
                    restockInfo();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

function newProduct() {
    inquirer
        .prompt([
            {
                name: 'newProduct',
                type: 'input',
                message: 'What is the name of the new product?'.magenta
            },
            {
                name: 'newDepartment',
                type: 'list',
                message: 'What is the Department for this new product?'.cyan,
                choices: [
                    'Apparel', 'Arts & Crafts', 'Automotive', 'Baby', 'Electronics', 'Food',
                    'Furniture', 'Health & Beauty', 'Home & Office', 'Jewelry', 'Pet',
                    'Seasonal', 'Sporting Goods', 'Tools', 'Toys & Games', 'Everything Else'
                ]
            },
            {
                name: 'newPrice',
                type: 'input',
                message: `What is the new product's price?`.green,
                validate: function (value) {
                    return isNaN(value) === false;
                }
            },
            {
                name: 'newQuantity',
                type: 'input',
                message: 'How many should be added to the inventory?'.yellow,
                validate: function (value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function(answers) {
            let newPrice = (Math.floor(parseFloat(answers.newPrice) * 100) / 100); // Convert to number with accurate 2 decimal places.
            let newQuantity = parseInt(answers.newQuantity); // Convert to number, remove decimals (you can't have half a product.
            connection.query(queryNew,
                {
                    product_name: answers.newProduct,
                    department_name: answers.newDepartment,
                    price: newPrice,
                    stock_quantity: newQuantity
                },
                function(err, res) {
                console.log(`${res.affectedRows} New Product added to the Stock System.`.green);
                newMenu();
                })

            /*console.log(answers.newProduct);
            console.log(answers.newDepartment);
            console.log(newPrice);
            console.log(parseInt(answers.newQuantity));
            connection.end();*/
        });
}

function newMenu() {
    inquirer
        .prompt({
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?'.yellow,
            choices: [
                'Main Menu',
                'Add More New Products',
                'Exit'
            ]
        })
        .then(function (response) {
            switch (response.selection) {
                case 'Main Menu':
                    managerMenu();
                    break;
                case 'Add More New Products':
                    newProduct();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

/*
function restockInventory() {
    idArray = [];
    connection.query("SELECT item_id FROM products", function(error, res) {
        if (error) throw error;
        res.forEach(item => {
            idArray.push(item.item_id);
        });
    });
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'input',
                message: 'What is the ID number of the product you wish to restock?',
                validate: function(value) {
                    return isNaN(value) === false;
                }
            },
            {
                name: 'restock_quantity',
                type: 'input',
                message: 'How many should be added to the inventory?',
                validate: function(value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function(update) {
            console.log(update);
            if (idArray.includes(parseInt(update.id)) === true) {
                connection.query(`${queryUpdate} ${queryWhere}`,
                    [
                        {
                            stock_quantity: (stock_quantity += update.restock_quantity)
                        },
                        {
                            item_id: update.id
                        }
                    ])
            } else {
                console.log(`${update.id} is not a valid ID Number currently in the Stock System`);
                managerMenu();
            }
        })
}*/
