DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(30) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) DEFAULT 0,
  product_sales DECIMAL(16,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NULL,
  over_head_costs INT(10),
  PRIMARY KEY (department_id)
);