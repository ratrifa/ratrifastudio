SET @has_open_to_work := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'openToWork'
);

SET @sql := IF(@has_open_to_work = 0,
  'ALTER TABLE `HeroSection` ADD COLUMN `openToWork` BOOLEAN NOT NULL DEFAULT TRUE AFTER `statusBadgeDetail`',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `HeroSection`
SET `openToWork` = TRUE
WHERE `openToWork` IS NULL;
