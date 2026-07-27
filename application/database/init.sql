CREATE DATABASE IF NOT EXISTS shopdb;

USE shopdb;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (name, price) VALUES
('Laptop',65000),
('Keyboard',2500),
('Mouse',1200),
('Monitor',18000),
('Headphones',3500);
