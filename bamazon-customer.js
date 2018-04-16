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
    console.log("connected as id " + connection.threadId);
    displayAllItems();
});

function displayAllItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log("\n || " + res[i].product_name + " || Item #: " + res[i].item_id + " || Price: " + "$" + res[i].price.toFixed(2));
        }
        purchaseItem();
    });
}

function purchaseItem() {
    inquirer.prompt([
        {
            name: "productId",
            message: "\nPlease enter the ID of the product you'd like to purchase"
        },
        {
            name: "quantity",
            message: "\nHow many would you like to purchase?"
        }
    ]).then(function (input) {
        let query = connection.query("SELECT * FROM products WHERE item_id=?", input.productId, function (err, res) {
            if (input.quantity > res[0].stock_quantity) {
                console.log("Insufficient quantity!");
            } else {
                let query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity - input.quantity
                        },
                        {
                            item_id: input.productId
                        }
                    ]
                );
                console.log("\nThe total cost for your purchase is $" + (input.quantity * res[0].price).toFixed(2));
                connection.end();
            }
        });
    });
}