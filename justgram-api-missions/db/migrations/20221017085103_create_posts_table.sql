-- migrate:up
CREATE TABLE posts (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(50) NOT NULL,
	content VARCHAR(100) NOT NULL,
	PRIMARY KEY (id)
)

-- migrate:down

