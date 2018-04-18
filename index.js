let inquirer = require("inquirer");
let cmd = require('node-cmd');

function bamazonMenu() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "functions",
            message: "What is your role?",
            choices: [
                "Customer",
                "Manager",
                "Supervisor",
                "Exit menu"
            ]
        }
    ]).then(function (userChoice) {
        switch (userChoice.functions) {
            case "Customer":
                cmd.run('node bamazon-customer');
                break;
            case "Manager":
                cmd.run('node bamazon-manager');
                break;
            case "Supervisor":
                cmd.run('node bamazon-supervisor');
                break;
            case "Exit menu":
                return;
                break;
        }
    });
}

bamazonMenu();