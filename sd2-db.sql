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

-- Database: `sd2-db`

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

-- Table structure for table `test_table`
CREATE TABLE `test_table` (
  `id` int NOT NULL,
  `name` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `test_table`
INSERT INTO `test_table` (`id`, `name`) VALUES
(1, 'Lisa'),
(2, 'Kimia');

-- Indexes for dumped tables
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT for dumped tables
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
    published_year TIMESTAMP,
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



-- Insert into Libraries table ensuring each user has between 5 and 25 books
INSERT INTO Libraries (user_id, book_id) VALUES
    -- User 1 (5 books)
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    -- User 2 (6 books)
    (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11),
    -- User 3 (7 books)
    (3, 12), (3, 13), (3, 14), (3, 15), (3, 16), (3, 17), (3, 18),
    -- User 4 (8 books)
    (4, 19), (4, 20), (4, 21), (4, 22), (4, 23), (4, 24), (4, 25), (4, 26),
    -- User 5 (9 books)
    (5, 27), (5, 28), (5, 29), (5, 30), (5, 31), (5, 32), (5, 33), (5, 34), (5, 35),
    -- User 6 (10 books)
    (6, 36), (6, 37), (6, 38), (6, 39), (6, 40), (6, 41), (6, 42), (6, 43), (6, 44), (6, 45),
    -- User 7 (11 books)
    (7, 46), (7, 47), (7, 48), (7, 49), (7, 50), (7, 51), (7, 52), (7, 53), (7, 54), (7, 1), (7, 2),
    -- User 8 (5 books)
    (8, 3), (8, 4), (8, 5), (8, 6), (8, 7),
    -- User 9 (5 books)
    (9, 8), (9, 9), (9, 10), (9, 11), (9, 12),
    -- User 10 (5 books)
    (10, 13), (10, 14), (10, 15), (10, 16), (10, 17);

-- Insert into Reviews table
INSERT INTO Reviews (user_id, book_id, rating, review_content, user_read_date) VALUES
    -- User 1 (3 reviews)
    (1, 1, 5, 'This book is a masterpiece of storytelling, with intricate plot twists and well-developed characters that keep you engaged from start to finish.', '2023-01-10'),
    (1, 2, 4, 'An interesting read that offers a unique perspective on the subject matter, though it could benefit from more in-depth analysis.', '2023-01-15'),
    (1, 3, 3, 'While not my favorite, this book provides some valuable insights and is worth a read for those interested in the genre.', '2023-01-20'),
    -- User 2 (4 reviews)
    (2, 4, 4, 'A well-written book that captures the essence of its theme beautifully, with engaging prose and a compelling narrative.', '2023-02-10'),
    (2, 5, 5, 'I absolutely loved this book! The author has a way of drawing you into the story and making you care about the characters.', '2023-02-15'),
    (2, 6, 3, 'An average read with some interesting points, but it lacks the depth and complexity I was hoping for.', '2023-02-20'),
    (2, 7, 2, 'The book has potential, but it could be improved with more detailed explanations and a stronger storyline.', '2023-02-25'),
    -- User 3 (5 reviews)
    (3, 8, 5, 'A fantastic book that exceeded my expectations. The plot is well-crafted, and the characters are relatable and engaging.', '2023-03-10'),
    (3, 9, 4, 'A good read with a solid storyline and interesting characters. It kept me entertained throughout.', '2023-03-15'),
    (3, 10, 3, 'An okay book with some redeeming qualities, but it did not fully capture my interest.', '2023-03-20'),
    (3, 11, 2, 'Not a great book, but it has some moments that are worth exploring if you are a fan of the genre.', '2023-03-25'),
    (3, 12, 1, 'A disappointing read that did not live up to my expectations. The plot was predictable and lacked depth.', '2023-03-30'),
    -- User 4 (6 reviews)
    (4, 13, 5, 'An amazing book that I could not put down. The author has a talent for creating vivid imagery and a captivating storyline.', '2023-04-10'),
    (4, 14, 4, 'I enjoyed this book and found it to be a pleasant read. The characters are well-developed, and the plot is engaging.', '2023-04-15'),
    (4, 15, 3, 'This book was fine, but it did not stand out to me. It has some good moments, but overall it is just average.', '2023-04-20'),
    (4, 16, 2, 'Not my type of book, but it might appeal to others who enjoy this genre. It has some interesting ideas.', '2023-04-25'),
    (4, 17, 1, 'I did not enjoy this book. The plot was slow, and the characters were not relatable.', '2023-04-30'),
    (4, 18, 5, 'A great book with a compelling story and well-written characters. I highly recommend it.', '2023-05-05'),
    -- User 5 (7 reviews)
    (5, 19, 4, 'A pretty good book with an interesting plot and engaging characters. It is worth a read.', '2023-05-10'),
    (5, 20, 5, 'An excellent book that I thoroughly enjoyed. The author has a way of making the story come alive.', '2023-05-15'),
    (5, 21, 3, 'Just an okay book. It has some good points, but it did not fully capture my interest.', '2023-05-20'),
    (5, 22, 2, 'This book could improve with more detailed explanations and a stronger storyline.', '2023-05-25'),
    (5, 23, 1, 'Not for me. The plot was predictable, and the characters were not engaging.', '2023-05-30'),
    (5, 24, 5, 'I loved this book! The story is captivating, and the characters are well-developed.', '2023-06-05'),
    (5, 25, 4, 'A very good book with an engaging plot and interesting characters. I recommend it.', '2023-06-10'),
    -- User 6 (8 reviews)
    (6, 26, 5, 'A fantastic book that I could not put down. The plot is well-crafted, and the characters are relatable.', '2023-06-15'),
    (6, 27, 4, 'An enjoyable book with a solid storyline and interesting characters. It kept me entertained.', '2023-06-20'),
    (6, 28, 3, 'An okay book with some redeeming qualities, but it did not fully capture my interest.', '2023-06-25'),
    (6, 29, 2, 'Not my favorite book, but it has some moments that are worth exploring.', '2023-06-30'),
    (6, 30, 1, 'I did not enjoy this book. The plot was slow, and the characters were not relatable.', '2023-07-05'),
    (6, 31, 5, 'A great read with a compelling story and well-written characters. I highly recommend it.', '2023-07-10'),
    (6, 32, 4, 'A good book with an engaging plot and interesting characters. It is worth a read.', '2023-07-15'),
    (6, 33, 3, 'An average book with some good points, but it did not fully capture my interest.', '2023-07-20'),
    -- User 7 (9 reviews)
    (7, 34, 5, 'I loved this book! The story is captivating, and the characters are well-developed.', '2023-07-25'),
    (7, 35, 4, 'A very good book with an engaging plot and interesting characters. I recommend it.', '2023-07-30'),
    (7, 36, 3, 'This book was fine, but it did not stand out to me. It has some good moments.', '2023-08-05'),
    (7, 37, 2, 'The book has potential, but it could be improved with more detailed explanations.', '2023-08-10'),
    (7, 38, 1, 'Not for me. The plot was predictable, and the characters were not engaging.', '2023-08-15'),
    (7, 39, 5, 'An amazing book that I could not put down. The author has a talent for storytelling.', '2023-08-20'),
    (7, 40, 4, 'I enjoyed this book and found it to be a pleasant read. The characters are well-developed.', '2023-08-25'),
    (7, 41, 3, 'An okay book with some redeeming qualities, but it did not fully capture my interest.', '2023-08-30'),
    (7, 42, 2, 'Not a great book, but it has some moments that are worth exploring.', '2023-09-05'),
    -- User 8 (10 reviews)
    (8, 43, 5, 'A fantastic book that exceeded my expectations. The plot is well-crafted and engaging.', '2023-09-10'),
    (8, 44, 4, 'A good read with a solid storyline and interesting characters. It kept me entertained.', '2023-09-15'),
    (8, 45, 3, 'An okay book with some redeeming qualities, but it did not fully capture my interest.', '2023-09-20'),
    (8, 46, 2, 'Not my favorite book, but it has some moments that are worth exploring.', '2023-09-25'),
    (8, 47, 1, 'I did not enjoy this book. The plot was slow, and the characters were not relatable.', '2023-09-30'),
    (8, 48, 5, 'A great book with a compelling story and well-written characters. I highly recommend it.', '2023-10-05'),
    (8, 49, 4, 'A pretty good book with an interesting plot and engaging characters. It is worth a read.', '2023-10-10'),
    (8, 50, 3, 'Just an okay book. It has some good points, but it did not fully capture my interest.', '2023-10-15'),
    (8, 51, 2, 'This book could improve with more detailed explanations and a stronger storyline.', '2023-10-20'),
    (8, 52, 1, 'Not for me. The plot was predictable, and the characters were not engaging.', '2023-10-25'),
    -- User 9 (3 reviews)
    (9, 53, 5, 'I loved this book! The story is captivating, and the characters are well-developed.', '2023-10-30'),
    (9, 54, 4, 'A very good book with an engaging plot and interesting characters. I recommend it.', '2023-11-05'),
    (9, 1, 3, 'This book was fine, but it did not stand out to me. It has some good moments.', '2023-11-10'),
    -- User 10 (3 reviews)
    (10, 2, 2, 'The book has potential, but it could be improved with more detailed explanations.', '2023-11-15'),
    (10, 3, 1, 'Not for me. The plot was predictable, and the characters were not engaging.', '2023-11-20'),
    (10, 4, 5, 'An amazing book that I could not put down. The author has a talent for storytelling.', '2023-11-25');

-- Insert into Genres table following the given order
INSERT INTO Genres (name) VALUES
    ('Anime'),
    ('Biography'),
    ('Comedy'),
    ('Fantasy'),
    ('Horror'),
    ('Mystery'),
    ('Romance'),
    ('Sci-Fi'),
    ('Health/Wellness');

-- Insert into User_Genres table ensuring each user has between 5 and 20 books
INSERT INTO User_Genres (user_id, genre_id) VALUES
    -- User 1 (6 books)
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
    -- User 2 (6 books)
    (2, 7), (2, 8), (2, 9), (2, 1), (2, 2), (2, 3),
    -- User 3 (6 books)
    (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9),
    -- User 4 (6 books)
    (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
    -- User 5 (6 books)
    (5, 7), (5, 8), (5, 9), (5, 1), (5, 2), (5, 3),
    -- User 6 (6 books)
    (6, 4), (6, 5), (6, 6), (6, 7), (6, 8), (6, 9),
    -- User 7 (6 books)
    (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6),
    -- User 8 (6 books)
    (8, 7), (8, 8), (8, 9), (8, 1), (8, 2), (8, 3),
    -- User 9 (6 books)
    (9, 4), (9, 5), (9, 6), (9, 7), (9, 8), (9, 9),
    -- User 10 (6 books)
    (10, 1), (10, 2), (10, 3), (10, 4), (10, 5), (10, 6);

-- Insert into Book_Genres table (Each book belongs to multiple genres)
INSERT INTO Book_Genres (book_id, genre_id) VALUES
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1),
    (7, 2), (8, 2), (9, 2), (10, 2), (11, 2), (12, 2),
    (13, 3), (14, 3), (15, 3), (16, 3), (17, 3), (18, 3),
    (19, 4), (20, 4), (21, 4), (22, 4), (23, 4), (24, 4),
    (25, 5), (26, 5), (27, 5), (28, 5), (29, 5), (30, 5),
    (31, 6), (32, 6), (33, 6), (34, 6), (35, 6), (36, 6),
    (37, 7), (38, 7), (39, 7), (40, 7), (41, 7), (42, 7),
    (43, 8), (44, 8), (45, 8), (46, 8), (47, 8), (48, 8),
    (49, 9), (50, 9), (51, 9), (52, 9), (53, 9), (54, 9)