/* Angular Assignment */

-- creating the database
create database angularTask
go

-- useing the Created the Database
use angularTask
go

-- creating the table for state
CREATE TABLE States (
    StateID INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    StateName VARCHAR(50) NOT NULL
);
go

-- creating the table for city
CREATE TABLE Cities (
    CityID INT PRIMARY KEY IDENTITY(1,1),   -- Auto-incrementing primary key
    CityName VARCHAR(50) NOT NULL,
    StateID INT NOT NULL,                   -- Foreign key to States table
    FOREIGN KEY (StateID) REFERENCES States(StateID)
);
go

