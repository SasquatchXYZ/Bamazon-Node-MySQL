'use strict';

const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const queryAll = "SELECT * FROM departments";
const queryNew = "INSERT INTO departments SET ?";

let deptIDArray;

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log(`Connected as ID: ${connection.threadId}`);
    supervisorMenu();
});

function supervisorMenu() {
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
        .then(function (pick) {
            switch (pick.apple) {
                case 'View Product Sales by Department':
                    departmentSales();
                    break;
                case 'View/Update Department':
                    updateDepartment();
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

function departmentSales() {
    let newCol1 = `SELECT department_name, SUM(product_sales) FROM products GROUP BY department_name`;
    //let query = `SELECT * FROM departments LEFT JOIN ${newCol1} ON d.department_name = p.department_name`;
    let query = `SELECT * FROM a.departments INNER JOIN (SUM(b.product_sales) FROM b.products GROUP by b.department_name) ON a.department_name = b.department_name`;

    connection.query(newCol1, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function updateDepartment() {
    deptIDArray = [];
    connection.query(queryAll, function (err, res) {
            if (err) throw err;
            console.table(res);
            for (let n = 0; n < res.length; n++) {
                deptIDArray.push(res[n].department_id);
            }
            inquirer
                .prompt(
                    {
                        name: 'dept',
                        type: 'list',
                        message: 'Would you like to:?'.yellow,
                        choices: [
                            'Update Overhead',
                            'Remove Department',
                            'Exit'
                        ]
                    })
                .then(function (response) {
                    switch (response.selection) {
                        case 'Update Overhead':
                            update();
                            break;
                        case 'Remove Department':
                            rmDept();
                            break;
                        case 'Exit':
                            connection.end();
                            break;
                    }
                });
        }
    )
}

function update() {

}

function rmDept() {

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
                validate: function (value) {
                    return isNaN(value) === false;
                }
            }
        ])
        .then(function (selection) {
            let newOverhead = parseInt(selection.newOverhead);
            connection.query(queryNew,
                {
                    department_name: selection.newDepartment,
                    over_head_costs: newOverhead
                },
                function (err, res) {
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
        .then(function (response) {
            switch (response.menu) {
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