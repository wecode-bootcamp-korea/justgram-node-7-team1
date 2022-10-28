-- migrate:up
CREATE TABLE posting_images (
        id INT NOT NULL AUTO_INCREMENT,
        posting_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (posting_id) REFERENCES postings(id)
);


-- migrate:down
DROP TABLE posting_images;
