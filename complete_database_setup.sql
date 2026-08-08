-- Complete Database Setup for Route Rover
-- This script creates the database and all required tables

-- Create database
CREATE DATABASE IF NOT EXISTS user_auth;
USE user_auth;

-- Create register table for authentication (matches the model)
CREATE TABLE IF NOT EXISTS register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trains table
CREATE TABLE IF NOT EXISTS trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) NOT NULL UNIQUE,
    train_name VARCHAR(100) NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    monday BOOLEAN DEFAULT true,
    tuesday BOOLEAN DEFAULT true,
    wednesday BOOLEAN DEFAULT true,
    thursday BOOLEAN DEFAULT true,
    friday BOOLEAN DEFAULT true,
    saturday BOOLEAN DEFAULT true,
    sunday BOOLEAN DEFAULT true,
    first_ac INT DEFAULT 0,
    second_ac INT DEFAULT 0,
    third_ac INT DEFAULT 0,
    sleeper INT DEFAULT 0,
    general INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create passengerDetails table
CREATE TABLE IF NOT EXISTS passengerDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    trainNumber VARCHAR(20) NOT NULL,
    bookID VARCHAR(50) NOT NULL,
    pname VARCHAR(100) NOT NULL,
    page INT NOT NULL,
    pgender VARCHAR(10) NOT NULL,
    pclass VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookingFare table
CREATE TABLE IF NOT EXISTS bookingFare (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    bookID VARCHAR(50) NOT NULL UNIQUE,
    trainNumber VARCHAR(20) NOT NULL,
    seatsBooked INT NOT NULL,
    coach VARCHAR(20) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create userBooking table
CREATE TABLE IF NOT EXISTS userBooking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    bookID VARCHAR(50) NOT NULL UNIQUE,
    journeyDate DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vacancy table
CREATE TABLE IF NOT EXISTS vacancy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainNumber VARCHAR(20) NOT NULL UNIQUE,
    class1A INT DEFAULT 0,
    class2A INT DEFAULT 0,
    class3A INT DEFAULT 0,
    sleeper INT DEFAULT 0,
    general INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample train data
INSERT IGNORE INTO trains 
(train_number, train_name, origin, destination, departure_time, arrival_time, first_ac, second_ac, third_ac, sleeper, general) VALUES
('12301', 'Rajdhani Express', 'Delhi', 'Mumbai', '16:55:00', '08:30:00', 50, 100, 200, 500, 1000),
('12302', 'Rajdhani Express', 'Mumbai', 'Delhi', '16:55:00', '08:30:00', 50, 100, 200, 500, 1000),
('12309', 'Rajdhani Express', 'Delhi', 'Bangalore', '20:50:00', '06:00:00', 50, 100, 200, 500, 1000),
('12310', 'Rajdhani Express', 'Bangalore', 'Delhi', '20:50:00', '06:00:00', 50, 100, 200, 500, 1000),
('12951', 'Mumbai Rajdhani', 'Mumbai', 'Delhi', '17:00:00', '08:35:00', 50, 100, 200, 500, 1000),
('12952', 'Mumbai Rajdhani', 'Delhi', 'Mumbai', '16:40:00', '08:15:00', 50, 100, 200, 500, 1000),
('12953', 'Mumbai Rajdhani', 'Mumbai', 'Delhi', '17:15:00', '09:10:00', 50, 100, 200, 500, 1000),
('12954', 'Mumbai Rajdhani', 'Delhi', 'Mumbai', '16:40:00', '08:40:00', 50, 100, 200, 500, 1000),
('12213', 'Duronto Express', 'Mumbai', 'Delhi', '23:25:00', '16:40:00', 50, 100, 200, 500, 1000),
('12214', 'Duronto Express', 'Delhi', 'Mumbai', '23:25:00', '16:40:00', 50, 100, 200, 500, 1000);

-- Insert sample vacancy data
INSERT IGNORE INTO vacancy (trainNumber, class1A, class2A, class3A, sleeper, general) VALUES
('12301', 0, 0, 0, 0, 0),
('12302', 0, 0, 0, 0, 0),
('12309', 0, 0, 0, 0, 0),
('12310', 0, 0, 0, 0, 0),
('12951', 0, 0, 0, 0, 0),
('12952', 0, 0, 0, 0, 0),
('12953', 0, 0, 0, 0, 0),
('12954', 0, 0, 0, 0, 0),
('12213', 0, 0, 0, 0, 0),
('12214', 0, 0, 0, 0, 0);

-- Show success message
SELECT 'Database setup completed successfully!' as message;