

CREATE DATABASE IF NOT EXISTS alumni_connect;
USE alumni_connect;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role ENUM('admin', 'alumni', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alumni profiles table
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    occupation VARCHAR(100),
    company VARCHAR(100),
    domain VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cgpa FLOAT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT NOT NULL,
    type ENUM('internship', 'scholarship', 'mentorship', 'success_story') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    min_cgpa FLOAT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    opportunity_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    resume_file VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

-- default admin user 
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@alumni.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', 'admin');

-- for testing
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES 
('John Alumni', 'john@alumni.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', 'alumni'),
('Jane Student', 'jane@student.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', 'student');

-- Sample alumni profile
INSERT IGNORE INTO alumni_profiles (user_id, occupation, company, domain) VALUES 
(2, 'Software Engineer', 'Tech Corp', 'Computer Science');

-- Sample student profile
INSERT IGNORE INTO student_profiles (user_id, cgpa, category) VALUES 
(3, 8.5, 'General');

-- Sample opportunities
INSERT IGNORE INTO opportunities (alumni_id, type, title, description, min_cgpa, category) VALUES 
(2, 'internship', 'Software Development Internship', 'Join our team for a 3-month internship program', 7.0, 'Computer Science'),
(2, 'scholarship', 'Merit Scholarship', 'Scholarship for students with excellent academic performance', 8.0, 'General'),
(2, 'mentorship', 'Career Guidance Program', 'Get guidance from industry experts', NULL, 'General');
