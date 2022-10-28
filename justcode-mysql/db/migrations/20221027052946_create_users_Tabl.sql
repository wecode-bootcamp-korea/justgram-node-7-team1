-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NULL,
    password VARCHAR(3000) NOT NULL,
    profile_image VARCHAR(3000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
-- migrate:down
DROP TABLE users;

