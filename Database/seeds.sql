USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Laptop', 'Electronics', 1299.99, 145),
       ('Cell Phone', 'Electronics', 699.99, 100),
       ('USB Charger', 'Electronics', 19.99, 200),
       ('T-Shirt', 'Apparel', 19.99, 1000),
       ('Pants', 'Apparel', 34.50, 495),
       ('Socks', 'Apparel', 8.99, 600),
       ('Sofa Cover', 'Furniture', 45.00, 200),
       ('Lampshade', 'Furniture', 20.00, 150),
       ('Towel Rack', 'Furniture', 25.00, 200),
       ('Soccer Ball', 'Sporting Goods', 40.99, 300),
       ('Lacrosse Stick', 'Sporting Goods', 67.50, 400),
       ('Roller Blades', 'Sporting Goods', 150.00, 200),
       ('Stapler', 'Home & Office', 18.99, 650),
       ('Printer Paper', 'Home & Office', 40.00, 700),
       ('Pens', 'Home & Office', 12.50, 300);

USE bamazon;

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Apparel', 50000),
       ('Arts & Crafts', 10000),
       ('Automotive', 30000),
       ('Baby', 10000),
       ('Electronics', 50000),
       ('Food', 50000),
       ('Furniture', 20000),
       ('Health & Beauty', 15000),
       ('Home & Office', 20000),
       ('Jewelry', 50000),
       ('Pet', 10000),
       ('Seasonal', 5000),
       ('Sporting Goods', 7500),
       ('Tools', 10000),
       ('Toys & Games', 30000),
       ('Everything Else', 10000);