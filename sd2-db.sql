-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2022 at 09:54 AM
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

-- Drop tables if they exist to prevent conflicts
DROP TABLE IF EXISTS Libraries;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS User_Genres;
DROP TABLE IF EXISTS Book_Genres;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS test_table;
--
-- Table structure for table `test_table`
--

CREATE TABLE `test_table` (
  `id` int NOT NULL,
  `name` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `test_table`
--

INSERT INTO `test_table` (`id`, `name`) VALUES
(1, 'Lisa'),
(2, 'Kimia');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `test_table`
--
ALTER TABLE `test_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/*-----INSERT DATABASE STRUCTURE FOR SHELFT PROJECT-----*/
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    profile_img VARCHAR(255),
    discovery_frequency ENUM('1', '2', '3'),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INT,
    summary TEXT,
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Libraries (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NULL,
    review_content TEXT,
    user_read_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
);

CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE User_Genres (
    user_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE Book_Genres (
    book_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

-- Insert into Users table
-- Defautl password: shelf_2025
INSERT INTO Users (first_name, last_name, email, password_hash, username, profile_img, discovery_frequency, verified)
VALUES
('An', 'Nguyen', 'nguyenvanan2730@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'nguyenvanan', 'profile1.jpg', '1', TRUE),
('Bob', 'Smith', 'perette93@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'bobsmith', 'profile2.jpg', '2', TRUE),
('Charlie', 'Brown', 'shelf1@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'charlieb', 'profile3.jpg', '3', TRUE),
('David', 'Miller', 'shelf2@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'davidm', 'profile4.jpg', '1', TRUE),
('Emma', 'Davis', 'shelf3@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'emmad', 'profile5.jpg', '2', TRUE),
('Frank', 'Wilson', 'shelf4@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'frankw', 'profile6.jpg', '3', TRUE),
('Grace', 'Moore', 'shelf5@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'gracem', 'profile7.jpg', '1', TRUE),
('Henry', 'Taylor', 'shelf6@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'henryt', 'profile8.jpg', '2', TRUE),
('Ivy', 'Anderson', 'shelf7@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'ivya', 'profile9.jpg', '3', TRUE),
('Jack', 'Thomas', 'shelf8@gmail.com', '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye', 'jackt', 'profile10.jpg', '1', TRUE);

-- Insert into Books table
INSERT INTO Books (title, author, published_year, summary, cover_image)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'A novel about the American dream.', 'cover1.jpg'),
('1984', 'George Orwell', 1949, 'A dystopian novel about totalitarianism.', 'cover2.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 1960, 'A story about racial injustice in the South.', 'cover3.jpg'),
('Moby Dick', 'Herman Melville', 1851, 'The pursuit of a great white whale.', 'cover4.jpg'),
('Pride and Prejudice', 'Jane Austen', 1813, 'A classic romantic novel.', 'cover5.jpg'),
('The Catcher in the Rye', 'J.D. Salinger', 1951, 'A story of teenage angst and rebellion.', 'cover6.jpg'),
('Brave New World', 'Aldous Huxley', 1932, 'A dystopian society controlled by technology.', 'cover7.jpg'),
('The Hobbit', 'J.R.R. Tolkien', 1937, 'A fantasy adventure about a hobbit.', 'cover8.jpg'),
('War and Peace', 'Leo Tolstoy', 1869, 'A novel about the Napoleonic wars.', 'cover9.jpg'),
('The Odyssey', 'Homer', -700, 'An epic Greek poem about Odysseus.', 'cover10.jpg');

-- Insert into Libraries table (Each user has between 4 to 8 books)
INSERT INTO Libraries (user_id, book_id)
VALUES
-- User 1 (5 books)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
-- User 2 (6 books)
(2, 1), (2, 2), (2, 6), (2, 7), (2, 8), (2, 9),
-- User 3 (4 books)
(3, 3), (3, 5), (3, 7), (3, 9),
-- User 4 (7 books)
(4, 1), (4, 2), (4, 4), (4, 6), (4, 8), (4, 9), (4, 10),
-- User 5 (5 books)
(5, 3), (5, 5), (5, 6), (5, 7), (5, 10),
-- User 6 (6 books)
(6, 1), (6, 4), (6, 5), (6, 6), (6, 8), (6, 10),
-- User 7 (8 books)
(7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7), (7, 8), (7, 9),
-- User 8 (4 books)
(8, 1), (8, 2), (8, 3), (8, 10),
-- User 9 (5 books)
(9, 4), (9, 5), (9, 6), (9, 7), (9, 8),
-- User 10 (6 books)
(10, 2), (10, 3), (10, 4), (10, 5), (10, 6), (10, 9);


-- Insert into Reviews table
INSERT INTO Reviews (user_id, book_id, rating, review_content, user_read_date)
VALUES
(1, 1, 5, 'A masterpiece!', '2023-01-10'),
(2, 2, 4, 'A thought-provoking book.', '2023-02-15'),
(3, 3, 5, 'A must-read!', '2023-03-20'),
(4, 4, 3, 'A bit lengthy but interesting.', '2023-04-25'),
(5, 5, 4, 'A timeless classic.', '2023-05-30'),
(6, 6, 3, 'Did not connect with the main character.', '2023-06-05'),
(7, 7, 5, 'A great look at futuristic societies.', '2023-07-10'),
(8, 8, 5, 'A thrilling adventure.', '2023-08-15'),
(9, 9, 4, 'An epic tale.', '2023-09-20'),
(10, 10, 5, 'A legendary journey.', '2023-10-25'),
(1, 2, 2, 'Overrated, did not enjoy.', '2023-11-01'),
(2, 3, 1, 'Really boring, could not finish.', '2023-11-10'),
(3, 4, 2, 'Interesting concept, poor execution.', '2023-11-15'),
(4, 5, 3, 'Decent but forgettable.', '2023-11-20'),
(5, 6, 1, 'One of the worst books I have read.', '2023-11-25'),
(6, 7, 4, 'Good but not amazing.', '2023-12-01'),
(7, 8, 5, 'Absolutely brilliant, highly recommend!', '2023-12-05'),
(8, 9, 2, 'Too complicated and slow.', '2023-12-10'),
(9, 10, 1, 'A painful read, not my style.', '2023-12-15'),
(10, 1, 3, 'Had some good parts but lacked depth.', '2023-12-20');

-- Insert into Genres table following the given order
INSERT INTO Genres (name)
VALUES
('Anime'),
('Biography'),
('Comedy'),
('Fantasy'),
('Horror'),
('Mystery'),
('Romance'),
('Sci-Fi'),
('Health/Wellness');

-- Insert into User_Genres table (Each user has between 4 to 8 genres)
INSERT INTO User_Genres (user_id, genre_id)
VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 2), (2, 5), (2, 6), (2, 7), (2, 8),
(3, 3), (3, 6), (3, 7), (3, 8), (3, 9),
(4, 1), (4, 4), (4, 5), (4, 6), (4, 9),
(5, 2), (5, 3), (5, 5), (5, 7), (5, 8),
(6, 1), (6, 3), (6, 4), (6, 6), (6, 9),
(7, 2), (7, 5), (7, 7), (7, 8), (7, 9),
(8, 1), (8, 4), (8, 6), (8, 7), (8, 8),
(9, 3), (9, 5), (9, 6), (9, 7), (9, 9),
(10, 1), (10, 2), (10, 4), (10, 5), (10, 7), (10, 8);

-- Insert into Book_Genres table (Each book belongs to multiple genres)
INSERT INTO Book_Genres (book_id, genre_id)
VALUES
(1, 1), (1, 2), (1, 5),
(2, 2), (2, 3), (2, 6),
(3, 3), (3, 7), (3, 8),
(4, 1), (4, 4), (4, 6), (4, 7),
(5, 2), (5, 5), (5, 9),
(6, 1), (6, 3), (6, 4), (6, 8),
(7, 2), (7, 6), (7, 7), (7, 9),
(8, 1), (8, 4), (8, 5), (8, 8),
(9, 3), (9, 5), (9, 6), (9, 7),
(10, 1), (10, 2), (10, 4), (10, 8);