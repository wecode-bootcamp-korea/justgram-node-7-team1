-- migrate:up
create table books_authors (
  id int not null auto_increment,
  book_id int not null,
  author_id int not null,
  primary key (id),
  constraint book_authors_book_id_fkey foreign key (book_id) references books(id),
  constraint book_authors_author_id_fkey foreign key (author_id) references authors(id)
);

-- migrate:down
DROP TABLE books_authors;
