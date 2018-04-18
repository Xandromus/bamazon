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
    password: "RoseWhale53",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\033c");
    displayAllItems();
});

function displayAllItems() {
    console.log("\033c");
    connection.query("SELECT * FROM products", function (err, res) {
        data = [
            ["Item #".bold, "Product".bold, "Price".bold]
        ];
        let temp = [];
        for (let i = 0; i < res.length; i++) {
            temp = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2)];
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

        purchaseItem();
    });
}

function purchaseItem() {
    inquirer.prompt([
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
        let query = connection.query("SELECT * FROM products WHERE item_id=?", input.productId, function (err, res) {
            if (!res.length) {
                console.log("\nInvalid product ID. Please choose again\n");
                purchaseItem();
            } else {
                if (input.quantity > res[0].stock_quantity) {
                    console.log("We don't have that many in stock. You can order up to " + res[0].stock_quantity);
                    purchaseItem();
                } else {
                    let salesTotal = (input.quantity * res[0].price).toFixed(2)
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
                    console.log("\nThe total cost for your purchase is $" + salesTotal);
                    connection.end();
                }
            }
        });
    });
}