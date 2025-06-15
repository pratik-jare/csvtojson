
# csvtojson

create table on the postgres db 


CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INT NOT NULL,
  address JSONB,
  additional_info JSONB
);

and then connect using .env file setup creds and details.