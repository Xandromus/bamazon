# Bamazon

![Bamazon](https://xandromus.github.io/responsive-portfolio/assets/images/train.png)

Bamazon is a command line node app that emulates an online store, complete with access to a real-time database. The app offers users 3 roles: customer, manager, and supervisor.

Watch the [demo](https://youtu.be/-_SNU-92yug)


## Description

Bamazon accesses 2 tables within the database: departments and products. Users are prompted to select one of 3 roles, with the options for each listed below.

### Customer

Customers have 4 options:

1. View all products available to purchase, including the product id, product name, and price.

2. Purchase a product by entering the product id and quantity desired. The quantity and total sales for this product are then updated in the products database, and the purchased item's information is printed to the screen, including product name, price, quantity purchased, and total cost of the purchase.

3. Return to role menu.

4. Exit the app.

### Manager

Managers have 6 options:

1. View all products available to purchase, including the product id, product name, price, and quantity on hand.

2. View products with an inventory lower than 5, printing the product id, product name, price, and quantity on hand. Users are notified if all items have a quantity of 5 or more, and no results are printed.

3. Increase the inventory of a product. The user is prompted for the product id and quantity to add. The product's information, including product name, department, price, and updated quantity are printed.

4. Add a new product to the site. The user is prompted for the product's name, department, price, and quantity on hand. The department must be in the departments database for an item to be added successfully. If the department does not exist, the user is prompted to have a supervisor add the department. Upon the successful addition of the new product, the product name, department, price, and quantity on hand are printed.

5. Return to role menu.

6. Exit the app.

### Supervisor

Supervisors have 4 options:

1. View product sales by department. Each department is printed to the screen with its id, name, overhead costs, and aggregate department sales. The total profit for the department is calculated on the fly by subtracting the overhead costs from the product sales. Only departments with products built by the manager will print.

2. Add a new department to the database. The user is prompted for the department name and overhead costs. Again, the newly added department will not display in the option to view product sales by department until at least one product with that department has been added by a manager.

3. Return to role menu.

4. Exit the app.


## Setup and Usage

Bamazon can be run using the index.js file, which then accesses the files containing the customer, manager, and supervisor applications. Init and seed files are included for the creation of the Bamazon database. Users should create their own .env file containing the database password.


## Concepts Used

- MySQL database queries
- Node require and module exports


## Future Development

This command line app serves as an online store emulator, so most future development would involve adding some of the other functions of an online store:

1. A shopping cart to hold added products as the customer shops

2. The ability to remove products from the cart

3. The ability to purchase everything in the cart (purchase multiple product types with quantities at once)

4. The calculation of taxes and shipping costs

5. Search functionality for product name and department

6. Negative adjustments to inventory

7. Removing products from the store

8. Displaying sales totals for individual departments based on user search

9. Removing departments for the department database

10. Additional validation


## Node Packages Used

- inquirer
- mysql
- table
- figlet
- colors
- dotenv


## Authors

- **Xander Rapstine** - [Xander Rapstine](https://github.com/Xandromus)