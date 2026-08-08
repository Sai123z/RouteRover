-- Step 1: Create passengerDetails table
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

-- Step 2: Create bookingFare table
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

-- Step 3: Create userBooking table
CREATE TABLE IF NOT EXISTS userBooking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    bookID VARCHAR(50) NOT NULL UNIQUE,
    journeyDate DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create vacancy table (optional - for seat availability tracking)
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

-- Step 5: Insert sample vacancy data for existing trains (optional)
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

