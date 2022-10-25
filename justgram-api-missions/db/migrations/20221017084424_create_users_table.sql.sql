-- migrate:up
CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(100) NOT NULL,
	name VARCHAR(50) NULL,
	PRIMARY KEY(id)
);

-- migrate:down