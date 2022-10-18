-- migrate:up
create table books (
  id int not null auto_increment,
  title varchar(100) not null,
  description varchar(2000) null,
  cover_image varchar(1000) null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  primary key (id)
);

-- migrate:down
drop table books;
