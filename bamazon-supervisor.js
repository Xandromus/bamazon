let mysql = require("mysql");
let inquirer = require("inquirer");
let table = require("table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "RoseWhale53",
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
        connection.query(query, function(err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log("|| " + res[i].department_id + " || " + res[i].department_name + " || $" + res[i].over_head_costs.toFixed(2) + " || $" + res[i].total_sales.toFixed(2) + " || $" + (res[i].total_sales - res[i].over_head_costs).toFixed(2) + "\n");
        }
        supervisorMenu();
    });
}

function exitMenu() {
    console.log("\033c");
    connection.end();
}