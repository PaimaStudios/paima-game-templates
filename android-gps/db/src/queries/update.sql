/* @name updateLocation */
UPDATE locations
SET 
    title = :title!,
    description = :description!
WHERE 
    latitude = :latitude! AND 
    longitude = :longitude!
;
