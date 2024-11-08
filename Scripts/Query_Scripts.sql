/* Query to get the states and city */
SELECT s.StateName, c.CityName
FROM States s
INNER JOIN Cities c ON s.StateID = c.StateID
ORDER BY s.StateName, c.CityName;