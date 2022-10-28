-- migrate:up
CREATE TABLE postings (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        content VARCHAR(2000) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- migrate:down
DROP TABLE posts;

