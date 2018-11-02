
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
    console.log(`Connected as ID: ${connection.threadId}`);
    connection.end();
});