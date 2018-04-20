// variable declarations for required packages and imported files/functions
let inquirer = require("inquirer");
let figlet = require("figlet");
let colors = require('colors');
let Customer = require("./bamazon-customer.js");
let Manager = require("./bamazon-manager.js");
let Supervisor = require("./bamazon-supervisor.js");

// main menu for Bamazon
function bamazonMenu() {
    console.log("\033c");
    console.log(
        figlet.textSync("BAMAZON", { font: "Isometric3", horizontalLayout: "full" }).cyan.bold
    );
    console.log("\n Welcome to Bamazon!\n");
    // prompt for various roles
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
        // switch to call the various files/functions depending on user input
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
                console.log("\033c");
                return;
                break;
        }
    });
}

// initial call for the main menu
bamazonMenu();

// export the main menu so that other pages can come back to it
module.exports.bamazonMenu = bamazonMenu;