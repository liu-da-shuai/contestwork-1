-- 数据库备份
-- 备份时间: 2026-05-20 20:15:23

-- 表: attachments
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `signup_id` bigint unsigned DEFAULT NULL,
  `filename` longtext COLLATE utf8mb4_unicode_ci,
  `original_name` longtext COLLATE utf8mb4_unicode_ci,
  `file_path` longtext COLLATE utf8mb4_unicode_ci,
  `file_size` bigint DEFAULT NULL,
  `file_type` longtext COLLATE utf8mb4_unicode_ci,
  `upload_time` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attachments` VALUES ('1', '8', '[56 95 49 55 55 56 57 57 57 54 50 50 46 100 111 99 120]', '[48 50 51 51 57 53 56 229 136 152 229 152 137 231 191 148 227 128 138 232 174 161 231 174 151 230 156 186 232 167 134 232 167 137 228 184 142 230 168 161 229 188 143 232 175 134 229 136 171 227 128 139 95 229 174 158 232 183 181 230 138 165 229 145 138 46 100 111 99 120]', '[117 112 108 111 97 100 115 92 56 95 49 55 55 56 57 57 57 54 50 50 46 100 111 99 120]', '2602362', '[46 100 111 99 120]', '2026-05-17 14:33:42.591 +0800 CST');
INSERT INTO `attachments` VALUES ('2', '5', '[53 95 49 55 55 56 57 57 57 54 51 48 46 100 111 99 120]', '[48 50 51 51 57 53 56 229 136 152 229 152 137 231 191 148 227 128 138 232 174 161 231 174 151 230 156 186 232 167 134 232 167 137 228 184 142 230 168 161 229 188 143 232 175 134 229 136 171 227 128 139 95 229 174 158 232 183 181 230 138 165 229 145 138 46 100 111 99 120]', '[117 112 108 111 97 100 115 92 53 95 49 55 55 56 57 57 57 54 51 48 46 100 111 99 120]', '2602362', '[46 100 111 99 120]', '2026-05-17 14:33:50.948 +0800 CST');
INSERT INTO `attachments` VALUES ('4', '1', '[49 95 49 55 55 57 48 49 51 55 49 49 54 50 56 57 57 51 57 48 48 46 100 111 99]', '[229 176 129 233 157 162 229 143 138 232 175 132 229 136 134 232 161 168 239 188 136 49 45 56 229 145 168 228 186 148 239 188 137 46 100 111 99]', '[117 112 108 111 97 100 115 92 49 95 49 55 55 57 48 49 51 55 49 49 54 50 56 57 57 51 57 48 48 46 100 111 99]', '54272', '[46 100 111 99]', '2026-05-17 18:28:31.631 +0800 CST');

-- 表: award
DROP TABLE IF EXISTS `award`;
CREATE TABLE `award` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `award` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 表: awards
DROP TABLE IF EXISTS `awards`;
CREATE TABLE `awards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher` longtext COLLATE utf8mb4_unicode_ci,
  `title` longtext COLLATE utf8mb4_unicode_ci,
  `award` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `awards` VALUES ('1', '[229 149 167 229 149 167 229 149 167]', '[230 149 153 229 173 166 231 171 158 232 181 155]', '[228 184 128 231 173 137 229 165 150]');
INSERT INTO `awards` VALUES ('2', '[229 149 167 229 149 167 229 149 167]', '[113 119 114 101]', '[228 184 128 231 173 137 229 165 150]');

-- 表: blind_reviews
DROP TABLE IF EXISTS `blind_reviews`;
CREATE TABLE `blind_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contest_title` longtext COLLATE utf8mb4_unicode_ci,
  `signup_id` bigint unsigned DEFAULT NULL,
  `reviewer_id` bigint unsigned DEFAULT NULL,
  `reviewer_name` longtext COLLATE utf8mb4_unicode_ci,
  `assigned_at` datetime(3) DEFAULT NULL,
  `reviewed` tinyint(1) DEFAULT NULL,
  `score` bigint DEFAULT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci,
  `reviewed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blind_reviews` VALUES ('1', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '8', '7', '[229 176 143 229 155 155]', '2026-05-17 21:47:36.409 +0800 CST', '1', '88', '[230 149 153 229 173 166 232 174 190 232 174 161 229 144 136 231 144 134 239 188 140 229 134 133 229 174 185 232 175 166 229 174 158 239 188 140 233 128 187 232 190 145 230 184 133 230 153 176]', '2026-05-17 21:54:47.682 +0800 CST');
INSERT INTO `blind_reviews` VALUES ('2', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '6', '7', '[229 176 143 229 155 155]', '2026-05-17 21:47:36.409 +0800 CST', '0', '0', '[]', NULL);

-- 表: contest
DROP TABLE IF EXISTS `contest`;
CREATE TABLE `contest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contest` VALUES ('1', '[50 48 50 54 230 160 161 231 186 167 230 149 153 229 173 166 231 171 158 232 181 155]', '[50 48 50 54 45 48 52 45 48 49 32 126 32 50 48 50 54 45 48 52 45 50 48]', '[232 191 155 232 161 140 228 184 173]');

-- 表: contests
DROP TABLE IF EXISTS `contests`;
CREATE TABLE `contests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` longtext COLLATE utf8mb4_unicode_ci,
  `time` longtext COLLATE utf8mb4_unicode_ci,
  `status` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1778136006169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contests` VALUES ('2', '[49 49 49 49]', '[53 46 49 126 53 46 49 48]', '[232 191 155 232 161 140 228 184 173]');
INSERT INTO `contests` VALUES ('1778136006166', '[231 188 150 232 190 145]', '[53 46 49 126 53 46 49 48]', '[232 191 155 232 161 140 228 184 173]');
INSERT INTO `contests` VALUES ('1778136006167', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '[50 48 50 52 45 48 54 45 48 49]', '[232 191 155 232 161 140 228 184 173]');
INSERT INTO `contests` VALUES ('1778136006168', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '[50 48 50 52 45 48 54 45 48 49]', '[232 191 155 232 161 140 228 184 173]');

-- 表: operation_logs
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `username` longtext COLLATE utf8mb4_unicode_ci,
  `action` longtext COLLATE utf8mb4_unicode_ci,
  `module` longtext COLLATE utf8mb4_unicode_ci,
  `detail` longtext COLLATE utf8mb4_unicode_ci,
  `ip` longtext COLLATE utf8mb4_unicode_ci,
  `user_agent` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 表: plagiarism_checks
DROP TABLE IF EXISTS `plagiarism_checks`;
CREATE TABLE `plagiarism_checks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `signup_id` bigint unsigned DEFAULT NULL,
  `contest_title` longtext COLLATE utf8mb4_unicode_ci,
  `check_time` datetime(3) DEFAULT NULL,
  `similarity` double DEFAULT NULL,
  `status` longtext COLLATE utf8mb4_unicode_ci,
  `report` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `plagiarism_checks` VALUES ('1', '1', '[230 149 153 229 173 166 231 171 158 232 181 155]', '2026-05-15 10:30:00 +0800 CST', '15.5', '[99 111 109 112 108 101 116 101 100]', '[230 156 170 229 143 145 231 142 176 230 152 142 230 152 190 230 138 132 232 162 173 239 188 140 229 134 133 229 174 185 229 142 159 229 136 155 230 128 167 232 190 131 233 171 152]');
INSERT INTO `plagiarism_checks` VALUES ('2', '6', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '2026-05-16 14:20:00 +0800 CST', '45.8', '[99 111 109 112 108 101 116 101 100]', '[229 143 145 231 142 176 228 184 142 229 188 160 232 128 129 229 184 136 228 189 156 229 147 129 231 155 184 228 188 188 229 186 166 232 190 131 233 171 152 239 188 140 229 187 186 232 174 174 228 186 186 229 183 165 229 164 141 230 160 184]');
INSERT INTO `plagiarism_checks` VALUES ('3', '8', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '2026-05-16 14:25:00 +0800 CST', '52.3', '[99 111 109 112 108 101 116 101 100]', '[229 173 152 229 156 168 229 164 154 229 164 132 231 155 184 228 188 188 230 174 181 232 144 189 239 188 140 231 150 145 228 188 188 230 138 132 232 162 173]');
INSERT INTO `plagiarism_checks` VALUES ('4', '2', '[231 188 150 232 190 145]', '2026-05-17 09:00:00 +0800 CST', '0', '[99 111 109 112 108 101 116 101 100]', '[230 159 165 233 135 141 230 138 165 229 145 138 10 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 10 230 138 165 229 144 141 73 68 58 32 50 10 232 175 190 231 168 139 229 144 141 58 32 232 189 175 228 187 182 229 183 165 231 168 139 10 230 159 165 233 135 141 230 151 182 233 151 180 58 32 50 48 50 54 45 48 53 45 49 55 32 48 57 58 48 48 58 48 48 10 230 156 128 233 171 152 231 155 184 228 188 188 229 186 166 58 32 48 46 48 37 10 10 232 175 166 231 187 134 229 175 185 230 175 148 58 10]');
INSERT INTO `plagiarism_checks` VALUES ('5', '1', '[230 149 153 229 173 166 231 171 158 232 181 155]', '2026-05-20 13:28:53.878 +0800 CST', '0', '[99 111 109 112 108 101 116 101 100]', '[230 159 165 233 135 141 230 138 165 229 145 138 10 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 10 230 138 165 229 144 141 73 68 58 32 1 10 232 175 190 231 168 139 229 144 141 58 32 232 189 175 228 187 182 229 183 165 231 168 139 10 230 159 165 233 135 141 230 151 182 233 151 180 58 32 50 48 50 54 45 48 53 45 50 48 32 49 51 58 50 56 58 53 51 10 230 156 128 233 171 152 231 155 184 228 188 188 229 186 166 58 32 0 37 10 10 232 175 166 231 187 134 229 175 185 230 175 148 58 10]');

-- 表: plagiarism_results
DROP TABLE IF EXISTS `plagiarism_results`;
CREATE TABLE `plagiarism_results` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `check_id` bigint unsigned DEFAULT NULL,
  `target_signup_id` bigint unsigned DEFAULT NULL,
  `similarity` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `plagiarism_results` VALUES ('1', '1', '2', '8.2');
INSERT INTO `plagiarism_results` VALUES ('2', '1', '6', '12.3');
INSERT INTO `plagiarism_results` VALUES ('3', '1', '8', '15.5');
INSERT INTO `plagiarism_results` VALUES ('4', '2', '1', '22.1');
INSERT INTO `plagiarism_results` VALUES ('5', '2', '8', '45.8');
INSERT INTO `plagiarism_results` VALUES ('6', '3', '1', '18.6');
INSERT INTO `plagiarism_results` VALUES ('7', '3', '6', '52.3');
INSERT INTO `plagiarism_results` VALUES ('8', '3', '2', '35.2');

-- 表: review
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contest_title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 表: review_rounds
DROP TABLE IF EXISTS `review_rounds`;
CREATE TABLE `review_rounds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contest_title` longtext COLLATE utf8mb4_unicode_ci,
  `round_number` bigint DEFAULT NULL,
  `status` longtext COLLATE utf8mb4_unicode_ci,
  `start_time` datetime(3) DEFAULT NULL,
  `end_time` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `review_rounds` VALUES ('1', '[230 149 153 229 173 166 231 171 158 232 181 155]', '1', '[99 111 109 112 108 101 116 101 100]', '2026-05-01 09:00:00 +0800 CST', '2026-05-05 18:00:00 +0800 CST', '2026-04-30 10:00:00 +0800 CST');
INSERT INTO `review_rounds` VALUES ('2', '[230 149 153 229 173 166 231 171 158 232 181 155]', '2', '[111 110 103 111 105 110 103]', '2026-05-10 09:00:00 +0800 CST', '2026-05-15 18:00:00 +0800 CST', '2026-05-09 10:00:00 +0800 CST');
INSERT INTO `review_rounds` VALUES ('3', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '1', '[111 110 103 111 105 110 103]', '2026-05-20 09:00:00 +0800 CST', '2026-05-25 18:00:00 +0800 CST', '2026-05-17 10:00:00 +0800 CST');
INSERT INTO `review_rounds` VALUES ('4', '[230 149 153 229 173 166 231 171 158 232 181 155]', '3', '[112 101 110 100 105 110 103]', '2026-05-20 09:00:00 +0800 CST', '2026-05-25 18:00:00 +0800 CST', '2026-05-20 13:37:05.237 +0800 CST');

-- 表: reviews
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contest_title` longtext COLLATE utf8mb4_unicode_ci,
  `teacher_name` longtext COLLATE utf8mb4_unicode_ci,
  `course_name` longtext COLLATE utf8mb4_unicode_ci,
  `score` bigint DEFAULT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` VALUES ('1', '[230 149 153 229 173 166 231 171 158 232 181 155]', '[229 149 167 229 149 167 229 149 167]', '[232 189 175 228 187 182 229 183 165 231 168 139]', '90', '[232 191 152 232 161 140]');
INSERT INTO `reviews` VALUES ('2', '[231 188 150 232 190 145]', '[116 116]', '[232 189 175 228 187 182 229 183 165 231 168 139]', '81', '[121 121 121]');

-- 表: round_reviews
DROP TABLE IF EXISTS `round_reviews`;
CREATE TABLE `round_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `round_id` bigint unsigned DEFAULT NULL,
  `signup_id` bigint unsigned DEFAULT NULL,
  `reviewer_id` bigint unsigned DEFAULT NULL,
  `score` bigint DEFAULT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci,
  `status` longtext COLLATE utf8mb4_unicode_ci,
  `assigned_at` datetime(3) DEFAULT NULL,
  `reviewed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `round_reviews` VALUES ('1', '1', '1', '7', '85', '[230 149 153 229 173 166 232 174 190 232 174 161 229 144 136 231 144 134 239 188 140 229 134 133 229 174 185 228 184 176 229 175 140]', '[99 111 109 112 108 101 116 101 100]', '2026-05-01 09:00:00 +0800 CST', '2026-05-03 14:30:00 +0800 CST');
INSERT INTO `round_reviews` VALUES ('2', '1', '2', '7', '90', '[229 136 155 230 150 176 230 128 167 229 188 186 239 188 140 229 128 188 229 190 151 230 142 168 232 141 144]', '[99 111 109 112 108 101 116 101 100]', '2026-05-01 09:00:00 +0800 CST', '2026-05-04 10:00:00 +0800 CST');
INSERT INTO `round_reviews` VALUES ('3', '2', '1', '7', '88', '[231 172 172 228 186 140 232 189 174 232 175 132 229 174 161 233 128 154 232 191 135]', '[99 111 109 112 108 101 116 101 100]', '2026-05-10 09:00:00 +0800 CST', '2026-05-12 16:00:00 +0800 CST');
INSERT INTO `round_reviews` VALUES ('7', '2', '6', '7', '92', '[228 188 152 231 167 128 228 189 156 229 147 129 239 188 140 230 142 168 232 141 144 232 142 183 229 165 150]', '[99 111 109 112 108 101 116 101 100]', '2026-05-20 14:00:05.844 +0800 CST', '2026-05-20 14:01:23.802 +0800 CST');
INSERT INTO `round_reviews` VALUES ('8', '2', '8', '7', '0', '[]', '[112 101 110 100 105 110 103]', '2026-05-20 14:00:05.851 +0800 CST', NULL);

-- 表: sign_up
DROP TABLE IF EXISTS `sign_up`;
CREATE TABLE `sign_up` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contest_title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descr` text COLLATE utf8mb4_unicode_ci,
  `time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 表: sign_ups
DROP TABLE IF EXISTS `sign_ups`;
CREATE TABLE `sign_ups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contest_title` longtext COLLATE utf8mb4_unicode_ci,
  `teacher_name` longtext COLLATE utf8mb4_unicode_ci,
  `unit` longtext COLLATE utf8mb4_unicode_ci,
  `phone` longtext COLLATE utf8mb4_unicode_ci,
  `course_name` longtext COLLATE utf8mb4_unicode_ci,
  `grade` longtext COLLATE utf8mb4_unicode_ci,
  `desc` longtext COLLATE utf8mb4_unicode_ci,
  `time` longtext COLLATE utf8mb4_unicode_ci,
  `attachment` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sign_ups` VALUES ('1', '[230 149 153 229 173 166 231 171 158 232 181 155]', '[229 149 167 229 149 167 229 149 167]', '[230 177 159 232 165 191 232 180 162 231 187 143 229 164 167 229 173 166]', '[49 56 49 55 57 49 56 53 54 56 52]', '[232 189 175 228 187 182 229 183 165 231 168 139]', '[229 164 167 228 184 128]', '[49 49 49]', '[50 48 50 54 45 48 53 45 48 55]', NULL);
INSERT INTO `sign_ups` VALUES ('2', '[231 188 150 232 190 145]', '[116 116]', '[116 116 116]', '[49 49 49]', '[232 189 175 228 187 182 229 183 165 231 168 139]', '[229 164 167 228 184 128]', '[119 119 119]', '[50 48 50 54 45 48 53 45 48 55]', NULL);
INSERT INTO `sign_ups` VALUES ('3', '[]', '[119 119]', '[230 177 159 232 165 191 232 180 162 231 187 143 229 164 167 229 173 166]', '[49]', '[49]', '[229 164 167 228 184 128]', '[49]', '[50 48 50 54 45 48 53 45 49 51]', NULL);
INSERT INTO `sign_ups` VALUES ('6', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '[229 188 160 232 128 129 229 184 136]', '[230 149 176 229 173 166 229 173 166 233 153 162]', '[49 51 56 48 48 49 51 56 48 48 48]', '[233 171 152 231 173 137 230 149 176 229 173 166]', '[229 164 167 228 184 137]', '[230 149 153 229 173 166 230 150 185 230 161 136 232 174 190 232 174 161 46 46 46]', '[50 48 50 54 45 48 53 45 49 52]', NULL);
INSERT INTO `sign_ups` VALUES ('8', '[50 48 50 52 229 185 180 229 186 166 230 149 153 229 173 166 231 171 158 232 181 155]', '[231 140 170 232 128 129 229 184 136]', '[232 189 175 228 187 182 229 173 166 233 153 162]', '[49 51 56 48 48 49 51 56 48 48 49]', '[233 171 152 231 173 137 230 149 176 229 173 166]', '[229 164 167 228 184 137]', '[230 149 153 229 173 166 230 150 185 230 161 136 232 174 190 232 174 161 46 46 46]', '[50 48 50 54 45 48 53 45 49 51]', NULL);

-- 表: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` VALUES ('1', '[97 100 109 105 110]', '[97 100 109 105 110 49 50 51]', '[97 100 109 105 110]', '[231 179 187 231 187 159 231 174 161 231 144 134 229 145 152]');

-- 表: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '账号',
  `password` longtext COLLATE utf8mb4_unicode_ci,
  `role` longtext COLLATE utf8mb4_unicode_ci,
  `name` longtext COLLATE utf8mb4_unicode_ci,
  `avatar` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` VALUES ('6', '[97 100 109 105 110]', '[49 50 51 52 53 54]', '[97 100 109 105 110]', '[97 100 109 105 110]', NULL);
INSERT INTO `users` VALUES ('7', '[229 176 143 229 155 155]', '[49 50 51 52 53 54]', '[114 101 118 105 101 119 101 114]', '[229 176 143 229 155 155]', NULL);
INSERT INTO `users` VALUES ('8', '[229 149 167 229 149 167 229 149 167]', '[49 50 51 52 53 54]', '[116 101 97 99 104 101 114]', '[229 149 167 229 149 167 229 149 167]', NULL);
INSERT INTO `users` VALUES ('11', '[119 119]', '[49 50 51 52 53 54]', '[116 101 97 99 104 101 114]', '[119 119]', NULL);

