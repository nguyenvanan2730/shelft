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

-- Insert into Users table
-- Default password: shelf_2025
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
-- ANIME
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('Death Note, Vol. 1: Boredom', 'Tsugumi Ohba, Takeshi Obata (Illustrator), Pookie Rolf (Translator)', '2004-04-02', 
     'Light Yagami is an ace student with great prospects - and he''s bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami, a death god. Any human whose name is written in the notebook dies, and now Light has vowed to use the power of the Death Note to rid the world of evil. But when criminals begin dropping dead, the authorities send the legendary detective L to track down the killer. With L hot on his heels, will Light lose sight of his noble goal... or his life? Boredom Light tests the boundaries of the Death Note''s powers as L and the police begin to close in. Luckily, Light''s father is the head of the Japanese National Police Agency and leaves vital information about the case lying around the house. With access to his father''s files, Light can keep one step ahead of the authorities. But who is the strange man following him, and how can Light guard against enemies whose names he doesn''t know?', 'death_note.jpg', '2024-01-15 09:30:22'),
    ('Ouran High School Host Club, Vol. 1', 'Bisco Hatori', '2003-08-05', 
     'In this screwball romantic comedy, Haruhi, a poor girl at a rich kids'' school, is forced to repay an $80,000 debt by working for the school''s swankiest, all-male club—as a boy! There, she discovers just how wealthy the six members are and how different the rich are from everybody else... One day, Haruhi, a scholarship student at exclusive Ouran High School, breaks an $80,000 vase that belongs to the "Host Club," a mysterious campus group consisting of six super-rich (and gorgeous) guys. To pay back the damages, she is forced to work for the club, and it''s there that she discovers just how wealthy the boys are and how different they are from everybody else.', 'ouran_high_school_host_club.jpg', '2024-02-18 14:45:37'),
    ('SPY×FAMILY 1', 'Tatsuya Endo', '2019-07-04', 
     'A skilled spy, Twilight, is ordered to create a "family" in order to infiltrate a prestigious school. However, the "daughter" he meets is a psychic who can read minds! And his "wife" is an assassin! This is a delightful comedy about a temporary family who hide their true identities from each other and face the entrance exams and the crisis of the world!', 'spy_family1.jpg', '2024-03-22 11:15:49'),
    ('My name is Hyuga', 'Chugong (Original Creator), Dubu (Redice Studio) (Illustrator)', '2023-05-25', 
     'I want you to know what I''m saying!! 1 year old, 1 year old, 1 year old, 1 year old. Home Sorry, I''m not sure. I can''t wait to see you, I can''t wait to see you I love you…!!', 'my_name_is_hyug8.jpg', '2024-04-05 16:20:33'),
    ('Jujutsu Kaisen 20', 'Gege Akutami', '2022-08-04', 
     'Fushiguro and Reggie are on the verge of being crushed to death by each other''s magic formulas. Reggie moves to break the deadly battle, and the deadly battle moves towards its conclusion!! Meanwhile, in the Sendai barrier, Okkotsu breaks the four-way battle between powerful people, and a fierce battle breaks out between past magicians and special-grade cursed spirits!', 'jujutsu_kaisen20.jpg', '2024-05-12 08:40:15'),
    ('Maid-sama! Vol. 01', 'Hiro Fujiwara', '2006-01-01', 
     'Misaki Ayuzawa is the President of the Student Council at Seika High School, formerly an all-boys school. Unfortunately, most of the students are still male and stuck in their slovenly habits, so man-hating Misaki really socks it to them in an attempt to make the school presentable to attract more female students. But what will she do when the sexiest boy in school finds out that after school, Misaki works in a maid cafe.', 'maid_sama_Vol_01.jpg', '2024-06-30 13:25:58');

-- BIOGRAPHY
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('Secrets of the Sporting Elite', 'Alistair Brownlee', '2021-07-01', 
     'From an early age Alistair Brownlee has been obsessed with being the very best, and not just improving his sporting performance across his three specialist triathlon disciplines of swimming, cycling and running, but also understanding how a winner becomes a dominant champion.', 'secrets_of_the_sporting_elite.jpg', '2024-07-08 10:15:42'),
    ('Harry Styles Adore You', 'Carolyn McHugh', '2019-01-01', 
     'The breakout star of the hugely successful boy-band One Direction, Harry has achieved solo stardom as a musician, an actor, a fashionista and humanitarian. His two hit albums, Harry Styles and Fine Lines have won critical acclaim and track after track have gone on to top the music charts all over the world.', 'harry_styles_adore_you.jpg', '2024-08-19 15:30:27'),
    ('Diddly Squat: ''Til the Cows Come Home', 'Jeremy Clarkson', '2022-09-01', 
     'At the end of Jeremy''s first year in the tractor''s driving seat, Diddly Squat farm rewarded him with a profit of just £144. So, while he''s the first to admit that he''s still only a "trainee farmer", there is clearly still work to be done.', 'diddly_squat_til_the_cows_come_home.jpg', '2024-09-25 12:10:55'),
    ('The Furious Method', 'Tyson Fury', '2020-11-01', 
     'From weighing twenty-eight stone and fighting a deep depression, to his amazing return to heavyweight champion of the world, Tyson opens up and shares his inspiring advice and tips on diet, exercise regime, and his incredible journey back to a healthier body and mind.', 'the_furious_method.jpg', '2024-10-14 09:45:33'),
    ('Never: The Autobiography', 'Rick Astley', '2024-10-01', 
     'At just nineteen, Rick agreed to sign with legendary music producer Pete Waterman – under the wings of music powerhouse Stock Aitken Waterman. Unpredictable, outlandish adventures followed, giving him a peek into the mechanics of the music industry.', 'never_the_autobiography.jpg', '2024-11-30 17:20:18'),
    ('Cher: The Memoir', 'Cher', '2024-11-01', 
     'After more than seventy years of fighting to live her life on her own terms, Cher finally reveals her true story in intimate detail, in a two-part memoir.', 'cher_the_memoir.jpg', '2024-12-05 14:35:49');

-- COMEDY
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('How to Train Your Human: A Cat''s Guide', 'Babas', '2024-01-01', 
     'Discover the best-kept secrets of how your cat chooses you, loves you, and subtly trains you to fulfill its every wish in this charming and irresistible guide, written from the perspective of one witty kitty.', 'how_to_train_your_human_a_cats_guide.jpg', '2024-01-10 11:25:40'),
    ('My Favourite Mistake', 'Marian Keyes', '2024-01-01', 
     'Anna has just lost her taste for the Big Apple…She has a life to envy. An apartment in New York. A well-meaning (too well-meaning?) partner. And a high-flying job in beauty PR. Who wouldn''t want all that? Anna, it turns out.', 'my_favourite_mistake.jpg', '2024-01-22 16:50:12'),
    ('Abroad in Japan', 'Chris Broad', '2024-01-01', 
     'When Englishman Chris Broad landed in a rural village in northern Japan he wondered if he''d made a huge mistake. With no knowledge of the language and zero teaching experience, was he about to be the most quickly fired English teacher in Japan''s history?', 'abroad_in_japan.jpg', '2024-02-08 10:05:38'),
    ('Comedy Pet Photography Awards', 'Paul Joynson-Hicks & Tom Sullam', '2024-10-01', 
     'From the creators of the hilarious Comedy Wildlife Photography Awards, comes a new book on our beloved pets! When the Comedy Pet Photography Awards announced a contest for the funniest pet photos, they received thousands of entries from all over the world.', 'comedy_pet_photography_awards.jpg', '2024-02-17 13:40:22'),
    ('The First Rule of Comedy', 'Jeffrey Holland, Robert Ross', '2024-02-01', 
     'Fondly remembered as Spike Dixon in Hi-De-Hi!, Jeffrey Holland is one of Britain''s best-loved situation comedy actors. An invaluable member of the repertory company of writer and director David Croft, his many other television credits include Are You Being Served?', 'the_first_rule_of_comedy.jpg', '2024-03-01 09:15:55'),
    ('Comedy, Comedy, Comedy, Drama', 'Bob Odenkirk', '2023-04-01', 
     'In this hilarious, heartfelt memoir, the star of Mr. Show and Breaking Bad spin-off Better Call Saul opens up about the highs and lows of showbiz, his cult status as a comedy writer, and what it''s like to reinvent himself at age fifty as an action-film ass-kicker.', 'comedy_comedy_comedy_drama.jpg', '2024-03-14 11:45:09');

-- FANTASY
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('Quicksilver - The Fae & Alchemy Series', 'Callie Hart', '2024-12-01', 
     'In the land of the unforgiving desert, twenty-four-year-old Saeris Fane is good at keeping secrets. But when she inadvertently reopens a gateway between realms, she is transported to a land of ice and snow, where the Fae are real and a centuries-long conflict might just get her killed.', 'quicksilver.jpg', '2024-01-05 08:30:15'),
    ('A Court of Thorns and Roses', 'Sarah J. Maas', '2020-06-01', 
     'Feyre, a huntress, kills a wolf in the forest, unaware that it was a faerie in disguise. As punishment, she is taken to the land of the Fae, where she discovers a hidden world filled with magic, secrets, and an unexpected romance.', 'a_court_of_thorns_and_roses.jpg', '2024-02-12 14:20:33'),
    ('Iron Flame - The Empyrean', 'Rebecca Yarros', '2024-11-01', 
     'Violet Sorrengail survived her first year at Basgiath War College, but now the stakes are higher than ever. With a powerful new enemy threatening everything she loves, she must navigate a web of lies, danger, and dragon fire to survive.', 'iron_flame.jpg', '2024-03-18 11:55:47'),
    ('Onyx Storm - The Empyrean', 'Rebecca Yarros', '2024-01-01', 
     'With enemies closing in both outside and within the ranks of Basgiath War College, Violet must venture beyond the failing Aretian wards to find allies. Secrets, magic, and the truth could change everything in this gripping continuation.', 'onyx_storm.jpg', '2024-04-22 16:40:28'),
    ('Fable For the End of the World: Signed Edition', 'Ava Reid', '2024-03-01', 
     'In a dystopian world controlled by a powerful corporation, Inesa and her brother struggle to survive. When her mother''s debts lead to a deadly selection for a live-streamed assassination spectacle, Inesa faces an impossible fight for survival.', 'fable_for_the_end_of_the_world.jpg', '2024-05-15 09:10:52'),
    ('The Ragpicker King - The Chronicles of Castellane', 'Cassandra Clare', '2024-03-01', 
     'Kel Saren, body double to the crown prince of Castellane, must uncover the truth behind a massacre at the royal palace. His search leads him to the Ragpicker King and a conspiracy that could destroy the royal family.', 'the_ragpicker_king_the_chronicles_of_castellane.jpg', '2024-06-28 13:35:19');

-- HORROR
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('Holly', 'Stephen King', '2024-09-01', 
     'Holly Gibney, a detective from Finders Keepers, is on leave but cannot refuse a mother''s desperate request to find her missing daughter. As she investigates, she uncovers a chilling mystery that leads to gruesome discoveries.', 'holly.jpg', '2024-04-03 10:25:44'),
    ('The Haunting of Hill House - Penguin Modern Classics', 'Shirley Jackson', '2009-10-01', 
     'A group of four people gathers at the mysterious Hill House to investigate supernatural events. As strange occurrences intensify, fear takes hold, and the house seems to choose its victim in this classic horror novel.', 'the_haunting_of_hill_house.jpg', '2024-04-17 15:50:31'),
    ('Interview With The Vampire: Volume 1 in series - Vampire Chronicles', 'Anne Rice', '2008-10-01', 
     'A young journalist listens as Louis, a vampire cursed with eternal life, recounts his macabre and mesmerizing story. A gothic tale of passion, immortality, and the hunger for blood that redefined vampire fiction.', 'interview_with_the_vampire.jpg', '2024-05-05 12:15:27'),
    ('Monstrilio', 'Gerardo Samano Cordova', '2024-06-01', 
     'Grieving mother Magos takes a piece of her deceased son''s lung and nurtures it into a sentient creature. As Monstrilio grows, his monstrous impulses threaten the fragile second chance at life in this haunting meditation on grief.', 'monstrilio.jpg', '2024-05-20 09:40:18'),
    ('The Exorcist', 'William Peter Blatty', '2011-10-01', 
     'When young Regan begins exhibiting disturbing behavior, medical science fails to explain the horrors unfolding. Father Damien Karras is called in to perform an exorcism, leading to one of the most terrifying battles between good and evil.', 'the_exorcist.jpg', '2024-06-08 14:05:53'),
    ('The Devils: Signed Exclusive Edition', 'Joe Abercrombie', '2024-05-01', 
     'In a world ravaged by plague, famine, and monstrous threats, a secret holy order assembles a group of convicted criminals for a desperate mission. Their goal: to put a thief on the throne and unite a fractured world before the elves return.', 'the_devils.jpg', '2024-06-25 11:30:42');

-- MYSTERY
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('How To Solve Your Own Murder - The Castle Knoll Files', 'Kristen Perrin', '2024-01-01', 
     'In 1965, Frances Adams was warned she would be murdered. She spent six decades collecting secrets on everyone she met—until she was found dead. Now, her great-niece Annie must solve the case to claim her inheritance before the killer strikes again.', 'how_to_solve_your_own_murder.jpg', '2024-07-12 08:55:36'),
    ('Murdle: The School of Mystery: 50 Seriously Sinister Murder Mystery Logic Puzzles - Murdle Puzzle Series', 'G. T. Karber', '2024-10-01', 
     'Join Deductive Logico at Deduction College, where young detectives stumble upon mysterious campus murders. Solve puzzles, decipher codes, and use logic to catch the culprits in this interactive detective casebook.', 'murdle_the_school_of_mystery50_seriously_sinister_murder_mystery_logic_puzzles.jpg', '2024-08-24 13:20:48'),
    ('Death and Croissants - A Follet Valley Mystery', 'Ian Moore', '2022-04-01', 
     'Richard, a B&B owner in the Loire Valley, enjoys a quiet life—until a guest disappears, leaving behind a bloody handprint. With the mysterious Valerie, he''s drawn into an investigation that soon turns deadly when his beloved hen, Ava Gardner, is murdered.', 'death_and_croissants.jpg', '2024-09-10 16:45:29'),
    ('Silverborn: The Mystery of Morrigan Crow - Nevermoor', 'Jessica Townsend', '2024-05-01', 
     'Morrigan Crow embarks on a thrilling adventure, uncovering secrets about her past and learning more about the Wundrous Arts. As she aligns herself with a dangerous figure, she must navigate Nevermoor''s mysteries to uncover the truth about who she truly is.', 'silverborn_the_mystery_of_morrigan_crow_signed.jpg', '2024-10-18 10:30:15'),
    ('Wink, Murder: A Bletchley Park Mystery', 'Rhian Tracey', '2024-02-01', 
     'Mary, a gifted codebreaker, is recruited for a secret mission at Bletchley Park during WWII. Disguised as a waitress at the Ritz Hotel, she uncovers enemy spies among her closest allies. With war raging, she must trust no one to survive.', 'wink_murder_a_bletchley_park_mystery.jpg', '2024-11-05 15:55:37'),
    ('The Way of All Flesh - A Raven and Fisher Mystery', 'Ambrose Parry', '2019-04-01', 
     'In 1847 Edinburgh, medical student Will Raven and housemaid Sarah Fisher investigate a string of gruesome murders. As they descend into the city''s dark underbelly, they must work together to uncover the killer before becoming the next victims.', 'the_way_of_all_flesh.jpg', '2024-12-20 12:40:22');

-- ROMANCE
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('A Court of Wings and Ruin: Exclusive Edition - A Court of Thorns and Roses', 'Sarah J. Maas', '2024-04-01', 
     'Feyre returns to the Spring Court, playing a dangerous game of deception to gather intelligence on Tamlin and an invading king. As war looms, she must decide whom to trust among the powerful High Lords and face the ultimate test with her mate.', 'a_court_of_wings_and_ruin.jpg', '2024-01-08 09:15:33'),
    ('Deep End', 'Ali Hazelwood', '2024-02-01', 
     'Diver Scarlett Vandermeer is focused on recovering from an injury and getting into med school—until she crosses paths with Lukas Blomqvist, a world-champion swimmer. When a secret is revealed, their carefully controlled lives begin to unravel.', 'deep_end.jpg', '2024-01-27 14:40:19'),
    ('The Ick', 'Holly McCulloch', '2024-03-01', 
     'Gem''s promising date turns sour when she''s hit with "the ick" over his lunch choice. Her friend Shanti, however, thinks she''s self-sabotaging. To prove a point, Shanti challenges Gem to a psychology study that might just change her outlook on love.', 'the_ick.jpg', '2024-02-15 11:05:48'),
    ('Ugly Love', 'Colleen Hoover', '2014-08-01', 
     'Tate Collins never expected to fall for airline pilot Miles Archer. He wants no love, no future—only passion. She agrees to his two rules: don''t ask about his past and expect nothing beyond the present. But what happens when her heart refuses to listen?', 'ugly_love.jpg', '2024-03-04 16:30:27'),
    ('Twisted Love - Twisted', 'Ana Huang', '2022-05-01', 
     'Alex Volkov, driven by tragedy, has no room for love—until he''s forced to care for his best friend''s sister, Ava Chen. She''s sunshine to his ice, and their forbidden romance threatens to uncover dark secrets that could destroy them both.', 'twisted_love.jpg', '2024-03-22 10:55:14'),
    ('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '2021-10-01', 
     'Hollywood legend Evelyn Hugo finally reveals the truth about her scandalous past. She chooses unknown journalist Monique Grant to write her biography, leaving Monique to uncover why she was chosen—and what secrets Evelyn has kept hidden for decades.', 'the_seven_husbands_of_evelyn_hugo.jpg', '2024-04-10 13:20:56');

-- SCI-FI
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('All We Leave Behind: Transits of Three', 'Benjamin X. Wretlind', '2022-12-01', 
     'Miriam Page leads a desperate search for a new home, guided by an ancient map. But as their fractured people struggle through brutal landscapes, betrayal and disease threaten to doom them all. Can Miriam lead them to salvation, or will they perish?', 'all_we_leave_behind_transits_of_three.jpg', '2024-07-05 09:45:28'),
    ('The Veil: A Dark Bio-Punk Sci-Fi Thriller', 'JJ Cross', '2024-02-01', 
     'Aaro Emmerson swore never to leave the city again, but with its survival in jeopardy, he must retrieve a nuclear core from the wild unknown. Facing monstrous threats outside and within, Aaro may find that the worst enemy has always been among them.', 'the_veil.jpg', '2024-08-15 15:10:42'),
    ('The Thread: A Dark Time-Travel Sci-Fi Thriller', 'JJ Cross', '2024-03-01', 
     'Captain Sebastian Beauclaire''s mission is simple: travel back and correct history to prevent a global catastrophe. But when he lands in Nazi-occupied Paris, hunted by an enemy that can track his every move, he must escape or risk dooming humanity.', 'the_thread.jpg', '2024-09-22 12:35:19'),
    ('Battlefield Earth: Post-Apocalyptic Sci-Fi', 'Josh Clark, Scott Menville, Fred Tatascorie, Stefan Rudnicki', '2016-06-01', 
     'In the year 3000, humanity''s fate hangs in the balance. Under the oppressive rule of the alien Psychlos, Jonnie Goodboy Tyler embarks on an epic battle for Earth''s survival, facing intergalactic tyranny, financial warfare, and political intrigue.', 'battlefield_earth.jpg', '2024-10-30 08:50:37'),
    ('Dune', 'Frank Herbert', '2015-07-01', 
     'On the desert planet Arrakis, Paul Atreides is thrust into a conflict over the most valuable substance in the universe: spice. As powerful enemies clash, Paul''s destiny unfolds in a tale of power, prophecy, and survival in a vast, hostile world.', 'dune.jpg', '2024-11-18 14:15:53'),
    ('The Shadow of the Gods: Book One of the Bloodsworn Saga', 'John Gwynne', '2022-01-01', 
     'A hundred years after the gods destroyed themselves, their bones still hold immense power. As war looms, three warriors—huntress, noblewoman, and thrall—seek their own paths in a Norse-inspired world of magic, vengeance, and battle.', 'the_shadow_of_the_gods.jpg', '2024-12-07 11:40:25');

-- HEALTH/ WELLNESS
INSERT INTO Books (title, author, published_year, summary, cover_image, created_at) VALUES
    ('The Naked Vegan: 140+ Tasty Raw Vegan Recipes for Health and Wellness', 'Maz Valcorza', '2016-04-01', 
     'Maz Valcorza''s journey from a fast-living, bacon-loving lifestyle to plant-based wellness led to this collection of 140+ raw vegan recipes. A story of transformation, mindfulness, and delicious, nourishing food.', 'the_naked_vegan.jpg', '2024-04-25 10:05:38'),
    ('Committed to Wellness, Fitness, and a Healthy Lifestyle', 'Marta Tuchowska', '2015-08-01', 
     'Discover the keys to motivation, mindset shifts, and rapid body transformation. This guide empowers readers to unlock their inner drive and commit to a lifelong journey of health and wellness.', 'committed_to_wellness.jpg', '2024-05-12 15:30:47'),
    ('Mindfulness Hacks for Women', 'Sophia Sharp', '2023-01-01', 
     'Packed with practical techniques, this book helps women manage stress, improve focus, and enhance emotional well-being. Through journaling, gratitude, and mindfulness exercises, readers can find balance in today''s fast-paced world.', 'mindfulness_hacks_for_women.jpg', '2024-05-28 12:55:19'),
    ('The Mountain Is You: Transforming Self-Sabotage Into Self-Mastery', 'Brianna Wiest', '2020-05-01', 
     'A deep dive into self-sabotage—why we do it, how to stop, and how to transform our habits. Brianna Wiest offers insight on emotional intelligence, resilience, and unlocking our highest potential.', 'the_mountain_is_you_transforming_self_sabotage_into_self_mastery.jpg', '2024-06-14 09:20:33'),
    ('The Wellness Book: The Comprehensive Guide to Maintaining Health and Treating Stress-Related Illness', 'Herbert Benson', '1993-10-01', 
     'Dr. Herbert Benson provides a definitive resource on treating stress-related conditions like hypertension, anxiety, and chronic pain. A must-read for those seeking holistic wellness and stress management techniques.', 'wellness_book_thecomprehensive_guide_to_maintaining_health_and_treating_stress_related_illness.jpg', '2024-06-30 14:45:52'),
    ('Run Fast. Cook Fast. Eat Slow.', 'Shalane Flanagan, Elyse Kopecky', '2018-08-01', 
     'Olympian Shalane Flanagan and chef Elyse Kopecky return with quick and nourishing recipes designed for athletes and busy individuals. From pre-run snacks to race-day meals, this book offers delicious, nutrient-packed fuel.', 'run_fast_cook_fast_eat_slow.jpg', '2024-07-15 11:10:28');

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