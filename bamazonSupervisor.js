'use strict';

const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM departments";
const queryNew = "INSERT INTO departments SET ?";

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log(`Connected as ID: ${connection.threadId}`);
    supervisorMenu();
});

function supervisorMenu(){
    inquirer
        .prompt({
            name: 'apple',
            type: 'list',
            message: 'What would you like to do?'.yellow,
            choices: ['View Product Sales by Department',
                'View/Update Department Overhead Costs',
                'Create New Department',
                'Exit']
        })
        .then(function(pick) {
            switch (pick.apple) {
                case 'View Product Sales by Department':
                    departmentSales();
                    break;
                case 'View/Update Department Overhead Costs':
                    updateOverhead();
                    break;
                case 'Create New Department':
                    createDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}


function updateOverhead() {
    connection.query(queryAll, function(err, res) {
        if (err) throw err;
        console.table(res);
        supervisorMenu();
    })
}

function createDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'What is the name for this New Department?'.red
            },
            {
                name: 'newOverhead',
                type: 'input',
                message: 'What is the overhead for this new Department?'.red,
                validate: function(value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function(selection) {
            let newOverhead = parseInt(selection.newOverhead);
            connection.query(queryNew,
                {
                    department_name: selection.newDepartment,
                    over_head_costs: newOverhead
                },
                function(err, res) {
                if (err) throw err;
                console.log(`${res.affectedRows} New Department Added`.green);
                newMenu();
                });
        });
}

function newMenu() {
    inquirer
        .prompt({
            name: 'menu',
            type: 'list',
            message: 'What would you like to do now?',
            choices: [
                'Return to Main Menu',
                'Add another Department',
                'Exit'
            ]
        })
        .then(function(response) {
            switch(response.menu) {
                case 'Return to Main Menu':
                    supervisorMenu();
                    break;
                case 'Add another Department':
                    createDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}