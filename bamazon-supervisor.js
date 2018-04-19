function bamazonSupervisor() {
    require("dotenv").config();
    let mysql = require("mysql");
    let inquirer = require("inquirer");
    let colors = require('colors');
    let table = require("table");

    let config,
        data,
        output;

    let connection = mysql.createConnection({
        host: "localhost",
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: process.env.MYSQLPASSWORD,
        database: "bamazon"
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        supervisorMenu();
    });

    function supervisorMenu() {
        inquirer.prompt([
            {
                type: "rawlist",
                name: "functions",
                message: "What would you like to do?",
                choices: [
                    "View product sales by department",
                    "Create new department",
                    "Exit menu"
                ]
            }
        ]).then(function (userChoice) {
            switch (userChoice.functions) {
                case "View product sales by department":
                    viewDepartmentSales();
                    break;
                case "Create new department":
                    createNewDepartment();
                    break;
                case "Exit menu":
                    exitMenu();
                    break;
            }
        });
    }

    function viewDepartmentSales() {
        console.log("\033c");
        console.log("\nNOTE: These are only the departments with products listed in the system.\n\nIf you add a new department, a manager must add a product before the department can appear here.\n".white.bold.bgRed);
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
            data = [
                ["Department ID".bold, "Department Name".bold, "Overhead Costs".bold, "Product Sales".bold, "Total Profit".bold]
            ];
            let temp = [];
            for (let i = 0; i < res.length; i++) {
                temp = [res[i].department_id, res[i].department_name, "$" + res[i].over_head_costs.toFixed(2), "$" + res[i].total_sales.toFixed(2), "$" + (res[i].total_sales - res[i].over_head_costs).toFixed(2)];
                data.push(temp);
            }

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

            output = table.table(data, config);

            console.log(output.white.bgBlue);
            supervisorMenu();
        });
    }

    function createNewDepartment() {
        console.log("\033c");
        inquirer.prompt([
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
            console.log("\nAdding a new department...");
            let query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answers.department,
                    over_head_costs: answers.overhead
                },
                function (err, res) {
                    console.log("\nYou added the following department:\n");

                    data = [
                        ["Department".bold, "Overhead costs".bold],
                        [answers.department, "$" + parseFloat(answers.overhead).toFixed(2)]
                    ];

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

                    output = table.table(data, config);

                    console.log(output.white.bgBlue);

                    supervisorMenu();
                }
            );
        });
    }

    function exitMenu() {
        console.log("\033c");
        connection.end();
    }
}

module.exports.bamazonSupervisor = bamazonSupervisor;