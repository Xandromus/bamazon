let inquirer = require("inquirer");
let Customer = require("./bamazon-customer.js");
let Manager = require("./bamazon-manager.js");
let Supervisor = require("./bamazon-supervisor.js");

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
                Customer.bamazonCustomer();
                break;
            case "Manager":
                Manager.bamazonManager();
                break;
            case "Supervisor":
                Supervisor.bamazonSupervisor();
                break;
            case "Exit menu":
                return;
                break;
        }
    });
}

bamazonMenu();