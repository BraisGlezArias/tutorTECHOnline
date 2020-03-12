/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Pasos a seguir:
-- 1. Ir a mysql en el terminal (sudo mysql) y crear la base de datos tutorTECHOnline (CREATE DATABASE tutorTECHOnline).
-- 2. Seleccionar dicha base de datos como principal (USE tutorTECHOnline).
-- 3. Insertar el siguiente texto para crear las tablas:

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
	`id` CHAR(36) NOT NULL,
    `userName` VARCHAR(25) COLLATE utf8_unicode_ci UNIQUE NOT NULL,
    `email` VARCHAR(255) COLLATE utf8_unicode_ci UNIQUE NOT NULL,
    `password` CHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    `role` VARCHAR(36) COLLATE utf8_unicode_ci DEFAULT NULL,
    `avatarURL` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
    `createdAt` DATETIME DEFAULT NULL,
    `updatedAt` DATETIME DEFAULT NULL,
    `deletedAt` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=innoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `questions` (
	`id` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
	`title` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
	`content` TEXT COLLATE utf8_unicode_ci NOT NULL,
    `visitCounter` CHAR(36) COLLATE utf8_unicode_ci DEFAULT NULL, 
	`userId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME DEFAULT NULL,
	`deletedAt` DATETIME DEFAULT NULL,
	PRIMARY KEY (`id`),
    KEY `fkQuestionsUserIdUserId` (`userId`),
	CONSTRAINT `fkQuestionsUserIdUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=innoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tags` (
	`id` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
	`tag` CHAR(40) COLLATE utf8_unicode_ci NOT NULL,
    `image` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,
	`createdAt` DATETIME DEFAULT NULL,
    `updatedAt` DATETIME DEFAULT NULL,
    `deletedAt` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `questionsTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `questionsTags` (
	`questionId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `tagId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY (`questionId`, `tagId`),
    KEY `fkQuestionsTagsTagIdTagsId` (`tagId`),
    CONSTRAINT `fkQuestionsTagsQuestionIdQuestionsId` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fkQuestionsTagsTagIdTagsId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=innoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `answers` (
	`id` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
	`content` TEXT COLLATE utf8_unicode_ci NOT NULL,
	`userId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `questionId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME DEFAULT NULL,
	`deletedAt` DATETIME DEFAULT NULL,
	PRIMARY KEY (`id`),
    KEY `fkAnswersUserIdUserId` (`userId`),
    CONSTRAINT `fkAnswersQuestionIdQuestionId` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT `fkAnswersUserIdUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT    
) ENGINE=innoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ratings` (
	`id` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `rating` CHAR(3) COLLATE utf8_unicode_ci NOT NULL,
    `answerId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `userId` CHAR(36) COLLATE utf8_unicode_ci NOT NULL,
    `createdAt` DATETIME DEFAULT NULL,
    `updatedAt` DATETIME DEFAULT NULL,
    `deletedAt` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fkRatingsUserIdUserId` (`userId`),
    CONSTRAINT `fkRatingsAnswerIdAnswerId` FOREIGN KEY (`answerId`) REFERENCES `answers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `fkRatingsUserIdUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=innoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;