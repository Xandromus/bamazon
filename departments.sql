DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    `department_id` INTEGER(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `over_head_costs` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);