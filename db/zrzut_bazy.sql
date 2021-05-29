-- --------------------------------------------------------
-- Host:                         192.168.0.40
-- Wersja serwera:               10.3.27-MariaDB-0+deb10u1 - Debian 10
-- Serwer OS:                    debian-linux-gnueabihf
-- HeidiSQL Wersja:              9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Zrzut struktury bazy danych alerts
CREATE DATABASE IF NOT EXISTS `alerts` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `alerts`;

-- Zrzut struktury tabela alerts.symbols_observed
CREATE TABLE IF NOT EXISTS `symbols_observed` (
  `symbol` char(20) NOT NULL,
  PRIMARY KEY (`symbol`),
  UNIQUE KEY `symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Zrzucanie danych dla tabeli alerts.symbols_observed: ~27 rows (około)
/*!40000 ALTER TABLE `symbols_observed` DISABLE KEYS */;
INSERT IGNORE INTO `symbols_observed` (`symbol`) VALUES
	('1INCHUSDT'),
	('ADAUSDT'),
	('ATOMUSDT'),
	('BANDUSDT'),
	('BNBUSDT'),
	('BTCUSDT'),
	('CELRUSDT'),
	('CHZUSDT'),
	('CKBUSDT'),
	('COCOSUSDT'),
	('COSUSDT'),
	('COTIUSDT'),
	('DOCKUSDT'),
	('DODOUSDT'),
	('DUSKUSDT'),
	('ETHUSDT'),
	('IOTAUSDT'),
	('KEYUSDT'),
	('LINKUSDT'),
	('LITUSDT'),
	('LSKUSDT'),
	('NANOUSDT'),
	('NEOUSDT'),
	('REEFUSDT'),
	('SFPUSDT'),
	('TOMOUSDT'),
	('UNIUSDT'),
	('XEMUSDT'),
	('XLMUSDT');
/*!40000 ALTER TABLE `symbols_observed` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
