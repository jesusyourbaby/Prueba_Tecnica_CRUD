CREATE DATABASE prueba_tecnica_crud;

USE prueba_tecnica_crud;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    fecha_vencimiento DATE DEFAULT NULL,
    estado ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
    creado_por VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO usuarios (email, password) VALUES ('jesus123@example.com', '1234');