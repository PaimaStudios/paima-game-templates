
/* @name newLocation */
INSERT INTO locations (
  latitude,
  longitude,
  title,
  description,
  wallet
) VALUES (
  :latitude!,
  :longitude!,
  :title!,
  :description!,
  :wallet!
);
