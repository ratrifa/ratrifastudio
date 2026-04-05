SET @has_order_priority := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Experience' AND COLUMN_NAME = 'orderPriority'
);

SET @sql := IF(@has_order_priority = 1, 'ALTER TABLE `Experience` DROP COLUMN `orderPriority`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
