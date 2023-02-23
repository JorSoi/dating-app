-- Get all the users hobbies

SELECT i.id, i.interest_emoji, i.interest_name FROM user_interests ui
JOIN users u ON u.id = ui.user_id
JOIN interests i ON i.id = ui.interest_id
WHERE u.id = 1;

