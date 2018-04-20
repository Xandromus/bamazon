// file packaged as a function for export
function bamazonManager() {
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

    // variable flag for inventory management function
    let retry = false;

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

    // create connection to database and call manager menu
    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        managerMenu();
    });

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

    // manager menu
    function managerMenu() {
        inquirer.prompt([
            {
                type: "rawlist",
                name: "functions",
                message: "What would you like to do?",
                choices: [
                    "View products for sale",
                    "View low inventory",
                    "Add to inventory",
                    "Add new product",
                    "Back to role menu",
                    "Exit menu"
                ]
            }
        ]).then(function (userChoice) {
            // switch to call manager functions
            switch (userChoice.functions) {
                case "View products for sale":
                    displayAllItems();
                    break;
                case "View low inventory":
                    viewLowInventory();
                    break;
                case "Add to inventory":
                    addToInventory();
                    break;
                case "Add new product":
                    addNewProduct();
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

    // function to show all items available to purchase
    function displayAllItems() {
        console.log("\033c");
        // query database for all products in products table
        connection.query("SELECT * FROM products", function (err, res) {
            // create headings for table package and place that array in the table array
            data = [
                ["Item #".bold, "Product".bold, "Price".bold, "Quantity on hand".bold]
            ];

            // temporary array to hold each product's information
            let temp = [];

            // loop through each product and push the temporary array into the table array
            for (let i = 0; i < res.length; i++) {
                temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
                data.push(temp);
            }

            // print the table
            output = table.table(data, config);

            console.log(output.white.bgBlue);

            managerMenu();
        });
    }

    // function to display products with a quantity lower than 5
    function viewLowInventory() {
        console.log("\033c");
        // query database for all products with quantity less than 5
        connection.query("SELECT * FROM products WHERE stock_quantity<?", 5, function (err, res) {
            // if nothing is returned, alert user that all quantities are 5 or greater
            if (!res.length) {
                console.log("\nAll items are stocked at a quantity of 5 or more.\n");
            } else { // otherwise, print the items that have quantities lower than 5

                // create headings for table package and place that array in the table array
                data = [
                    ["Item #".bold, "Product".bold, "Price".bold, "Quantity on hand".bold]
                ];

                // temporary array to hold each product's information
                let temp = [];

                // loop through each product and push the temporary array into the table array
                for (let i = 0; i < res.length; i++) {
                    temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
                    data.push(temp);
                }

                // print the table
                output = table.table(data, config);

                console.log(output.white.bgBlue);
            }

            // return to manager menu in either case
            managerMenu();
        });
    }

    // function to increase inventory for a specific product
    function addToInventory() {
        console.log("\033c");

        // if user enters an invalid product id below, the function is called again with the retry flag set to true. User is prompted to try again
        if (retry) {
            console.log("Invalid product ID. Please choose again\n");
        }

        // retry flag is reset to false
        retry = false;

        // take user input for product to adjust and quantity to add. Validate input 
        inquirer.prompt([
            {
                name: "itemId",
                message: "Please enter the ID of the product you'd like to adjust",
                validate: answer => {
                    let pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a positive number greater than zero.";
                }
            },
            {
                name: "newQuantity",
                message: "Please enter the quantity you'd like to add",
                validate: answer => {
                    let pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a positive number greater than zero.";
                }
            }
        ]).then(function (newInput) {
            // query database for item with id matching user input
            let query = connection.query("SELECT * FROM products WHERE item_id=?", newInput.itemId, function (err, res) {

                // if no results are returned, set retry flag to true and send user back to re-enter input
                if (!res.length) {
                    retry = true;
                    addToInventory();
                } else { // otherwise, update the quantity on hand

                    // variable to hold the sum of existing quantity and user input
                    let newSum = parseInt(res[0].stock_quantity) + parseInt(newInput.newQuantity);

                    // query to update matching product with new quantity on hand
                    let query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newSum
                            },
                            {
                                item_id: newInput.itemId
                            }
                        ]
                    );

                    // print updated product quantity to user
                    console.log("\nYou added a quantity of " + newInput.newQuantity + " to update the item to the following:\n");

                    // array to hold table package information. Displays the product information with the new quantity on hand
                    data = [
                        ["Product".bold, "Department".bold, "Price".bold, "Quantity on hand".bold],
                        [res[0].product_name, res[0].department_name, "$" + res[0].price.toFixed(2), newSum]
                    ];

                    // print the table
                    output = table.table(data, config);

                    console.log(output.white.bgBlue);

                    // return to manager menu
                    managerMenu();
                }
            });
        });
    }

    // function to add new product to products table
    function addNewProduct() {
        console.log("\033c");

        // take user input for product information to add. Validate input 
        inquirer.prompt([
            {
                name: "productName",
                message: "Please enter the new product's name"
            },
            {
                name: "department",
                message: "Please enter the new product's department"
            },
            {
                name: "price",
                message: "Please enter the new product's price (no dollar sign)",
                validate: function (value) {
                    let pass = value.match(
                        /^[+-]?[1-9][0-9]{0,2}(?:(,[0-9]{3})*|([0-9]{3})*)(?:\.[0-9]{2})?$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid price (no dollar sign)';
                }
            },
            {
                name: "quantity",
                message: "Please enter the new product's quantity on hand",
                validate: answer => {
                    let pass = answer.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a positive number greater than zero.";
                }
            }
        ]).then(function (answers) {

            // query database to see if department name user input exists in the departments table
            connection.query(
                "SELECT * FROM departments WHERE department_name=?", answers.department, function (err, res) {

                    // if the department hasn't been added by a supervisor, let user know that they can't add an item with a department that doesn't exist. Send user back to to manager menu
                    if (!res.length) {
                        console.log("\nThat department doesn't exist yet. Either add an item to an existing department or have a supervisor create a new department.".white.bgRed);
                        console.log("\nPress any key to return to the menu");
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        process.stdin.once('data', function () {
                            console.log("\033c");
                            managerMenu();
                            process.exit.bind(process, 0);
                        });
                    } else { // otherwise, add the new product to the products database
                        console.log("\nAdding a new product...");

                        // query database to add new product information
                        let query = connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: answers.productName,
                                department_name: answers.department,
                                price: answers.price,
                                stock_quantity: answers.quantity,
                                product_sales: 0
                            },
                            function (err, res) {

                                // print the new product information to the user
                                console.log("\nYou added the following item:\n");

                                // array to hold table package information. Displays the purchased item and sales total to the user
                                data = [
                                    ["Product".bold, "Department".bold, "Price".bold, "Quantity on hand".bold],
                                    [answers.productName, answers.department, "$" + parseFloat(answers.price).toFixed(2), answers.quantity]
                                ];

                                // print table
                                output = table.table(data, config);

                                console.log(output.white.bgBlue);

                                // return to manager menu
                                managerMenu();
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
module.exports.bamazonManager = bamazonManager;