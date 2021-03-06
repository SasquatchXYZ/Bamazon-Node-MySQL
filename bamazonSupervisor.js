'use strict';

// Required Modules ====================================================================================================

const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console-table');

// Various Query Options ===============================================================================================

const queryAll = "SELECT * FROM departments";
const queryNew = "INSERT INTO departments SET ?";

let deptIDArray;

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
    //console.log(`Connected as ID: ${connection.threadId}`);
    supervisorMenu();
});

// Initial Supervisor Menu =============================================================================================

function supervisorMenu() {
    inquirer
        .prompt({
            name: 'apple',
            type: 'list',
            message: 'What would you like to do?'.yellow,
            choices: ['View Product Sales by Department',
                'View/Update Department',
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

// Supervisor Case 1 ===================================================================================================

function departmentSales() {
    let newCol1 = `SELECT department_name, SUM(product_sales) AS product_sales FROM products GROUP BY department_name`;
    let test = `SELECT * FROM departments`;
    let test8 = `SELECT departments.*, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY department_name ORDER BY department_id ASC`;

    let query = `SELECT departments.*, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit`;
    query +=` FROM departments LEFT JOIN products ON departments.department_name=products.department_name`;
    query +=` GROUP BY department_name ORDER BY department_id ASC`;


    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        supervisorMenu();
    });
}

// Supervisor Case 2 ===================================================================================================

function updateDepartment() {
    inquirer
        .prompt(
            {
                name: 'pick',
                type: 'list',
                message: 'Would you like to:?'.yellow,
                choices: [
                    'Update Overhead',
                    'Remove Department',
                    'Exit to Main Menu'
                ]
            }
        )
        .then(function (response) {
            switch (response.pick) {
                case 'Update Overhead':
                    update();
                    break;
                case 'Remove Department':
                    rmDept();
                    break;
                case 'Exit to Main Menu':
                    supervisorMenu();
                    break;
            }
        });
}

function update() {
    deptIDArray = [];
    connection.query(queryAll, function (err, res) {
        if (err) throw err;
        console.table(res);
        for (let n = 0; n < res.length; n++) {
            deptIDArray.push(res[n].department_id);
        }
        inquirer
            .prompt([
                {
                    name: 'id',
                    type: 'input',
                    message: 'What is the ID number?'.red,
                    validate: function (value) {
                        return isNaN(value) === false;
                    }
                },
                {
                    name: 'overhead',
                    type: 'input',
                    message: 'What is the new overhead?'.red,
                    validate: function (value) {
                        return isNaN(value) === false;
                    }
                }
            ])
            .then(function (response) {
                if (deptIDArray.indexOf(parseInt(response.id)) > -1) {
                    connection.query(`UPDATE departments SET ? WHERE ?`,
                        [
                            {
                                over_head_costs: response.overhead
                            },
                            {
                                department_id: response.id
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log(`${res.affectedRows} overhead updated.`);
                            supervisorMenu();
                        });
                } else {
                    console.log(`That is not an acceptable ID number.`.red);
                    updateDepartment();
                }
            });
    });
}

function rmDept() {
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
                    name: 'id',
                    type: 'input',
                    message: 'What is the ID number of the department you would like to remove?'.red,
                    validate: function (value) {
                        return isNaN(value) === false;
                    }
                }
            )
            .then(function (response) {
                if (deptIDArray.indexOf(parseInt(response.id)) > -1) {
                    connection.query(`DELETE from departments WHERE ?`,
                        {
                            department_id: response.id
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log(`${res.affectedRows} department deleted.`);
                            supervisorMenu();
                        })
                } else {
                    console.log(`That is not an acceptable ID number.`.red);
                    updateDepartment();
                }
            });
    });

}

// Supervisor Case 3 ===================================================================================================

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