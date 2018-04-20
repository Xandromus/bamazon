// file packaged as a function for export
function bamazonCustomer() {
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

    // create connection to database and call customer menu
    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        customerMenu();
    });

    // customer menu
    function customerMenu() {
        console.log("\033c");
        inquirer.prompt([
            {
                type: "rawlist",
                name: "functions",
                message: "What would you like to do?",
                choices: [
                    "View products for sale",
                    "Make a purchase",
                    "Back to role menu",
                    "Exit menu"
                ]
            }
        ]).then(function (userChoice) {
            // switch to call customer functions
            switch (userChoice.functions) {
                case "View products for sale":
                    displayAllItems();
                    break;
                case "Make a purchase":
                    purchaseItem();
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
                ["Item #".bold, "Product".bold, "Price".bold]
            ];

            // temporary array to hold each product's information
            let temp = [];

            // loop through each product and push the temporary array into the table array
            for (let i = 0; i < res.length; i++) {
                temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2)];
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

            console.log("\nPress any key to return to the menu");

            // wait until the user presses any key before returning to the customer menu
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.once('data', function () {
                customerMenu();
                process.exit.bind(process, 0);
            });
        });
    }

    // function for user to purchase item
    function purchaseItem() {
        inquirer.prompt([
            // take user input for id and quantity and validate input
            {
                name: "productId",
                message: "Please enter the ID of the product you'd like to purchase",
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
                name: "quantity",
                message: "How many would you like to purchase?",
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
        ]).then(function (input) {
            // query database for item with id matching user input
            let query = connection.query("SELECT * FROM products WHERE item_id=?", input.productId, function (err, res) {

                // if no results are returned, send user back to re-enter input
                if (!res.length) {
                    console.log("\nInvalid product ID. Please choose again\n");
                    purchaseItem();
                } else {
                    // otherwise, check to see if the user's input for quantity exceeds the qunatity in stock
                    if (input.quantity > res[0].stock_quantity) {

                        // if the user quantity exceeds the quantity on hand, print how many they can purchase and send user back to re-enter input
                        console.log("We don't have that many in stock. You can order up to " + res[0].stock_quantity);
                        purchaseItem();
                    } else { // otherwise, decrease the quantity and increase the total sales for that product

                        // variable to hold the total sales amount for the user's transaction
                        let salesTotal = (input.quantity * res[0].price).toFixed(2)

                        // query to update the product's quantity and total sales
                        let query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: res[0].stock_quantity - input.quantity,
                                    product_sales: parseFloat(res[0].product_sales) + parseFloat(salesTotal)
                                },
                                {
                                    item_id: input.productId
                                }
                            ]
                        );

                        // array to hold table package information. Displays the purchased item and sales total to the user
                        data = [
                            ["Product".bold, "Price".bold, "Quantity".bold, "Total".bold],
                            [res[0].product_name, "$" + res[0].price.toFixed(2), input.quantity, "$" + salesTotal]
                        ];

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

                        console.log("\nYou bought the following:\n");

                        // print the table
                        output = table.table(data, config);

                        console.log(output.white.bgBlue);

                        // wait until the user presses any key before returning to the customer menu
                        console.log("\nPress any key to return to the menu");
                        process.stdin.setRawMode(true);
                        process.stdin.resume();
                        process.stdin.once('data', function () {
                            customerMenu();
                            process.exit.bind(process, 0);
                        });
                    }
                }
            });
        });
    }

    // function to leave app
    function exitMenu() {
        console.log("\033c");
        connection.end();
    }
}

// export the file as a function to be accessed by the index
module.exports.bamazonCustomer = bamazonCustomer;