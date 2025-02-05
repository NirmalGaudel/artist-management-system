CREATE DATABASE IF NOT EXISTS artist_management_system;
USE artist_management_system;

-- User Table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,  -- Hashed password
    phone VARCHAR(20),
    gender ENUM('m', 'f', 'o'),
    address VARCHAR(255),
    role ENUM('super_admin', 'artist_manager', 'artist') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Artist Table
CREATE TABLE artist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    dob DATETIME,
    gender ENUM('m', 'f', 'o'),
    address VARCHAR(255),
    first_release_year YEAR,
    no_of_albums_released INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Music Table
CREATE TABLE music (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre ENUM('rnb', 'country', 'classic', 'rock', 'jazz'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE
);