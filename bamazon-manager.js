let mysql = require("mysql");
let inquirer = require("inquirer");
let colors = require('colors');
let table = require("table");

let config,
    data,
    output;

let retry = false;

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
    managerMenu();
});

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
                "Exit menu"
            ]
        }
    ]).then(function (userChoice) {
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
            case "Exit menu":
                exitMenu();
                break;
        }
    });
}

function displayAllItems() {
    console.log("\033c");
    connection.query("SELECT * FROM products", function (err, res) {
        data = [
            ["Item #", "Product", "Price", "Quantity on hand"]
        ];
        let temp = [];
        for (let i = 0; i < res.length; i++) {
            temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
            data.push(temp);
        }

        

        output = table.table(data, config);
 
        console.log(output.white.bgBlue);

        managerMenu();
    });
}

function viewLowInventory() {
    console.log("\033c");
    connection.query("SELECT * FROM products WHERE stock_quantity<?", 5, function (err, res) {
        if (!res.length) {
            console.log("\nAll items are stocked at a quantity of 5 or more.\n");
        } else {
            data = [
                ["Item #", "Product", "Price", "Quantity on hand"]
            ];
            let temp = [];
            for (let i = 0; i < res.length; i++) {
                temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
                data.push(temp);
            }

            
            output = table.table(data, config);
 
        console.log(output.white.bgBlue);
        }
        managerMenu();
    });
}

function addToInventory() {
    console.log("\033c");
    if (retry) {
        console.log("Invalid product ID. Please choose again\n");
    }
    retry = false;
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
        let query = connection.query("SELECT * FROM products WHERE item_id=?", newInput.itemId, function (err, res) {
            if (!res.length) {
                retry = true;
                addToInventory();
            } else {
                let newSum = parseInt(res[0].stock_quantity) + parseInt(newInput.newQuantity);
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
                console.log("\nYou added a quantity of " + newInput.newQuantity + " to update the item to the following:\n");
                data = [
                    ["Product", "Department", "Price", "Quantity on hand"],
                    [res[0].product_name, res[0].department_name, "$" + res[0].price.toFixed(2), newSum]
                ];

                output = table.table(data, config);
     
                console.log(output.white.bgBlue);

                managerMenu();
            }
        });
    });
}

function addNewProduct() {
    console.log("\033c");
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
        console.log("\nAdding a new product...");
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
                console.log(err);
                console.log("\nYou added the following item:\n");
                
                data = [
                    ["Product", "Department", "Price", "Quantity on hand"],
                    [answers.productName, answers.department, "$" + parseFloat(answers.price).toFixed(2), answers.quantity]
                ];

                output = table.table(data, config);
     
                console.log(output.white.bgBlue);
                
                managerMenu();
            }
        );
    });
}

function exitMenu() {
    console.log("\033c");
    connection.end();
}