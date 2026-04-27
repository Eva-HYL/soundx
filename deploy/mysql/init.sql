-- MySQL 容器首次启动时自动执行。只在数据卷为空时触发，后续重启不会再跑。
-- 做的事：
--   1. 确保 UTF8MB4 字符集
--   2. 预建 soundx 库（docker-compose 的 MYSQL_DATABASE 已经会建，这里 ALTER 一下以统一字符集）
--   3. 预建一个非 root 的应用账号 soundx_app（生产环境别用 root 连）

CREATE DATABASE IF NOT EXISTS `soundx`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

ALTER DATABASE `soundx` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 应用账号：密码请在外部改掉。init.sql 只在首次启动生效。
CREATE USER IF NOT EXISTS 'soundx_app'@'%' IDENTIFIED BY 'soundx_app_change_me';
GRANT ALL PRIVILEGES ON `soundx`.* TO 'soundx_app'@'%';
FLUSH PRIVILEGES;
