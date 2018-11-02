DROP DATABASE IF EXISTS bamazon;
CREATe DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(30) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) DEFAULT 0,
  primary key (item_id)
);