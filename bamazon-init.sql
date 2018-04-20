DROP SCHEMA IF EXISTS bamazon;

CREATE SCHEMA `bamazon`;
USE bamazon;

CREATE TABLE `departments` (
    `department_id` INTEGER(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `over_head_costs` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);

CREATE INDEX department_name
ON departments (department_name);

CREATE TABLE `products`(
    `item_id` INTEGER(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `stock_quantity` INTEGER(10) UNSIGNED NOT NULL,
    `product_sales` DECIMAL(10,2) UNSIGNED NOT NULL,
    PRIMARY KEY(item_id),
    FOREIGN KEY(department_name) REFERENCES departments(department_name)
);