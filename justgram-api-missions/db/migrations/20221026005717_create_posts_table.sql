-- migrate:up
CREATE TABLE posts (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(50) NOT NULL,
	content VARCHAR(1000) NOT NULL,
	user_id INT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);



-- migrate:down

