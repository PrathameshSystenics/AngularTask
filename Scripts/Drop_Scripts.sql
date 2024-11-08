-- dropping the interest id column from the user database
alter table users
drop constraint FK_Users_InterestID

alter table Users
drop column interestid

-- dropping the spAdduser
drop proc spAddUser