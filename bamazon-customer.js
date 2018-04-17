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
    displayAllItems();
});

function displayAllItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log(" || " + res[i].product_name + " || Item #: " + res[i].item_id + " || Price: " + "$" + res[i].price.toFixed(2) + "\n");
        }
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
            message: "\nHow many would you like to purchase?",
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
        });
    });
}