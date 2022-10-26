-- migrate:up
CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	description VARCHAR(100) NOT NULL,
	price DECIMAL NULL,
	PRIMARY KEY(id)
);

CREATE TABLE product_images (
	id INT NOT NULL AUTO_INCREMENT,
	url VARCHAR(50) NOT NULL,
	product_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE charges (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	price DECIMAL,
	PRIMARY KEY(id)
);

CREATE TABLE product_charges (
	id INT NOT NULL AUTO_INCREMENT,
	product_id INT NOT NULL,
	charge_id INT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (product_id) REFERENCES products(id),
	FOREIGN KEY (charge_id) REFERENCES charges(id)
);

INSERT INTO products(
	name, description, price
) VALUES (
	'product 1', 'product 1 good', '1000'
),(
	'product 2', 'product 2 good', '2000'
),(
	'product 3', 'product 3 good', '3000'
);

INSERT INTO product_images(
  url, product_id	
) VALUES (
	'url 1', 1
),(
	'url 2', 1
),(
	'url 3', 2
);

INSERT INTO charges (
	name, price
) VALUES (
	'배송비', 2500
), (
	'포장비', 500
);

INSERT INTO product_charges (
	product_id, charge_id
) VALUES (
	1, 1
),(
	1, 2
),(
	2, 1
),(
	2, 2
);

-- migrate:down

