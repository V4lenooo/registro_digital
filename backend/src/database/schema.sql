--mysql -u root -p registro_digital < database/schema.sql
SET NAMES utf8;
SET foreign_key_checks = 0;
DROP DATABASE IF EXISTS registro_digital;
CREATE DATABASE registro_digital;
USE registro_digital;

CREATE USER IF NOT EXISTS 'registro_digital'@'localhost' IDENTIFIED BY 'solo_yo_la_se';
GRANT SELECT, EXECUTE ON registro_digital.* TO 'registro_digital'@'localhost';

CREATE TABLE  users (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100)  NOT NULL,
  apellido          VARCHAR(100)  NOT NULL
  email             VARCHAR(150)  NOT NULL UNIQUE,
  carrera_id        INT UNSIGNED NOT NULL,
  contraseña_hash   VARCHAR(255)  NOT NULL,
  rol               ENUM('student','admin') NOT NULL DEFAULT 'student',
  creacion          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_act        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE SET NULL
);

CREATE TABLE carreras (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE  documents (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  materia     VARCHAR(100) NOT NULL,
  tipo        ENUM('parcial','guia','resumen','otro') NOT NULL DEFAULT 'otro',
  year        YEAR NOT NULL,
  file_path   VARCHAR(255) NOT NULL,
  file_size   INT UNSIGNED NOT NULL COMMENT 'Tamaño en bytes',
  creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_materia (materia),
  INDEX idx_tipo    (tipo),
  INDEX idx_year    (year)
);

CREATE TABLE content (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  descripcion TEXT         NOT NULL,
  category    ENUM('link','horario','fecha_importante','aviso','otro') NOT NULL,
  url         VARCHAR(500) NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category)
);

--insercion

  INSERT INTO carreras (nombre) VALUES 
    ('Ingenieria en alimentos'),
    ('Ingeniería en Computación'),
    ('Ingeniería Eléctrica'),
    ('Ingeniería Electromecánica'),
    ('Ingeniería Electrónica'),
    ('Ingeniería Industrial'),
    ('Ingeniería Informática'),
    ('Ingeniería en Materiales'),
    ('Ingeniería Mecánica'),
    ('Ingeniería Química ');
