-- Get all the users hobbies

SELECT i.id, i.interest_emoji, i.interest_name FROM user_interests ui
JOIN users u ON u.id = ui.user_id
JOIN interests i ON i.id = ui.interest_id
WHERE u.id = 1;

DELETE FROM user_likes
WHERE user_2_id = 7

INSERT INTO user_likes VALUES (2,7), (4,7), (6,7);

SELECT  users.id, users.name, users.image, user_likes.like_date FROM user_likes 
JOIN users ON user_likes.user_1_id = users.id 
WHERE user_likes.user_2_id = 7 ORDER BY like_date DESC LIMIT 3

INSERT INTO interests VALUES(DEFAULT, '🐶', 'Dogs'), (DEFAULT, '🐈', 'Cats')

INSERT INTO user_likes VALUES(4, 5)

INSERT INTO users (id, name, email, password)
VALUES(DEFAULT, 'Test User', 'test.user@email.com', 'testpassword1234')


-- Storing User Locations
CREATE TABLE user_locations (
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
	latitude DECIMAL,
  longitude DECIMAL,
  city varchar,
  country varchar
 )

-- Storing User Interests Relation
CREATE TABLE user_interests (
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  interest_id integer REFERENCES interests(id) ON DELETE CASCADE
 )

-- Storing User Likes Relation
CREATE TABLE user_likes (
  user_1_id integer REFERENCES users(id) ON DELETE CASCADE,
  user_2_id integer REFERENCES users(id) ON DELETE CASCADE,
  like_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
 )