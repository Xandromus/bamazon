DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    `department_id` INTEGER(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `over_head_costs` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Automotive", 15000), ("Bedding", 4000), ("Dishes", 1000), ("Electronics", 20000), ("Footwear", 5000), ("Men's Clothing", 8000), ("Toys", 5000); 