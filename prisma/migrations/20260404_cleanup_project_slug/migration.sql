SET @has_slug_index := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Project' AND INDEX_NAME = 'Project_slug_key'
);

SET @sql := IF(@has_slug_index = 1, 'ALTER TABLE `Project` DROP INDEX `Project_slug_key`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_slug_column := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Project' AND COLUMN_NAME = 'slug'
);

SET @sql := IF(@has_slug_column = 1, 'ALTER TABLE `Project` DROP COLUMN `slug`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
