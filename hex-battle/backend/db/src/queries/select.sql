/* @name getOpenLobbies */
SELECT * FROM lobby 
where lobby_state = 'open'
and created_at > now() - interval '1 day' 
order by created_at desc
;