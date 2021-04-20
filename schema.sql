DROP TABLE simpsons;
CREATE TABLE IF NOT EXISTS
simpsons(
  id SERIAL  NOT NULL,
  quote VARCHAR(256),
  character VARCHAR(256),
  image VARCHAR(256),
  characterDirection VARCHAR(256) 

);