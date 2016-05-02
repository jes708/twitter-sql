(SELECT *, tweets.id AS tweet_id
FROM tweets
INNER JOIN users
ON userid = users.id)

SELECT *, tweets.id AS tweet_id FROM tweets INNER JOIN users ON userid = users.id



INSERT INTO (SELECT *, tweets.id AS tweet_id
FROM tweets
INNER JOIN users
ON userid = users.id) (userid, content, name, pictureurl, tweet_id)
VALUES (9, "Hi", "Jon", "http://i.imgur.com/JKInSVz.jpg", 11)

-- Users -- id, name, pictureurl
-- Tweets -- id, userid, content
--account for tweet_id col

SELECT id FROM users WHERE name = ""

INSERT INTO users (name, pictureurl) VALUES ('Jon', 'http://lorempixel.com/48/48');


SELECT * FROM tweets WHERE content LIKE '%#wall %' OR content LIKE '%#wall'