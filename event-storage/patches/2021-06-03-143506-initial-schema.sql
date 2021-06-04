CREATE TABLE `events` (
      `event_id` CHAR(32) NOT NULL,
      `event_name` VARCHAR(100) NOT NULL,
      `event_time` TIMESTAMP NOT NULL,
      `event_severity` VARCHAR(50) NOT NULL,
      `object_type` VARCHAR(50) NOT NULL,
      `object_name` VARCHAR(50) NOT NULL,
      PRIMARY KEY (`event_id`) USING BTREE,
      INDEX `event_time` (`event_time`) USING BTREE,
      INDEX `event_severity` (`event_severity`) USING BTREE,
      INDEX `object_type` (`object_type`) USING BTREE,
      INDEX `object_name` (`object_name`) USING BTREE,
      INDEX `event_name` (`event_name`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
