CREATE TABLE `ExperiencePhoto` (
  `id` VARCHAR(191) NOT NULL,
  `experienceId` VARCHAR(191) NOT NULL,
  `imageUrl` VARCHAR(191) NOT NULL,
  `caption` VARCHAR(191) NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `ExperiencePhoto_experienceId_sortOrder_createdAt_idx` (`experienceId`, `sortOrder`, `createdAt`),
  CONSTRAINT `ExperiencePhoto_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
