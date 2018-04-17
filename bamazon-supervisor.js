let mysql = require("mysql");
let inquirer = require("inquirer");

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

function exitMenu() {
    console.log("\033c");
    connection.end();
}