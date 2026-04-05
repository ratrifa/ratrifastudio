-- HeroSection: add direct fields used by current CMS (idempotent for mixed legacy states)
SET @has_headline := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'headline'
);
SET @sql := IF(@has_headline = 0,
  'ALTER TABLE `HeroSection` ADD COLUMN `headline` VARCHAR(191) NULL AFTER `id`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_domain_logo := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'domainLogoUrl'
);
SET @sql := IF(@has_domain_logo = 0,
  'ALTER TABLE `HeroSection` ADD COLUMN `domainLogoUrl` VARCHAR(191) NULL AFTER `description`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_domain_label := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'domainLabel'
);
SET @sql := IF(@has_domain_label = 0,
  'ALTER TABLE `HeroSection` ADD COLUMN `domainLabel` VARCHAR(80) NULL AFTER `domainLogoUrl`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_cv_url := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'cvUrl'
);
SET @sql := IF(@has_cv_url = 0,
  'ALTER TABLE `HeroSection` ADD COLUMN `cvUrl` VARCHAR(191) NULL AFTER `techTags`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_legacy_headline := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME IN ('headlinePrefix', 'headlineAccent', 'headlineSuffix')
);
SET @sql := IF(@has_legacy_headline = 3,
  'UPDATE `HeroSection` SET `headline` = TRIM(CONCAT_WS('' '', `headlinePrefix`, `headlineAccent`, `headlineSuffix`)) WHERE `headline` IS NULL OR `headline` = '''' ',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_legacy_domain_label := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'descriptionLinkLabel'
);
SET @sql := IF(@has_legacy_domain_label = 1,
  'UPDATE `HeroSection` SET `domainLabel` = `descriptionLinkLabel` WHERE (`domainLabel` IS NULL OR `domainLabel` = '''') AND `descriptionLinkLabel` IS NOT NULL AND `descriptionLinkLabel` <> '''' ',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_legacy_cv := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = 'secondaryCtaHref'
);
SET @sql := IF(@has_legacy_cv = 1,
  'UPDATE `HeroSection` SET `cvUrl` = `secondaryCtaHref` WHERE (`cvUrl` IS NULL OR `cvUrl` = '''') AND `secondaryCtaHref` IS NOT NULL AND `secondaryCtaHref` <> '''' ',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `HeroSection`
SET `headline` = 'Crafting digital experiences that matter'
WHERE `headline` IS NULL OR `headline` = '';

UPDATE `HeroSection`
SET `domainLabel` = 'yourname.dev'
WHERE `domainLabel` IS NULL OR `domainLabel` = '';

UPDATE `HeroSection`
SET `cvUrl` = '/cv.pdf'
WHERE `cvUrl` IS NULL OR `cvUrl` = '';

ALTER TABLE `HeroSection`
  MODIFY COLUMN `headline` VARCHAR(191) NOT NULL,
  MODIFY COLUMN `domainLabel` VARCHAR(80) NOT NULL,
  MODIFY COLUMN `cvUrl` VARCHAR(191) NOT NULL;

SET @drop_col := 'eyebrow';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `eyebrow`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'headlinePrefix';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `headlinePrefix`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'headlineAccent';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `headlineAccent`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'headlineSuffix';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `headlineSuffix`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'descriptionLinkHref';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `descriptionLinkHref`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'descriptionLinkLabel';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `descriptionLinkLabel`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'primaryCtaLabel';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `primaryCtaLabel`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'primaryCtaTarget';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `primaryCtaTarget`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'secondaryCtaLabel';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `secondaryCtaLabel`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'secondaryCtaHref';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `secondaryCtaHref`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'scrollIndicatorLabel';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `scrollIndicatorLabel`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'statusBadgeLabel';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'HeroSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `HeroSection` DROP COLUMN `statusBadgeLabel`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AboutSection: collapse legacy paragraph columns into single paragraph (idempotent)
SET @has_paragraph := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME = 'paragraph'
);
SET @sql := IF(@has_paragraph = 0,
  'ALTER TABLE `AboutSection` ADD COLUMN `paragraph` TEXT NULL AFTER `headline`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_legacy_paragraph := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME IN ('paragraphOne', 'paragraphTwo', 'paragraphThree')
);
SET @sql := IF(@has_legacy_paragraph = 3,
  'UPDATE `AboutSection` SET `paragraph` = TRIM(CONCAT_WS(''\\n\\n'', `paragraphOne`, `paragraphTwo`, `paragraphThree`)) WHERE `paragraph` IS NULL OR `paragraph` = '''' ',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `AboutSection`
SET `paragraph` = 'Write your about story here.'
WHERE `paragraph` IS NULL OR `paragraph` = '';

ALTER TABLE `AboutSection`
  MODIFY COLUMN `paragraph` TEXT NOT NULL;

SET @drop_col := 'eyebrow';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `AboutSection` DROP COLUMN `eyebrow`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'paragraphOne';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `AboutSection` DROP COLUMN `paragraphOne`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'paragraphTwo';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `AboutSection` DROP COLUMN `paragraphTwo`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_col := 'paragraphThree';
SET @has_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'AboutSection' AND COLUMN_NAME = @drop_col
);
SET @sql := IF(@has_col = 1, 'ALTER TABLE `AboutSection` DROP COLUMN `paragraphThree`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
