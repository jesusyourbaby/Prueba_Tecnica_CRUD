CREATE DATABASE prueba_tecnica_crud;

USE prueba_tecnica_crud;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (email, password) VALUES ('jesus123@example.com', '1234');