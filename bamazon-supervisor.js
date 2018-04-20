// file packaged as a function for export
function bamazonSupervisor() {
    // variable declarations for required packages and imported files/functions
    require("dotenv").config();
    let mysql = require("mysql");
    let inquirer = require("inquirer");
    let colors = require('colors');
    let table = require("table");
    let Menu = require("./index.js");

    // variable declarations for table package
    let config,
        data,
        output;

    // declare variable for mysql connection to database
    let connection = mysql.createConnection({
        host: "localhost",
        port: 3306,

        // username
        user: "root",

        // password
        password: process.env.MYSQLPASSWORD,
        database: "bamazon"
    });

    // create connection to database and call supervisor menu
    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        supervisorMenu();
    });

    // supervisor menu
    function supervisorMenu() {
        inquirer.prompt([
            {
                type: "rawlist",
                name: "functions",
                message: "What would you like to do?",
                choices: [
                    "View product sales by department",
                    "Create new department",
                    "Back to role menu",
                    "Exit menu"
                ]
            }
        ]).then(function (userChoice) {
            // switch to call supervisor functions
            switch (userChoice.functions) {
                case "View product sales by department":
                    viewDepartmentSales();
                    break;
                case "Create new department":
                    createNewDepartment();
                    break;
                case "Back to role menu": // end connection and return to main bamazon menu
                    connection.end();
                    Menu.bamazonMenu();
                    break;
                case "Exit menu": // leave app
                    exitMenu();
                    break;
            }
        });
    }

    // function to view aggregate sales by department
    function viewDepartmentSales() {
        console.log("\033c");
        console.log("\nNOTE: These are only the departments with products listed in the system.\n\nIf you add a new department, a manager must add a product before the department can appear here.\n".white.bold.bgRed);

        // query to get the id, name, and overhead from the department table and the total sales by department from the product table
        let query = `
        SELECT 
          d.department_id, 
          d.department_name, 
          d.over_head_costs, 
          SUM(p.product_sales) AS total_sales 
        FROM departments d
        INNER JOIN products p 
          ON d.department_name = p.department_name
        GROUP BY d.department_name
        ORDER BY d.department_id`
        connection.query(query, function (err, res) {
            // create headings for table package and place that array in the table array
            data = [
                ["Department ID".bold, "Department Name".bold, "Overhead Costs".bold, "Product Sales".bold, "Total Profit".bold]
            ];

            // temporary array to hold each product's information
            let temp = [];

            // loop through each department result and push the temporary array into the table array
            for (let i = 0; i < res.length; i++) {
                temp = [res[i].department_id, res[i].department_name, "$" + res[i].over_head_costs.toFixed(2), "$" + res[i].total_sales.toFixed(2), "$" + (res[i].total_sales - res[i].over_head_costs).toFixed(2)];
                data.push(temp);
            }

            // set up configuration for table package
            config = {
                columns: {
                    0: {
                        alignment: 'left',
                        minWidth: 10
                    },
                    1: {
                        alignment: 'left',
                        minWidth: 10
                    },
                    2: {
                        alignment: 'left',
                        minWidth: 10
                    },
                    3: {
                        alignment: 'left',
                        minWidth: 10
                    },
                    4: {
                        alignment: 'right',
                        minWidth: 10
                    }
                },
                border: {
                    topBody: `─`,
                    topJoin: `┬`,
                    topLeft: `┌`,
                    topRight: `┐`,

                    bottomBody: `─`,
                    bottomJoin: `┴`,
                    bottomLeft: `└`,
                    bottomRight: `┘`,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: `─`,
                    joinLeft: `├`,
                    joinRight: `┤`,
                    joinJoin: `┼`
                }
            };

            // print the table
            output = table.table(data, config);

            console.log(output.white.bgBlue);

            // go back to the supervisor menu
            supervisorMenu();
        });
    }

    // function to add a new department
    function createNewDepartment() {
        console.log("\033c");
        inquirer.prompt([
            // take user input for department and overhead and validate input
            {
                name: "department",
                message: "Please enter the new department's name"
            },
            {
                name: "overhead",
                message: "Please enter the department's overhead costs (no dollar sign)",
                validate: function (value) {
                    let pass = value.match(
                        /^[+-]?[1-9][0-9]{0,2}(?:(,[0-9]{3})*|([0-9]{3})*)(?:\.[0-9]{2})?$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid cost (no dollar sign)';
                }
            }
        ]).then(function (answers) {
            // query database to see if user input for department already exists 
            connection.query(
                "SELECT * FROM departments WHERE department_name=?", answers.department, function (err, res) {
                    // if department name exists, send user back to supervisor menu
                    if (res.length) {
                        console.log("\nThat department already exists. Please create a new one.".white.bgRed);
                        console.log("\nPress any key to return to the menu");
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        process.stdin.once('data', function () {
                            console.log("\033c");
                            supervisorMenu();
                            process.exit.bind(process, 0);
                        });
                    } else {
                        // otherwise, add department to departments table
                        console.log("\nAdding a new department...");

                        // query database to add new department and overhead costs into table
                        let query = connection.query(
                            "INSERT INTO departments SET ?",
                            {
                                department_name: answers.department,
                                over_head_costs: answers.overhead
                            },
                            function (err, res) {
                                console.log("\nYou added the following department:\n");

                                // array to hold table package information. Displays the new department and overhead to the user
                                data = [
                                    ["Department".bold, "Overhead costs".bold],
                                    [answers.department, "$" + parseFloat(answers.overhead).toFixed(2)]
                                ];

                                // set up configuration for table package
                                config = {
                                    columns: {
                                        0: {
                                            alignment: 'left',
                                            minWidth: 10
                                        },
                                        1: {
                                            alignment: 'right',
                                            minWidth: 10
                                        }
                                    },
                                    border: {
                                        topBody: `─`,
                                        topJoin: `┬`,
                                        topLeft: `┌`,
                                        topRight: `┐`,

                                        bottomBody: `─`,
                                        bottomJoin: `┴`,
                                        bottomLeft: `└`,
                                        bottomRight: `┘`,

                                        bodyLeft: `│`,
                                        bodyRight: `│`,
                                        bodyJoin: `│`,

                                        joinBody: `─`,
                                        joinLeft: `├`,
                                        joinRight: `┤`,
                                        joinJoin: `┼`
                                    }
                                };

                                // print the table
                                output = table.table(data, config);

                                console.log(output.white.bgBlue);

                                // go back to the supervisor menu
                                supervisorMenu();

                            }
                        );
                    }
                }
            );
        });
    }

    // function to leave app
    function exitMenu() {
        console.log("\033c");
        connection.end();
    }
}

// export the file as a function to be accessed by the index
module.exports.bamazonSupervisor = bamazonSupervisor;