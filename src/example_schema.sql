-- pg_ctl -s -D /usr/local/var/postgres start
-- createdb sqlaas_example
-- psql -qd sqlaas_example -a -f src/example_schema.sql
CREATE TABLE employees (
   id SERIAL UNIQUE NOT NULL PRIMARY KEY
  ,title TEXT NOT NULL
  ,name TEXT NOT NULL
  ,salary INTEGER
  ,start_date DATE NOT NULL
);
INSERT INTO employees VALUES
 (1, 'Developer', 'Richard Hendricks', 200000, '2017-07-25')
,(2, 'Head of Business Development', 'Jared Dunn', 300000, '2017-07-25')
,(3, 'Software Designer', 'Nelson Bighetti', 6000000, '2017-07-25')
;
