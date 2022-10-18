-- migrate:up
create table authors (
 id int nit null auto_increment,
 first_name varchar(100) not null,
 last_name varchar(100) not null,
 age int null,
 created_at timestamp not null default current_timestamp,
 upadted_at timestamp not null default current_timestamp on update current_timestamp,
 primary key (id));
-- migrate:down
drop table authors;
