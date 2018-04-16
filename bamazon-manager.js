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
    managerMenu();
});

function managerMenu() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "functions",
            message: "\nWhat would you like to do?",
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
    connection.query("SELECT * FROM products", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log("\n || " + res[i].product_name + " || Item #: " + res[i].item_id + " || Price: " + "$" + res[i].price.toFixed(2) + " || Quantity on hand: " + res[i].stock_quantity);
        }
        managerMenu();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<?", 5, function (err, res) {
        if (!res.length) {
            console.log("\nAll items are stocked at a quantity of 5 or more.");
        } else {
            for (let i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    console.log("\n || " + res[i].product_name + " || Item #: " + res[i].item_id + " || Price: " + "$" + res[i].price.toFixed(2) + " || Quantity on hand: " + res[i].stock_quantity);
                }
            }
        }
        managerMenu();
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "productName",
            message: "\nPlease enter the new product's name"
        },
        {
            name: "department",
            message: "\nPlease enter the new product's department"
        },
        {
            name: "price",
            message: "\nPlease enter the new product's price (no dollar sign)"
        },
        {
            name: "quantity",
            message: "\nPlease enter the new product's quantity on hand"
        }
    ]).then(function(answers) {
        console.log("\nAdding a new product...");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: answers.productName,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        },
        function (err, res) {
            console.log("\nYou added the following item:" + "\n || " + answers.productName + " || Department: " + answers.department + " || Price: " + "$" + answers.price + " || Quantity on hand: " + answers.quantity);
            managerMenu();
        }
    );
    });
}

function exitMenu() {
    connection.end();
}