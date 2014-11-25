/*
 * INTER-Mediator
 * by Masayuki Nii  msyk@msyk.net Copyright (c) 2011 Masayuki Nii, All rights reserved.
 * 
 * This project started at the end of 2009.
 * 

This schema file is for the sample of INTER-Mediator using MySQL, encoded by UTF-8.

Example:
$ mysql -u root -p < sample_schema_mysql.txt
Enter password: 

*/
SET NAMES 'utf8';

/***************************** ATTENTION *****************************
 * If you execute this schema twice or more, remove # of the following 'DROP USER' line.
 *********************************************************************/
DROP USER 'web_survey'@'localhost';

# The password of the db user is faked when this file is uploaded to the repogitory.

CREATE USER 'web_survey'@'localhost' IDENTIFIED BY 'xxxxxx';

DROP DATABASE IF EXISTS survey_db;
CREATE DATABASE survey_db
	CHARACTER SET utf8
	COLLATE utf8_unicode_ci;
USE survey_db;

GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE survey_db.* TO 'web_survey'@'localhost';

CREATE TABLE progress   (
	id					INT  AUTO_INCREMENT,
	username			VARCHAR(48),
    page                INT,
    startdt             DATETIME,
    finishdt            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status              INT,
    earn                INT,
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;
ALTER TABLE progress CHANGE COLUMN startdt startdt DATETIME;
ALTER TABLE progress CHANGE COLUMN finishdt  finishdt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

DROP VIEW IF EXISTS progressdata;
CREATE VIEW progressdata AS
SELECT username,page,startdt,finishdt,TIME_TO_SEC(TIMEDIFF(finishdt, startdt)) as length, status, earn from progress;

DROP VIEW IF EXISTS studytimesummary;
CREATE VIEW studytimesummary AS
  SELECT username, sum(length), avg(status) from progressdata where page >=1 and page <=10 group by username;
CREATE VIEW examtimesummary AS
  SELECT username, sum(length) from progressdata where page >=101 and page <=108 group by username;

CREATE TABLE answer   (
	id					INT  AUTO_INCREMENT,
	username			VARCHAR(48),
    qnum    INT,
    subnum    INT,
    subsubnum    INT,
    answer1     INT,
    answer2     INT,
    answer3     INT,
    answer4     INT,
    answer5     INT,
    answer6     INT,
    answer7     INT,
    answer8     INT,
    answer9     INT,
    answertext1     TEXT,
    answertext2     TEXT,
    answertext3     TEXT,
    answertext4     TEXT,
    answertext5     TEXT,
    answertext6     TEXT,
    answertext7     TEXT,
    answertext8     TEXT,
	answertext9     TEXT,
	answertext10     TEXT,
	answertext11     TEXT,
	answertext12     TEXT,
	answertext13     TEXT,
	answertext14     TEXT,
	answertext15     TEXT,
	answertext16     TEXT,
	answertext17     TEXT,
	answertext18     TEXT,
    PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

INSERT INTO answer(username,qnum) VALUES("user03",1);
INSERT INTO answer(username,qnum) VALUES("user03",2);
INSERT INTO answer(username,qnum) VALUES("user03",3);
INSERT INTO answer(username,qnum) VALUES("user03",4);
INSERT INTO answer(username,qnum) VALUES("user03",5);
INSERT INTO answer(username,qnum) VALUES("user03",6);
INSERT INTO answer(username,qnum) VALUES("user03",7);
INSERT INTO answer(username,qnum) VALUES("user03",8);
INSERT INTO answer(username,qnum) VALUES("user03",9);
INSERT INTO answer(username,qnum) VALUES("user03",10);
INSERT INTO answer(username,qnum) VALUES("user03",11);
INSERT INTO answer(username,qnum) VALUES("user03",201);

# ALTER TABLE answer ADD COLUMN answertext6     TEXT,

CREATE TABLE survey   (
	id					INT  AUTO_INCREMENT,
	username			VARCHAR(48),
    qnum    INT,
    subnum    INT,
    subsubnum    INT,
    answer1     INT,
    answer2     INT,
    answer3     INT,
    answer4     INT,
    answer5     INT,
    answer6     INT,
    answer7     INT,
    answer8     INT,
    answer9     INT,
    answertext1     TEXT,
    answertext2     TEXT,
    answertext3     TEXT,
    answertext4     TEXT,
    answertext5     TEXT,
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

#
#

CREATE TABLE skyscraper (
 id INT  AUTO_INCREMENT,
 name TEXT,
 height NUMERIC(8,2),
 kind TEXT,
 PRIMARY KEY(id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
INSERT INTO skyscraper(id,name,height,kind) VALUE(101,"東京スカイツリー",634.0,"タワー");
INSERT INTO skyscraper(id,name,height,kind) VALUE(102,"東京タワー",332.6,"タワー");
INSERT INTO skyscraper(id,name,height,kind) VALUE(201,"あべのハルカス",300.0,"ビル建設中");
INSERT INTO skyscraper(id,name,height,kind) VALUE(202,"横浜ランドマークタワー",295.8,"ビル");
INSERT INTO skyscraper(id,name,height,kind) VALUE(203,"りんくうゲートタワービル",256.1,"ビル");
INSERT INTO skyscraper(id,name,height,kind) VALUE(204,"大阪府咲洲庁舎",256.0,"ビル");


CREATE TABLE tower (
 id INT  AUTO_INCREMENT,
 name TEXT,
 PRIMARY KEY(id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
INSERT INTO tower(id,name) VALUE(101,"東京スカイツリー");
INSERT INTO tower(id,name) VALUE(102,"東京タワー");
INSERT INTO tower(id,name) VALUE(103,"通天閣");


CREATE TABLE structure (
 id INT  AUTO_INCREMENT,
 name TEXT,
 height NUMERIC(8,2),
 kind_id INT,
 constructing INT,
 backcolor TEXT,
 prefecture TEXT,
 PRIMARY KEY(id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
INSERT INTO structure(id,name,height,kind_id,backcolor,prefecture) VALUE(101,"東京スカイツリー",634.0,501,"#DDDDDD","東京都");
INSERT INTO structure(id,name,height,kind_id,backcolor,prefecture) VALUE(102,"東京タワー",332.6,501,"#FFDDFF","東京都");
INSERT INTO structure(id,name,height,kind_id,constructing,backcolor,prefecture) VALUE(201,"あべのハルカス",300.0,502,1,"#DDFFFF","大阪府");
INSERT INTO structure(id,name,height,kind_id,backcolor,prefecture) VALUE(202,"横浜ランドマークタワー",295.8,502,"#FFFFDD","神奈川県");
INSERT INTO structure(id,name,height,kind_id,backcolor,prefecture) VALUE(203,"りんくうゲートタワービル",256.1,502,"#DDFFDD","大阪府");
INSERT INTO structure(id,name,height,kind_id,backcolor,prefecture) VALUE(204,"大阪府咲洲庁舎",256.0,502,"#DDDDFF","大阪府");
CREATE TABLE kind (
 id INT  AUTO_INCREMENT,
 kind_name TEXT,
 PRIMARY KEY(id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
INSERT INTO kind(id,kind_name) VALUE(501,"タワー");
INSERT INTO kind(id,kind_name) VALUE(502,"ビル");


CREATE TABLE station (
 station_id INT  AUTO_INCREMENT,
 station_name TEXT,
 PRIMARY KEY(station_id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
CREATE TABLE chain (
 chain_id INT  AUTO_INCREMENT,
 chain_name TEXT,
 PRIMARY KEY(chain_id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
CREATE TABLE association (
 id INT  AUTO_INCREMENT,
 station_id INT,
 chain_id INT,
 PRIMARY KEY(id)
)  CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
INSERT INTO station(station_id,station_name) VALUE(101,"東川口");
INSERT INTO station(station_id,station_name) VALUE(102,"北朝霞");
INSERT INTO station(station_id,station_name) VALUE(103,"東松戸");
INSERT INTO station(station_id,station_name) VALUE(104,"北府中");
INSERT INTO chain(chain_id,chain_name) VALUE(501,"マクドナルド");
INSERT INTO chain(chain_id,chain_name) VALUE(502,"モスバーガー");
INSERT INTO chain(chain_id,chain_name) VALUE(503,"スターバックス");
INSERT INTO chain(chain_id,chain_name) VALUE(504,"ドトールコーヒー");
INSERT INTO association(id,station_id,chain_id) VALUE(1,101,501);
INSERT INTO association(id,station_id,chain_id) VALUE(2,101,502);
INSERT INTO association(id,station_id,chain_id) VALUE(3,102,501);
INSERT INTO association(id,station_id,chain_id) VALUE(4,102,503);
INSERT INTO association(id,station_id,chain_id) VALUE(5,102,504);
INSERT INTO association(id,station_id,chain_id) VALUE(6,103,501);
INSERT INTO association(id,station_id,chain_id) VALUE(7,103,502);
INSERT INTO association(id,station_id,chain_id) VALUE(8,103,504);


CREATE TABLE connection (
 id     INT  AUTO_INCREMENT,
 cname   TEXT,
 PRIMARY KEY(id)
) CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
CREATE TABLE address (
 id     INT  AUTO_INCREMENT,
 pname   TEXT,
 tel   TEXT,
 con_id INT,
 PRIMARY KEY(id)
) CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;
CREATE TABLE contact (
 id     INT  AUTO_INCREMENT,
 address_id INT,
 dt   DATETIME,
 memo   TEXT,
 PRIMARY KEY(id)
) CHARACTER SET utf8,COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO connection(id,cname) VALUE(1,"親戚");
INSERT INTO connection(id,cname) VALUE(2,"友人");
INSERT INTO connection(id,cname) VALUE(3,"会社関係");
INSERT INTO address(id,pname,tel,con_id) VALUE(1,"山田一郎","0123-456-9876",1);
INSERT INTO address(id,pname,tel,con_id) VALUE(2,"風下寒子","0123-456-9876",3);
INSERT INTO address(id,pname,tel,con_id) VALUE(3,"屋根裏夫","0123-456-9876",1);
INSERT INTO contact(id,address_id,dt,memo) VALUE(1,2,"2013-9-12 10:00:00","電話したが不在");
INSERT INTO contact(id,address_id,dt,memo) VALUE(2,3,"2013-9-14 14:00:00","メールで展示会の案内をした");
INSERT INTO contact(id,address_id,dt,memo) VALUE(3,2,"2013-9-15 17:00:00","電話で展示会の案内をした");
INSERT INTO contact(id,address_id,dt,memo) VALUE(4,1,"2013-9-16 13:00:00","訪問して商品説明した");

#  The schema for the "Sample_form" and "Sample_Auth" sample set.
#
#

CREATE TABLE authuser (
	id					INT  AUTO_INCREMENT,
	username			VARCHAR(48),
	hashedpasswd		VARCHAR(48),
	email               VARCHAR(100),
	initialpass         VARCHAR(20),
	active  INT,
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

#ALTER TABLE authuser ADD COLUMN active  INT;
UPDATE authuser SET active=1 WHERE id=1003;
UPDATE authuser SET active=1 WHERE id=1007;
UPDATE authuser SET active=1 WHERE id=1006;
UPDATE authuser SET active=1 WHERE id=1051;
UPDATE authuser SET active=1 WHERE id=1052;
UPDATE authuser SET active=1 WHERE id=1053;
UPDATE authuser SET active=1 WHERE id=1054;
UPDATE authuser SET active=1 WHERE id=1055;
UPDATE authuser SET active=1 WHERE id=1056;
UPDATE authuser SET active=1 WHERE id=1010;
UPDATE authuser SET active=1 WHERE id=1011;
UPDATE authuser SET active=1 WHERE id=1012;
UPDATE authuser SET active=1 WHERE id=1013;
UPDATE authuser SET active=1 WHERE id=1014;
UPDATE authuser SET active=1 WHERE id=1015;
UPDATE authuser SET active=1 WHERE id=1016;
UPDATE authuser SET active=1 WHERE id=1017;
UPDATE authuser SET active=1 WHERE id=1018;
UPDATE authuser SET active=1 WHERE id=1019;
UPDATE authuser SET active=1 WHERE id=1020;

DROP VIEW IF EXISTS answer_use;
CREATE VIEW answer_use AS
  SELECT answer.*,authuser.active as active, case authuser.active when 2 then '#FFFFAA' when 9 then '#AAFFFF' else '#FFFFFF' end as backcolor
  from answer,authuser
  WHERE answer.username=authuser.username;


# The user1 has the password 'user1'. It's salted with the string 'TEXT'.
# All users have the password the same as user name. All are salted with 'TEXT'
# The following command lines are used to generate above hashed-hexed-password.
#
#  $ echo -n 'user1TEST' | openssl sha1 -sha1
#  d83eefa0a9bd7190c94e7911688503737a99db01
#  echo -n 'TEST' | xxd -ps
#  54455354
#  - combine above two results:
#  d83eefa0a9bd7190c94e7911688503737a99db0154455354

CREATE TABLE authgroup (
	id					INT  AUTO_INCREMENT,
	groupname			VARCHAR(48),
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

CREATE TABLE authcor (
	id					INT  AUTO_INCREMENT,
	user_id             INT,
	group_id            INT,
	dest_group_id             INT,
	privname			VARCHAR(48),
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

CREATE TABLE issuedhash (
	id				INT  AUTO_INCREMENT,
	user_id         INT,
	clienthost      VARCHAR(48),
	hash            VARCHAR(48),
	expired			DateTime,
	PRIMARY KEY(id)
)		CHARACTER SET utf8,
		COLLATE utf8_unicode_ci
		ENGINE=InnoDB;

INSERT INTO authgroup(id,groupname) VALUE(501,'admin');
INSERT INTO authgroup(id,groupname) VALUE(502,'examinee');
INSERT INTO authcor(user_id,dest_group_id) VALUES(1001,501);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1002,501);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1003,501);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1004,501);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1005,501);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1001,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1002,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1003,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1004,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1005,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1006,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1007,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1008,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1009,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1010,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1011,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1012,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1013,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1014,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1015,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1016,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1017,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1018,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1019,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1020,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1021,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1022,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1023,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1024,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1025,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1026,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1027,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1028,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1029,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1030,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1031,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1032,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1033,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1034,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1035,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1036,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1037,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1038,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1039,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1040,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1041,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1042,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1043,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1044,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1045,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1046,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1047,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1048,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1049,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1050,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1051,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1052,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1053,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1054,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1055,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1056,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1057,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1058,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1059,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1060,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1061,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1062,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1063,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1064,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1065,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1066,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1067,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1068,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1069,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1070,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1071,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1072,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1073,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1074,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1075,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1076,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1077,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1078,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1079,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1080,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1081,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1082,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1083,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1084,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1085,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1086,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1087,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1088,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1089,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1090,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1091,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1092,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1093,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1094,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1095,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1096,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1097,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1098,502);
INSERT INTO authcor(user_id,dest_group_id) VALUES(1099,502);

# Every initial password is faked when this file is uploaded to the repogitory.

INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1001,'user01', 'qqqqqqqq', '7fe26583113c2187f909ca082009c4de1d2481194e255a31');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1002,'user02', 'qqqqqqqq', '3a4885139fe26ecf1bcba370c03abc2ae074f673613f754b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1003,'user03', 'qqqqqqqq', '2651296397ffbf7a2def3e8ddd62f5eff150df775d346a47');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1004,'user04', 'qqqqqqqq', '33db55054ac4a5c2f100c5d26dd74e7531bd97f7784e255b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1005,'user05', 'qqqqqqqq', '185d8541fe68f09b971afdd31513f4bf3f716b892c62386e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1006,'user06', 'qqqqqqqq', '910080b9d1136638367c8115c28b41ed1f2fb41f477c5329');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1007,'user07', 'qqqqqqqq', '03d74d73915269179a3f97da932afeb96af1038343784f25');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1008,'user08', 'qqqqqqqq', '0fcd96f4d265852f05afac713ea83bb4f42d6018562d6239');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1009,'user09', 'qqqqqqqq', '39059153105352b21854b7abab6cfe137749bd4f70477d53');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1010,'user10', 'qqqqqqqq', '72ebac0f7248bf34c2a942a5475d4bc1128787ce255a3166');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1011,'user11', 'qqqqqqqq', '03ea036b75bd17e30ae074a8b23b3ffe8f6b6e85683f754b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1012,'user12', 'qqqqqqqq', '40b27d013510cba699968f4edc038d9af3ec0af5643b7147');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1013,'user13', 'qqqqqqqq', '2d04ade418262613a8224c284d35731419542f71784e255b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1014,'user14', 'qqqqqqqq', '1a3c68a93b57461dfefdfa984945c72676a9b6c333693f75');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1015,'user15', 'qqqqqqqq', '5a954afe041aa698ed1aa34c632c39f36bdfabeb477c5329');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1016,'user16', 'qqqqqqqq', '7aa966354fef63c7363fc84422dd569f3464db6f61376d44');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1017,'user17', 'qqqqqqqq', 'bfdd6a031c96e9ce605a787f4cdab5d2a04dcaa056346940');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1018,'user18', 'qqqqqqqq', '8672db00c392a1bb4f0e4e6a2d9d83fab079851070477d53');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1019,'user19', 'qqqqqqqq', '026efa015ae7f74be21297261bd2922a77b3e30b255a316d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1020,'user20', 'qqqqqqqq', 'a8d841f77cb9490dce064ee6867456e1e6659cc23f754b22');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1021,'user21', 'qqqqqqqq', '94e0a31a25edd81c7be3fa3d5e94adaa207e525c52295f35');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1022,'user22', 'qqqqqqqq', '3c7a166240f2a88375025bd87601f080bfd95ad84e255b31');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1023,'user23', 'qqqqqqqq', '419313714aa0a7fc41ef0b6119465ea2ed875e82693f754c');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1024,'user24', 'qqqqqqqq', '4c3a1ce5771bf2757353fc1024cea6199659a1297c53295f');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1025,'user25', 'qqqqqqqq', '8c3561df579987b90222ea5c9ffc7ff53b1eb7d9376d4479');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1026,'user26', 'qqqqqqqq', '976f42301592a21907975b33048c308c1ad7558d34694075');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1027,'user27', 'qqqqqqqq', 'e70de37fd9689941d13d615e392c54f9c64ca725477d532a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1028,'user28', 'qqqqqqqq', '3206063a649cb28b6e9b75ce8203f6aeaa3ec9a861386d44');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1029,'user29', 'qqqqqqqq', 'b894b927e6ef4e1035ed025db43b46e2b5250d4b754b2257');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1030,'user30', 'qqqqqqqq', '39fb1ffa28086221a3c14725e3fe143027265c1e30663c72');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1031,'user31', 'qqqqqqqq', 'f66c27eab4e31378011148a69d0f57e5e26b40542c62386e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1032,'user32', 'qqqqqqqq', 'e040fe34a9e23d08c59248531331b32cb1aa9372285e346a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1033,'user33', 'qqqqqqqq', '670c68e89eaaa2b6a83f3a0d30f9867626a23d6e3b71487d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1034,'user34', 'qqqqqqqq', '7441b0298587ce140b622ba3359d32911ba35cec4f2c6239');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1035,'user35', 'qqqqqqqq', '898f8bb28154defd656a7c3ccbe04934747fb8e46940754c');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1036,'user36', 'qqqqqqqq', 'd5ba7183006c802bc289b1dbf380f701524916ef653c7148');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1037,'user37', 'qqqqqqqq', '00dc89b82709d37bcf3d97685b4b326af23336bb794f265b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1038,'user38', 'qqqqqqqq', '2e4ca7b18c9ac667c1cd93fd28cf5edbc1424e4e346a4076');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1039,'user39', 'qqqqqqqq', '165e7032cd3e12aae09bfb3899f28ba637516cfd477d542a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1040,'user40', 'qqqqqqqq', 'c721d792e4e231a2f01711eb489cf684f24a68b843795026');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1041,'user41', 'qqqqqqqq', 'b51758416d56a29d90613d2d9108d3ebee90a4a95e346a41');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1042,'user42', 'qqqqqqqq', '81ecc0ca8a1420db57a2bc23da6106d4752ea0bf71487d54');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1043,'user43', 'qqqqqqqq', 'eac118b4dec48818798faf0178e7006f22aad6092c62396e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1044,'user44', 'qqqqqqqq', '20186a7d22653251494c5d19db166baa7681264152285e35');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1045,'user45', 'qqqqqqqq', '647d8487e5db4760679922927eb2f4b4863ac0be4e255a31');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1046,'user46', 'qqqqqqqq', '1a11b1f12e009e8150c0a20ad5dffed3c716931e61386d44');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1047,'user47', 'qqqqqqqq', 'ee946fe1096758c263d46dbaaec28db9d4618feb7c52295e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1048,'user48', 'qqqqqqqq', '42838c33c51f8cd432f29350bd5f193b2134f7f330663c72');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1049,'user49', 'qqqqqqqq', 'be407391244e064ccc3554ebe8663f8ae75a95a54321572d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1050,'user50', 'qqqqqqqq', '312d2c45efa196c6ca7f99b86d019c4b8f2f716b3f755329');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1051,'user51', 'qqqqqqqq', 'b2a8e2a1819080985ef8bee83f16ad457b085e1d5a30663d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1052,'user52', 'qqqqqqqq', '08e81a305a1e7628f105a914b900047b7c344390562c6239');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1053,'user53', 'qqqqqqqq', '302bbabdd8b4ed6956a0390f3fd0a00c4f47130752285e4c');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1054,'user54', 'qqqqqqqq', 'f0ff948640f1d8c34e26b9c807ee007671deb93d4e255a31');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1055,'user55', 'qqqqqqqq', '73b45a098041511ee0ac0e86674e2241289ef43e61386d44');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1056,'user56', 'qqqqqqqq', '01d5fa78d8bc4a04a4fdfd314e549e27e048b10f7c52295e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1057,'user57', 'qqqqqqqq', '4f793a6799b9e961ceb85f6a9051f41160b40cf930663c72');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1058,'user58', 'qqqqqqqq', '3c4e5b55a222c15599b90ca7f8fb69a639b071a0744a2157');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1059,'user59', 'qqqqqqqq', '0986962f3da37b6d0cbcb7ccdcc02a11492ba5bd70467c53');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1060,'user60', 'qqqqqqqq', 'c33c9a10c4813c308896739c034a3e7c52b51333245a3066');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1061,'user61', 'qqqqqqqq', '6f21791455b373acd5bee412b9bf5bc5129f20983f744b21');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1062,'user62', 'qqqqqqqq', 'bab363a2c36a7f3e98d1ef5a8f3d2d03b089135452285e35');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1063,'user63', 'qqqqqqqq', 'ef6a2d0ece73bc6e6ac3a32025220cff383dc1a94e255a31');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1064,'user64', 'qqqqqqqq', '25552bc2fe01cee8214b48759fdfa8d1b8f1039e613f744b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1065,'user65', 'qqqqqqqq', '80dd51a7222b51d5eadcdcf073a4685264e41c447c52295e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1066,'user66', 'qqqqqqqq', '354e8bdd1ddfd3009b20996d666dbff37d7c288a30663c79');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1067,'user67', 'qqqqqqqq', '46d5ddc849cbc3fb392ac97aea8a2383616298c14a21572d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1068,'user68', 'qqqqqqqq', '046a26f74f98979bd52ebdd575573aee09d82320467c5329');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1069,'user69', 'qqqqqqqq', '3b5d37ef42b5f3d11f76d0103703b49aeedde0c15a30663d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1070,'user70', 'qqqqqqqq', '2be040799adaa2dd19eb0fb26658d8d37e6ccf55744b2157');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1071,'user71', 'qqqqqqqq', '2cd1735df99d0847c058f96bb18d71cf9809237a285e356a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1072,'user72', 'qqqqqqqq', 'fe7fd9bbb987fdb44bdd99a35ce213bccb058062255a3166');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1073,'user73', 'qqqqqqqq', 'cdca3a24134a1e6c676f7eb78abeb92f65b11d6b3f744b22');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1074,'user74', 'qqqqqqqq', 'b8cb75a909dfb08f950c95c7042d8c98cc6f18a552295e35');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1075,'user75', 'qqqqqqqq', 'e92a54c641b2180dc1cfc2401bbf93f6b1fb5a326d43794f');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1076,'user76', 'qqqqqqqq', '288176b723f699aa4f9fd964bb4ba230abf80fa921572d63');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1077,'user77', 'qqqqqqqq', '9ea004f5d402e50132fd1b3821da13628c3642557c53295f');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1078,'user78', 'qqqqqqqq', '6d5f2bb575f38af14a1b0bdf37037ee235ae9e63784f255b');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1079,'user79', 'qqqqqqqq', 'cb37ac67ec38737b46ae4e5c22a4f9683be7691333694075');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1080,'user80', 'qqqqqqqq', '92ceaba61d39e905336850718271f026881c4818477c532a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1081,'user81', 'qqqqqqqq', '243097feca0b638385e072e85dfdae6c1216a03f43784f26');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1082,'user82', 'qqqqqqqq', '91f5d7e3e3d160b9ff9183df59929226cb11e33f562d6240');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1083,'user83', 'qqqqqqqq', 'a53a8a0634c0105a9840d4ab4e56ed584432362071477d53');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1084,'user84', 'qqqqqqqq', 'efc0ec24af72dcf6ee7cd06fd79f8637643320bb255b3167');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1085,'user85', 'qqqqqqqq', 'b242a27b55bd1eac20384a973945163fce55af6221572d63');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1086,'user86', 'qqqqqqqq', '2bd36f93bddf526f69ed1c02c01bb729d9f3e9d03b71487d');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1087,'user87', 'qqqqqqqq', '4ee3c937c7d35de0a9f754ff26c39964307a062b4f255b32');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1088,'user88', 'qqqqqqqq', 'af4b3a51b2c29c33b2d9f319203df2c49312221a6940754c');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1089,'user89', 'qqqqqqqq', '12c2466074d005586da3e804554c7275172e5551477c532a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1090,'user90', 'qqqqqqqq', '9e18869594d7b48a1c44728ed3deca2e9d85e50572497e55');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1091,'user91', 'qqqqqqqq', 'e84888964081692da273bbd2d8930a85552c78fc6d447950');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1092,'user92', 'qqqqqqqq', '2076a42271da7dcfdeb6979676f519522e7061ec21572e63');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1093,'user93', 'qqqqqqqq', '79b02de80624dede586dfb44048a985ed89239483c71487e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1094,'user94', 'qqqqqqqq', '5174f1b0c97d8a32398148bd6130866f5714facc386d447a');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1095,'user95', 'qqqqqqqq', '00d9f3dcf9a4189defcf4600c20437f1c7f2ae8a4b22572e');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1096,'user96', 'qqqqqqqq', '136047b0be0ed0aaf37d4482e2aff22802a859fd653c7248');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1097,'user97', 'qqqqqqqq', 'a1c1b94cd9706d7a58ebd80b575af2d1cec0740b794f265c');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1098,'user98', 'qqqqqqqq', '4b6466732abd111afb6a210d4be79c870e5bb94e346a4076');
INSERT INTO authuser(id,username,initialpass,hashedpasswd) VALUES(1099,'user99', 'qqqqqqqq', '1ce40d4f122b9a93a98fcbe2022a0dca6ca412f630663c72');



INSERT INTO answer(username,qnum) VALUES("user01",1);
INSERT INTO answer(username,qnum) VALUES("user01",2);
INSERT INTO answer(username,qnum) VALUES("user01",3);
INSERT INTO answer(username,qnum) VALUES("user01",4);
INSERT INTO answer(username,qnum) VALUES("user01",5);
INSERT INTO answer(username,qnum) VALUES("user01",6);
INSERT INTO answer(username,qnum) VALUES("user01",7);
INSERT INTO answer(username,qnum) VALUES("user01",8);
INSERT INTO answer(username,qnum) VALUES("user01",9);
INSERT INTO answer(username,qnum) VALUES("user01",10);
INSERT INTO answer(username,qnum) VALUES("user01",11);
INSERT INTO answer(username,qnum) VALUES("user01",201);
INSERT INTO answer(username,qnum) VALUES("user02",1);
INSERT INTO answer(username,qnum) VALUES("user02",2);
INSERT INTO answer(username,qnum) VALUES("user02",3);
INSERT INTO answer(username,qnum) VALUES("user02",4);
INSERT INTO answer(username,qnum) VALUES("user02",5);
INSERT INTO answer(username,qnum) VALUES("user02",6);
INSERT INTO answer(username,qnum) VALUES("user02",7);
INSERT INTO answer(username,qnum) VALUES("user02",8);
INSERT INTO answer(username,qnum) VALUES("user02",9);
INSERT INTO answer(username,qnum) VALUES("user02",10);
INSERT INTO answer(username,qnum) VALUES("user02",11);
INSERT INTO answer(username,qnum) VALUES("user02",201);
INSERT INTO answer(username,qnum) VALUES("user04",1);
INSERT INTO answer(username,qnum) VALUES("user04",2);
INSERT INTO answer(username,qnum) VALUES("user04",3);
INSERT INTO answer(username,qnum) VALUES("user04",4);
INSERT INTO answer(username,qnum) VALUES("user04",5);
INSERT INTO answer(username,qnum) VALUES("user04",6);
INSERT INTO answer(username,qnum) VALUES("user04",7);
INSERT INTO answer(username,qnum) VALUES("user04",8);
INSERT INTO answer(username,qnum) VALUES("user04",9);
INSERT INTO answer(username,qnum) VALUES("user04",10);
INSERT INTO answer(username,qnum) VALUES("user04",11);
INSERT INTO answer(username,qnum) VALUES("user04",201);
INSERT INTO answer(username,qnum) VALUES("user05",1);
INSERT INTO answer(username,qnum) VALUES("user05",2);
INSERT INTO answer(username,qnum) VALUES("user05",3);
INSERT INTO answer(username,qnum) VALUES("user05",4);
INSERT INTO answer(username,qnum) VALUES("user05",5);
INSERT INTO answer(username,qnum) VALUES("user05",6);
INSERT INTO answer(username,qnum) VALUES("user05",7);
INSERT INTO answer(username,qnum) VALUES("user05",8);
INSERT INTO answer(username,qnum) VALUES("user05",9);
INSERT INTO answer(username,qnum) VALUES("user05",10);
INSERT INTO answer(username,qnum) VALUES("user05",11);
INSERT INTO answer(username,qnum) VALUES("user05",201);
INSERT INTO answer(username,qnum) VALUES("user06",1);
INSERT INTO answer(username,qnum) VALUES("user06",2);
INSERT INTO answer(username,qnum) VALUES("user06",3);
INSERT INTO answer(username,qnum) VALUES("user06",4);
INSERT INTO answer(username,qnum) VALUES("user06",5);
INSERT INTO answer(username,qnum) VALUES("user06",6);
INSERT INTO answer(username,qnum) VALUES("user06",7);
INSERT INTO answer(username,qnum) VALUES("user06",8);
INSERT INTO answer(username,qnum) VALUES("user06",9);
INSERT INTO answer(username,qnum) VALUES("user06",10);
INSERT INTO answer(username,qnum) VALUES("user06",11);
INSERT INTO answer(username,qnum) VALUES("user06",201);
INSERT INTO answer(username,qnum) VALUES("user07",1);
INSERT INTO answer(username,qnum) VALUES("user07",2);
INSERT INTO answer(username,qnum) VALUES("user07",3);
INSERT INTO answer(username,qnum) VALUES("user07",4);
INSERT INTO answer(username,qnum) VALUES("user07",5);
INSERT INTO answer(username,qnum) VALUES("user07",6);
INSERT INTO answer(username,qnum) VALUES("user07",7);
INSERT INTO answer(username,qnum) VALUES("user07",8);
INSERT INTO answer(username,qnum) VALUES("user07",9);
INSERT INTO answer(username,qnum) VALUES("user07",10);
INSERT INTO answer(username,qnum) VALUES("user07",11);
INSERT INTO answer(username,qnum) VALUES("user07",201);
INSERT INTO answer(username,qnum) VALUES("user08",1);
INSERT INTO answer(username,qnum) VALUES("user08",2);
INSERT INTO answer(username,qnum) VALUES("user08",3);
INSERT INTO answer(username,qnum) VALUES("user08",4);
INSERT INTO answer(username,qnum) VALUES("user08",5);
INSERT INTO answer(username,qnum) VALUES("user08",6);
INSERT INTO answer(username,qnum) VALUES("user08",7);
INSERT INTO answer(username,qnum) VALUES("user08",8);
INSERT INTO answer(username,qnum) VALUES("user08",9);
INSERT INTO answer(username,qnum) VALUES("user08",10);
INSERT INTO answer(username,qnum) VALUES("user08",11);
INSERT INTO answer(username,qnum) VALUES("user08",201);
INSERT INTO answer(username,qnum) VALUES("user09",1);
INSERT INTO answer(username,qnum) VALUES("user09",2);
INSERT INTO answer(username,qnum) VALUES("user09",3);
INSERT INTO answer(username,qnum) VALUES("user09",4);
INSERT INTO answer(username,qnum) VALUES("user09",5);
INSERT INTO answer(username,qnum) VALUES("user09",6);
INSERT INTO answer(username,qnum) VALUES("user09",7);
INSERT INTO answer(username,qnum) VALUES("user09",8);
INSERT INTO answer(username,qnum) VALUES("user09",9);
INSERT INTO answer(username,qnum) VALUES("user09",10);
INSERT INTO answer(username,qnum) VALUES("user09",11);
INSERT INTO answer(username,qnum) VALUES("user09",201);
INSERT INTO answer(username,qnum) VALUES("user10",1);
INSERT INTO answer(username,qnum) VALUES("user10",2);
INSERT INTO answer(username,qnum) VALUES("user10",3);
INSERT INTO answer(username,qnum) VALUES("user10",4);
INSERT INTO answer(username,qnum) VALUES("user10",5);
INSERT INTO answer(username,qnum) VALUES("user10",6);
INSERT INTO answer(username,qnum) VALUES("user10",7);
INSERT INTO answer(username,qnum) VALUES("user10",8);
INSERT INTO answer(username,qnum) VALUES("user10",9);
INSERT INTO answer(username,qnum) VALUES("user10",10);
INSERT INTO answer(username,qnum) VALUES("user10",11);
INSERT INTO answer(username,qnum) VALUES("user10",201);
INSERT INTO answer(username,qnum) VALUES("user11",1);
INSERT INTO answer(username,qnum) VALUES("user11",2);
INSERT INTO answer(username,qnum) VALUES("user11",3);
INSERT INTO answer(username,qnum) VALUES("user11",4);
INSERT INTO answer(username,qnum) VALUES("user11",5);
INSERT INTO answer(username,qnum) VALUES("user11",6);
INSERT INTO answer(username,qnum) VALUES("user11",7);
INSERT INTO answer(username,qnum) VALUES("user11",8);
INSERT INTO answer(username,qnum) VALUES("user11",9);
INSERT INTO answer(username,qnum) VALUES("user11",10);
INSERT INTO answer(username,qnum) VALUES("user11",11);
INSERT INTO answer(username,qnum) VALUES("user11",201);
INSERT INTO answer(username,qnum) VALUES("user12",1);
INSERT INTO answer(username,qnum) VALUES("user12",2);
INSERT INTO answer(username,qnum) VALUES("user12",3);
INSERT INTO answer(username,qnum) VALUES("user12",4);
INSERT INTO answer(username,qnum) VALUES("user12",5);
INSERT INTO answer(username,qnum) VALUES("user12",6);
INSERT INTO answer(username,qnum) VALUES("user12",7);
INSERT INTO answer(username,qnum) VALUES("user12",8);
INSERT INTO answer(username,qnum) VALUES("user12",9);
INSERT INTO answer(username,qnum) VALUES("user12",10);
INSERT INTO answer(username,qnum) VALUES("user12",11);
INSERT INTO answer(username,qnum) VALUES("user12",201);
INSERT INTO answer(username,qnum) VALUES("user13",1);
INSERT INTO answer(username,qnum) VALUES("user13",2);
INSERT INTO answer(username,qnum) VALUES("user13",3);
INSERT INTO answer(username,qnum) VALUES("user13",4);
INSERT INTO answer(username,qnum) VALUES("user13",5);
INSERT INTO answer(username,qnum) VALUES("user13",6);
INSERT INTO answer(username,qnum) VALUES("user13",7);
INSERT INTO answer(username,qnum) VALUES("user13",8);
INSERT INTO answer(username,qnum) VALUES("user13",9);
INSERT INTO answer(username,qnum) VALUES("user13",10);
INSERT INTO answer(username,qnum) VALUES("user13",11);
INSERT INTO answer(username,qnum) VALUES("user13",201);
INSERT INTO answer(username,qnum) VALUES("user14",1);
INSERT INTO answer(username,qnum) VALUES("user14",2);
INSERT INTO answer(username,qnum) VALUES("user14",3);
INSERT INTO answer(username,qnum) VALUES("user14",4);
INSERT INTO answer(username,qnum) VALUES("user14",5);
INSERT INTO answer(username,qnum) VALUES("user14",6);
INSERT INTO answer(username,qnum) VALUES("user14",7);
INSERT INTO answer(username,qnum) VALUES("user14",8);
INSERT INTO answer(username,qnum) VALUES("user14",9);
INSERT INTO answer(username,qnum) VALUES("user14",10);
INSERT INTO answer(username,qnum) VALUES("user14",11);
INSERT INTO answer(username,qnum) VALUES("user14",201);
INSERT INTO answer(username,qnum) VALUES("user15",1);
INSERT INTO answer(username,qnum) VALUES("user15",2);
INSERT INTO answer(username,qnum) VALUES("user15",3);
INSERT INTO answer(username,qnum) VALUES("user15",4);
INSERT INTO answer(username,qnum) VALUES("user15",5);
INSERT INTO answer(username,qnum) VALUES("user15",6);
INSERT INTO answer(username,qnum) VALUES("user15",7);
INSERT INTO answer(username,qnum) VALUES("user15",8);
INSERT INTO answer(username,qnum) VALUES("user15",9);
INSERT INTO answer(username,qnum) VALUES("user15",10);
INSERT INTO answer(username,qnum) VALUES("user15",11);
INSERT INTO answer(username,qnum) VALUES("user15",201);
INSERT INTO answer(username,qnum) VALUES("user16",1);
INSERT INTO answer(username,qnum) VALUES("user16",2);
INSERT INTO answer(username,qnum) VALUES("user16",3);
INSERT INTO answer(username,qnum) VALUES("user16",4);
INSERT INTO answer(username,qnum) VALUES("user16",5);
INSERT INTO answer(username,qnum) VALUES("user16",6);
INSERT INTO answer(username,qnum) VALUES("user16",7);
INSERT INTO answer(username,qnum) VALUES("user16",8);
INSERT INTO answer(username,qnum) VALUES("user16",9);
INSERT INTO answer(username,qnum) VALUES("user16",10);
INSERT INTO answer(username,qnum) VALUES("user16",11);
INSERT INTO answer(username,qnum) VALUES("user16",201);
INSERT INTO answer(username,qnum) VALUES("user17",1);
INSERT INTO answer(username,qnum) VALUES("user17",2);
INSERT INTO answer(username,qnum) VALUES("user17",3);
INSERT INTO answer(username,qnum) VALUES("user17",4);
INSERT INTO answer(username,qnum) VALUES("user17",5);
INSERT INTO answer(username,qnum) VALUES("user17",6);
INSERT INTO answer(username,qnum) VALUES("user17",7);
INSERT INTO answer(username,qnum) VALUES("user17",8);
INSERT INTO answer(username,qnum) VALUES("user17",9);
INSERT INTO answer(username,qnum) VALUES("user17",10);
INSERT INTO answer(username,qnum) VALUES("user17",11);
INSERT INTO answer(username,qnum) VALUES("user17",201);
INSERT INTO answer(username,qnum) VALUES("user18",1);
INSERT INTO answer(username,qnum) VALUES("user18",2);
INSERT INTO answer(username,qnum) VALUES("user18",3);
INSERT INTO answer(username,qnum) VALUES("user18",4);
INSERT INTO answer(username,qnum) VALUES("user18",5);
INSERT INTO answer(username,qnum) VALUES("user18",6);
INSERT INTO answer(username,qnum) VALUES("user18",7);
INSERT INTO answer(username,qnum) VALUES("user18",8);
INSERT INTO answer(username,qnum) VALUES("user18",9);
INSERT INTO answer(username,qnum) VALUES("user18",10);
INSERT INTO answer(username,qnum) VALUES("user18",11);
INSERT INTO answer(username,qnum) VALUES("user18",201);
INSERT INTO answer(username,qnum) VALUES("user19",1);
INSERT INTO answer(username,qnum) VALUES("user19",2);
INSERT INTO answer(username,qnum) VALUES("user19",3);
INSERT INTO answer(username,qnum) VALUES("user19",4);
INSERT INTO answer(username,qnum) VALUES("user19",5);
INSERT INTO answer(username,qnum) VALUES("user19",6);
INSERT INTO answer(username,qnum) VALUES("user19",7);
INSERT INTO answer(username,qnum) VALUES("user19",8);
INSERT INTO answer(username,qnum) VALUES("user19",9);
INSERT INTO answer(username,qnum) VALUES("user19",10);
INSERT INTO answer(username,qnum) VALUES("user19",11);
INSERT INTO answer(username,qnum) VALUES("user19",201);
INSERT INTO answer(username,qnum) VALUES("user20",1);
INSERT INTO answer(username,qnum) VALUES("user20",2);
INSERT INTO answer(username,qnum) VALUES("user20",3);
INSERT INTO answer(username,qnum) VALUES("user20",4);
INSERT INTO answer(username,qnum) VALUES("user20",5);
INSERT INTO answer(username,qnum) VALUES("user20",6);
INSERT INTO answer(username,qnum) VALUES("user20",7);
INSERT INTO answer(username,qnum) VALUES("user20",8);
INSERT INTO answer(username,qnum) VALUES("user20",9);
INSERT INTO answer(username,qnum) VALUES("user20",10);
INSERT INTO answer(username,qnum) VALUES("user20",11);
INSERT INTO answer(username,qnum) VALUES("user20",201);
INSERT INTO answer(username,qnum) VALUES("user21",1);
INSERT INTO answer(username,qnum) VALUES("user21",2);
INSERT INTO answer(username,qnum) VALUES("user21",3);
INSERT INTO answer(username,qnum) VALUES("user21",4);
INSERT INTO answer(username,qnum) VALUES("user21",5);
INSERT INTO answer(username,qnum) VALUES("user21",6);
INSERT INTO answer(username,qnum) VALUES("user21",7);
INSERT INTO answer(username,qnum) VALUES("user21",8);
INSERT INTO answer(username,qnum) VALUES("user21",9);
INSERT INTO answer(username,qnum) VALUES("user21",10);
INSERT INTO answer(username,qnum) VALUES("user21",11);
INSERT INTO answer(username,qnum) VALUES("user21",201);
INSERT INTO answer(username,qnum) VALUES("user22",1);
INSERT INTO answer(username,qnum) VALUES("user22",2);
INSERT INTO answer(username,qnum) VALUES("user22",3);
INSERT INTO answer(username,qnum) VALUES("user22",4);
INSERT INTO answer(username,qnum) VALUES("user22",5);
INSERT INTO answer(username,qnum) VALUES("user22",6);
INSERT INTO answer(username,qnum) VALUES("user22",7);
INSERT INTO answer(username,qnum) VALUES("user22",8);
INSERT INTO answer(username,qnum) VALUES("user22",9);
INSERT INTO answer(username,qnum) VALUES("user22",10);
INSERT INTO answer(username,qnum) VALUES("user22",11);
INSERT INTO answer(username,qnum) VALUES("user22",201);
INSERT INTO answer(username,qnum) VALUES("user23",1);
INSERT INTO answer(username,qnum) VALUES("user23",2);
INSERT INTO answer(username,qnum) VALUES("user23",3);
INSERT INTO answer(username,qnum) VALUES("user23",4);
INSERT INTO answer(username,qnum) VALUES("user23",5);
INSERT INTO answer(username,qnum) VALUES("user23",6);
INSERT INTO answer(username,qnum) VALUES("user23",7);
INSERT INTO answer(username,qnum) VALUES("user23",8);
INSERT INTO answer(username,qnum) VALUES("user23",9);
INSERT INTO answer(username,qnum) VALUES("user23",10);
INSERT INTO answer(username,qnum) VALUES("user23",11);
INSERT INTO answer(username,qnum) VALUES("user23",201);
INSERT INTO answer(username,qnum) VALUES("user24",1);
INSERT INTO answer(username,qnum) VALUES("user24",2);
INSERT INTO answer(username,qnum) VALUES("user24",3);
INSERT INTO answer(username,qnum) VALUES("user24",4);
INSERT INTO answer(username,qnum) VALUES("user24",5);
INSERT INTO answer(username,qnum) VALUES("user24",6);
INSERT INTO answer(username,qnum) VALUES("user24",7);
INSERT INTO answer(username,qnum) VALUES("user24",8);
INSERT INTO answer(username,qnum) VALUES("user24",9);
INSERT INTO answer(username,qnum) VALUES("user24",10);
INSERT INTO answer(username,qnum) VALUES("user24",11);
INSERT INTO answer(username,qnum) VALUES("user24",201);
INSERT INTO answer(username,qnum) VALUES("user25",1);
INSERT INTO answer(username,qnum) VALUES("user25",2);
INSERT INTO answer(username,qnum) VALUES("user25",3);
INSERT INTO answer(username,qnum) VALUES("user25",4);
INSERT INTO answer(username,qnum) VALUES("user25",5);
INSERT INTO answer(username,qnum) VALUES("user25",6);
INSERT INTO answer(username,qnum) VALUES("user25",7);
INSERT INTO answer(username,qnum) VALUES("user25",8);
INSERT INTO answer(username,qnum) VALUES("user25",9);
INSERT INTO answer(username,qnum) VALUES("user25",10);
INSERT INTO answer(username,qnum) VALUES("user25",11);
INSERT INTO answer(username,qnum) VALUES("user25",201);
INSERT INTO answer(username,qnum) VALUES("user26",1);
INSERT INTO answer(username,qnum) VALUES("user26",2);
INSERT INTO answer(username,qnum) VALUES("user26",3);
INSERT INTO answer(username,qnum) VALUES("user26",4);
INSERT INTO answer(username,qnum) VALUES("user26",5);
INSERT INTO answer(username,qnum) VALUES("user26",6);
INSERT INTO answer(username,qnum) VALUES("user26",7);
INSERT INTO answer(username,qnum) VALUES("user26",8);
INSERT INTO answer(username,qnum) VALUES("user26",9);
INSERT INTO answer(username,qnum) VALUES("user26",10);
INSERT INTO answer(username,qnum) VALUES("user26",11);
INSERT INTO answer(username,qnum) VALUES("user26",201);
INSERT INTO answer(username,qnum) VALUES("user27",1);
INSERT INTO answer(username,qnum) VALUES("user27",2);
INSERT INTO answer(username,qnum) VALUES("user27",3);
INSERT INTO answer(username,qnum) VALUES("user27",4);
INSERT INTO answer(username,qnum) VALUES("user27",5);
INSERT INTO answer(username,qnum) VALUES("user27",6);
INSERT INTO answer(username,qnum) VALUES("user27",7);
INSERT INTO answer(username,qnum) VALUES("user27",8);
INSERT INTO answer(username,qnum) VALUES("user27",9);
INSERT INTO answer(username,qnum) VALUES("user27",10);
INSERT INTO answer(username,qnum) VALUES("user27",11);
INSERT INTO answer(username,qnum) VALUES("user27",201);
INSERT INTO answer(username,qnum) VALUES("user28",1);
INSERT INTO answer(username,qnum) VALUES("user28",2);
INSERT INTO answer(username,qnum) VALUES("user28",3);
INSERT INTO answer(username,qnum) VALUES("user28",4);
INSERT INTO answer(username,qnum) VALUES("user28",5);
INSERT INTO answer(username,qnum) VALUES("user28",6);
INSERT INTO answer(username,qnum) VALUES("user28",7);
INSERT INTO answer(username,qnum) VALUES("user28",8);
INSERT INTO answer(username,qnum) VALUES("user28",9);
INSERT INTO answer(username,qnum) VALUES("user28",10);
INSERT INTO answer(username,qnum) VALUES("user28",11);
INSERT INTO answer(username,qnum) VALUES("user28",201);
INSERT INTO answer(username,qnum) VALUES("user29",1);
INSERT INTO answer(username,qnum) VALUES("user29",2);
INSERT INTO answer(username,qnum) VALUES("user29",3);
INSERT INTO answer(username,qnum) VALUES("user29",4);
INSERT INTO answer(username,qnum) VALUES("user29",5);
INSERT INTO answer(username,qnum) VALUES("user29",6);
INSERT INTO answer(username,qnum) VALUES("user29",7);
INSERT INTO answer(username,qnum) VALUES("user29",8);
INSERT INTO answer(username,qnum) VALUES("user29",9);
INSERT INTO answer(username,qnum) VALUES("user29",10);
INSERT INTO answer(username,qnum) VALUES("user29",11);
INSERT INTO answer(username,qnum) VALUES("user29",201);
INSERT INTO answer(username,qnum) VALUES("user30",1);
INSERT INTO answer(username,qnum) VALUES("user30",2);
INSERT INTO answer(username,qnum) VALUES("user30",3);
INSERT INTO answer(username,qnum) VALUES("user30",4);
INSERT INTO answer(username,qnum) VALUES("user30",5);
INSERT INTO answer(username,qnum) VALUES("user30",6);
INSERT INTO answer(username,qnum) VALUES("user30",7);
INSERT INTO answer(username,qnum) VALUES("user30",8);
INSERT INTO answer(username,qnum) VALUES("user30",9);
INSERT INTO answer(username,qnum) VALUES("user30",10);
INSERT INTO answer(username,qnum) VALUES("user30",11);
INSERT INTO answer(username,qnum) VALUES("user30",201);
INSERT INTO answer(username,qnum) VALUES("user31",1);
INSERT INTO answer(username,qnum) VALUES("user31",2);
INSERT INTO answer(username,qnum) VALUES("user31",3);
INSERT INTO answer(username,qnum) VALUES("user31",4);
INSERT INTO answer(username,qnum) VALUES("user31",5);
INSERT INTO answer(username,qnum) VALUES("user31",6);
INSERT INTO answer(username,qnum) VALUES("user31",7);
INSERT INTO answer(username,qnum) VALUES("user31",8);
INSERT INTO answer(username,qnum) VALUES("user31",9);
INSERT INTO answer(username,qnum) VALUES("user31",10);
INSERT INTO answer(username,qnum) VALUES("user31",11);
INSERT INTO answer(username,qnum) VALUES("user31",201);
INSERT INTO answer(username,qnum) VALUES("user32",1);
INSERT INTO answer(username,qnum) VALUES("user32",2);
INSERT INTO answer(username,qnum) VALUES("user32",3);
INSERT INTO answer(username,qnum) VALUES("user32",4);
INSERT INTO answer(username,qnum) VALUES("user32",5);
INSERT INTO answer(username,qnum) VALUES("user32",6);
INSERT INTO answer(username,qnum) VALUES("user32",7);
INSERT INTO answer(username,qnum) VALUES("user32",8);
INSERT INTO answer(username,qnum) VALUES("user32",9);
INSERT INTO answer(username,qnum) VALUES("user32",10);
INSERT INTO answer(username,qnum) VALUES("user32",11);
INSERT INTO answer(username,qnum) VALUES("user32",201);
INSERT INTO answer(username,qnum) VALUES("user33",1);
INSERT INTO answer(username,qnum) VALUES("user33",2);
INSERT INTO answer(username,qnum) VALUES("user33",3);
INSERT INTO answer(username,qnum) VALUES("user33",4);
INSERT INTO answer(username,qnum) VALUES("user33",5);
INSERT INTO answer(username,qnum) VALUES("user33",6);
INSERT INTO answer(username,qnum) VALUES("user33",7);
INSERT INTO answer(username,qnum) VALUES("user33",8);
INSERT INTO answer(username,qnum) VALUES("user33",9);
INSERT INTO answer(username,qnum) VALUES("user33",10);
INSERT INTO answer(username,qnum) VALUES("user33",11);
INSERT INTO answer(username,qnum) VALUES("user33",201);
INSERT INTO answer(username,qnum) VALUES("user34",1);
INSERT INTO answer(username,qnum) VALUES("user34",2);
INSERT INTO answer(username,qnum) VALUES("user34",3);
INSERT INTO answer(username,qnum) VALUES("user34",4);
INSERT INTO answer(username,qnum) VALUES("user34",5);
INSERT INTO answer(username,qnum) VALUES("user34",6);
INSERT INTO answer(username,qnum) VALUES("user34",7);
INSERT INTO answer(username,qnum) VALUES("user34",8);
INSERT INTO answer(username,qnum) VALUES("user34",9);
INSERT INTO answer(username,qnum) VALUES("user34",10);
INSERT INTO answer(username,qnum) VALUES("user34",11);
INSERT INTO answer(username,qnum) VALUES("user34",201);
INSERT INTO answer(username,qnum) VALUES("user35",1);
INSERT INTO answer(username,qnum) VALUES("user35",2);
INSERT INTO answer(username,qnum) VALUES("user35",3);
INSERT INTO answer(username,qnum) VALUES("user35",4);
INSERT INTO answer(username,qnum) VALUES("user35",5);
INSERT INTO answer(username,qnum) VALUES("user35",6);
INSERT INTO answer(username,qnum) VALUES("user35",7);
INSERT INTO answer(username,qnum) VALUES("user35",8);
INSERT INTO answer(username,qnum) VALUES("user35",9);
INSERT INTO answer(username,qnum) VALUES("user35",10);
INSERT INTO answer(username,qnum) VALUES("user35",11);
INSERT INTO answer(username,qnum) VALUES("user35",201);
INSERT INTO answer(username,qnum) VALUES("user36",1);
INSERT INTO answer(username,qnum) VALUES("user36",2);
INSERT INTO answer(username,qnum) VALUES("user36",3);
INSERT INTO answer(username,qnum) VALUES("user36",4);
INSERT INTO answer(username,qnum) VALUES("user36",5);
INSERT INTO answer(username,qnum) VALUES("user36",6);
INSERT INTO answer(username,qnum) VALUES("user36",7);
INSERT INTO answer(username,qnum) VALUES("user36",8);
INSERT INTO answer(username,qnum) VALUES("user36",9);
INSERT INTO answer(username,qnum) VALUES("user36",10);
INSERT INTO answer(username,qnum) VALUES("user36",11);
INSERT INTO answer(username,qnum) VALUES("user36",201);
INSERT INTO answer(username,qnum) VALUES("user37",1);
INSERT INTO answer(username,qnum) VALUES("user37",2);
INSERT INTO answer(username,qnum) VALUES("user37",3);
INSERT INTO answer(username,qnum) VALUES("user37",4);
INSERT INTO answer(username,qnum) VALUES("user37",5);
INSERT INTO answer(username,qnum) VALUES("user37",6);
INSERT INTO answer(username,qnum) VALUES("user37",7);
INSERT INTO answer(username,qnum) VALUES("user37",8);
INSERT INTO answer(username,qnum) VALUES("user37",9);
INSERT INTO answer(username,qnum) VALUES("user37",10);
INSERT INTO answer(username,qnum) VALUES("user37",11);
INSERT INTO answer(username,qnum) VALUES("user37",201);
INSERT INTO answer(username,qnum) VALUES("user38",1);
INSERT INTO answer(username,qnum) VALUES("user38",2);
INSERT INTO answer(username,qnum) VALUES("user38",3);
INSERT INTO answer(username,qnum) VALUES("user38",4);
INSERT INTO answer(username,qnum) VALUES("user38",5);
INSERT INTO answer(username,qnum) VALUES("user38",6);
INSERT INTO answer(username,qnum) VALUES("user38",7);
INSERT INTO answer(username,qnum) VALUES("user38",8);
INSERT INTO answer(username,qnum) VALUES("user38",9);
INSERT INTO answer(username,qnum) VALUES("user38",10);
INSERT INTO answer(username,qnum) VALUES("user38",11);
INSERT INTO answer(username,qnum) VALUES("user38",201);
INSERT INTO answer(username,qnum) VALUES("user39",1);
INSERT INTO answer(username,qnum) VALUES("user39",2);
INSERT INTO answer(username,qnum) VALUES("user39",3);
INSERT INTO answer(username,qnum) VALUES("user39",4);
INSERT INTO answer(username,qnum) VALUES("user39",5);
INSERT INTO answer(username,qnum) VALUES("user39",6);
INSERT INTO answer(username,qnum) VALUES("user39",7);
INSERT INTO answer(username,qnum) VALUES("user39",8);
INSERT INTO answer(username,qnum) VALUES("user39",9);
INSERT INTO answer(username,qnum) VALUES("user39",10);
INSERT INTO answer(username,qnum) VALUES("user39",11);
INSERT INTO answer(username,qnum) VALUES("user39",201);
INSERT INTO answer(username,qnum) VALUES("user40",1);
INSERT INTO answer(username,qnum) VALUES("user40",2);
INSERT INTO answer(username,qnum) VALUES("user40",3);
INSERT INTO answer(username,qnum) VALUES("user40",4);
INSERT INTO answer(username,qnum) VALUES("user40",5);
INSERT INTO answer(username,qnum) VALUES("user40",6);
INSERT INTO answer(username,qnum) VALUES("user40",7);
INSERT INTO answer(username,qnum) VALUES("user40",8);
INSERT INTO answer(username,qnum) VALUES("user40",9);
INSERT INTO answer(username,qnum) VALUES("user40",10);
INSERT INTO answer(username,qnum) VALUES("user40",11);
INSERT INTO answer(username,qnum) VALUES("user40",201);
INSERT INTO answer(username,qnum) VALUES("user41",1);
INSERT INTO answer(username,qnum) VALUES("user41",2);
INSERT INTO answer(username,qnum) VALUES("user41",3);
INSERT INTO answer(username,qnum) VALUES("user41",4);
INSERT INTO answer(username,qnum) VALUES("user41",5);
INSERT INTO answer(username,qnum) VALUES("user41",6);
INSERT INTO answer(username,qnum) VALUES("user41",7);
INSERT INTO answer(username,qnum) VALUES("user41",8);
INSERT INTO answer(username,qnum) VALUES("user41",9);
INSERT INTO answer(username,qnum) VALUES("user41",10);
INSERT INTO answer(username,qnum) VALUES("user41",11);
INSERT INTO answer(username,qnum) VALUES("user41",201);
INSERT INTO answer(username,qnum) VALUES("user42",1);
INSERT INTO answer(username,qnum) VALUES("user42",2);
INSERT INTO answer(username,qnum) VALUES("user42",3);
INSERT INTO answer(username,qnum) VALUES("user42",4);
INSERT INTO answer(username,qnum) VALUES("user42",5);
INSERT INTO answer(username,qnum) VALUES("user42",6);
INSERT INTO answer(username,qnum) VALUES("user42",7);
INSERT INTO answer(username,qnum) VALUES("user42",8);
INSERT INTO answer(username,qnum) VALUES("user42",9);
INSERT INTO answer(username,qnum) VALUES("user42",10);
INSERT INTO answer(username,qnum) VALUES("user42",11);
INSERT INTO answer(username,qnum) VALUES("user42",201);
INSERT INTO answer(username,qnum) VALUES("user43",1);
INSERT INTO answer(username,qnum) VALUES("user43",2);
INSERT INTO answer(username,qnum) VALUES("user43",3);
INSERT INTO answer(username,qnum) VALUES("user43",4);
INSERT INTO answer(username,qnum) VALUES("user43",5);
INSERT INTO answer(username,qnum) VALUES("user43",6);
INSERT INTO answer(username,qnum) VALUES("user43",7);
INSERT INTO answer(username,qnum) VALUES("user43",8);
INSERT INTO answer(username,qnum) VALUES("user43",9);
INSERT INTO answer(username,qnum) VALUES("user43",10);
INSERT INTO answer(username,qnum) VALUES("user43",11);
INSERT INTO answer(username,qnum) VALUES("user43",201);
INSERT INTO answer(username,qnum) VALUES("user44",1);
INSERT INTO answer(username,qnum) VALUES("user44",2);
INSERT INTO answer(username,qnum) VALUES("user44",3);
INSERT INTO answer(username,qnum) VALUES("user44",4);
INSERT INTO answer(username,qnum) VALUES("user44",5);
INSERT INTO answer(username,qnum) VALUES("user44",6);
INSERT INTO answer(username,qnum) VALUES("user44",7);
INSERT INTO answer(username,qnum) VALUES("user44",8);
INSERT INTO answer(username,qnum) VALUES("user44",9);
INSERT INTO answer(username,qnum) VALUES("user44",10);
INSERT INTO answer(username,qnum) VALUES("user44",11);
INSERT INTO answer(username,qnum) VALUES("user44",201);
INSERT INTO answer(username,qnum) VALUES("user45",1);
INSERT INTO answer(username,qnum) VALUES("user45",2);
INSERT INTO answer(username,qnum) VALUES("user45",3);
INSERT INTO answer(username,qnum) VALUES("user45",4);
INSERT INTO answer(username,qnum) VALUES("user45",5);
INSERT INTO answer(username,qnum) VALUES("user45",6);
INSERT INTO answer(username,qnum) VALUES("user45",7);
INSERT INTO answer(username,qnum) VALUES("user45",8);
INSERT INTO answer(username,qnum) VALUES("user45",9);
INSERT INTO answer(username,qnum) VALUES("user45",10);
INSERT INTO answer(username,qnum) VALUES("user45",11);
INSERT INTO answer(username,qnum) VALUES("user45",201);
INSERT INTO answer(username,qnum) VALUES("user46",1);
INSERT INTO answer(username,qnum) VALUES("user46",2);
INSERT INTO answer(username,qnum) VALUES("user46",3);
INSERT INTO answer(username,qnum) VALUES("user46",4);
INSERT INTO answer(username,qnum) VALUES("user46",5);
INSERT INTO answer(username,qnum) VALUES("user46",6);
INSERT INTO answer(username,qnum) VALUES("user46",7);
INSERT INTO answer(username,qnum) VALUES("user46",8);
INSERT INTO answer(username,qnum) VALUES("user46",9);
INSERT INTO answer(username,qnum) VALUES("user46",10);
INSERT INTO answer(username,qnum) VALUES("user46",11);
INSERT INTO answer(username,qnum) VALUES("user46",201);
INSERT INTO answer(username,qnum) VALUES("user47",1);
INSERT INTO answer(username,qnum) VALUES("user47",2);
INSERT INTO answer(username,qnum) VALUES("user47",3);
INSERT INTO answer(username,qnum) VALUES("user47",4);
INSERT INTO answer(username,qnum) VALUES("user47",5);
INSERT INTO answer(username,qnum) VALUES("user47",6);
INSERT INTO answer(username,qnum) VALUES("user47",7);
INSERT INTO answer(username,qnum) VALUES("user47",8);
INSERT INTO answer(username,qnum) VALUES("user47",9);
INSERT INTO answer(username,qnum) VALUES("user47",10);
INSERT INTO answer(username,qnum) VALUES("user47",11);
INSERT INTO answer(username,qnum) VALUES("user47",201);
INSERT INTO answer(username,qnum) VALUES("user48",1);
INSERT INTO answer(username,qnum) VALUES("user48",2);
INSERT INTO answer(username,qnum) VALUES("user48",3);
INSERT INTO answer(username,qnum) VALUES("user48",4);
INSERT INTO answer(username,qnum) VALUES("user48",5);
INSERT INTO answer(username,qnum) VALUES("user48",6);
INSERT INTO answer(username,qnum) VALUES("user48",7);
INSERT INTO answer(username,qnum) VALUES("user48",8);
INSERT INTO answer(username,qnum) VALUES("user48",9);
INSERT INTO answer(username,qnum) VALUES("user48",10);
INSERT INTO answer(username,qnum) VALUES("user48",11);
INSERT INTO answer(username,qnum) VALUES("user48",201);
INSERT INTO answer(username,qnum) VALUES("user49",1);
INSERT INTO answer(username,qnum) VALUES("user49",2);
INSERT INTO answer(username,qnum) VALUES("user49",3);
INSERT INTO answer(username,qnum) VALUES("user49",4);
INSERT INTO answer(username,qnum) VALUES("user49",5);
INSERT INTO answer(username,qnum) VALUES("user49",6);
INSERT INTO answer(username,qnum) VALUES("user49",7);
INSERT INTO answer(username,qnum) VALUES("user49",8);
INSERT INTO answer(username,qnum) VALUES("user49",9);
INSERT INTO answer(username,qnum) VALUES("user49",10);
INSERT INTO answer(username,qnum) VALUES("user49",11);
INSERT INTO answer(username,qnum) VALUES("user49",201);
INSERT INTO answer(username,qnum) VALUES("user50",1);
INSERT INTO answer(username,qnum) VALUES("user50",2);
INSERT INTO answer(username,qnum) VALUES("user50",3);
INSERT INTO answer(username,qnum) VALUES("user50",4);
INSERT INTO answer(username,qnum) VALUES("user50",5);
INSERT INTO answer(username,qnum) VALUES("user50",6);
INSERT INTO answer(username,qnum) VALUES("user50",7);
INSERT INTO answer(username,qnum) VALUES("user50",8);
INSERT INTO answer(username,qnum) VALUES("user50",9);
INSERT INTO answer(username,qnum) VALUES("user50",10);
INSERT INTO answer(username,qnum) VALUES("user50",11);
INSERT INTO answer(username,qnum) VALUES("user50",201);
INSERT INTO answer(username,qnum) VALUES("user51",1);
INSERT INTO answer(username,qnum) VALUES("user51",2);
INSERT INTO answer(username,qnum) VALUES("user51",3);
INSERT INTO answer(username,qnum) VALUES("user51",4);
INSERT INTO answer(username,qnum) VALUES("user51",5);
INSERT INTO answer(username,qnum) VALUES("user51",6);
INSERT INTO answer(username,qnum) VALUES("user51",7);
INSERT INTO answer(username,qnum) VALUES("user51",8);
INSERT INTO answer(username,qnum) VALUES("user51",9);
INSERT INTO answer(username,qnum) VALUES("user51",10);
INSERT INTO answer(username,qnum) VALUES("user51",11);
INSERT INTO answer(username,qnum) VALUES("user51",201);
INSERT INTO answer(username,qnum) VALUES("user52",1);
INSERT INTO answer(username,qnum) VALUES("user52",2);
INSERT INTO answer(username,qnum) VALUES("user52",3);
INSERT INTO answer(username,qnum) VALUES("user52",4);
INSERT INTO answer(username,qnum) VALUES("user52",5);
INSERT INTO answer(username,qnum) VALUES("user52",6);
INSERT INTO answer(username,qnum) VALUES("user52",7);
INSERT INTO answer(username,qnum) VALUES("user52",8);
INSERT INTO answer(username,qnum) VALUES("user52",9);
INSERT INTO answer(username,qnum) VALUES("user52",10);
INSERT INTO answer(username,qnum) VALUES("user52",11);
INSERT INTO answer(username,qnum) VALUES("user52",201);
INSERT INTO answer(username,qnum) VALUES("user53",1);
INSERT INTO answer(username,qnum) VALUES("user53",2);
INSERT INTO answer(username,qnum) VALUES("user53",3);
INSERT INTO answer(username,qnum) VALUES("user53",4);
INSERT INTO answer(username,qnum) VALUES("user53",5);
INSERT INTO answer(username,qnum) VALUES("user53",6);
INSERT INTO answer(username,qnum) VALUES("user53",7);
INSERT INTO answer(username,qnum) VALUES("user53",8);
INSERT INTO answer(username,qnum) VALUES("user53",9);
INSERT INTO answer(username,qnum) VALUES("user53",10);
INSERT INTO answer(username,qnum) VALUES("user53",11);
INSERT INTO answer(username,qnum) VALUES("user53",201);
INSERT INTO answer(username,qnum) VALUES("user54",1);
INSERT INTO answer(username,qnum) VALUES("user54",2);
INSERT INTO answer(username,qnum) VALUES("user54",3);
INSERT INTO answer(username,qnum) VALUES("user54",4);
INSERT INTO answer(username,qnum) VALUES("user54",5);
INSERT INTO answer(username,qnum) VALUES("user54",6);
INSERT INTO answer(username,qnum) VALUES("user54",7);
INSERT INTO answer(username,qnum) VALUES("user54",8);
INSERT INTO answer(username,qnum) VALUES("user54",9);
INSERT INTO answer(username,qnum) VALUES("user54",10);
INSERT INTO answer(username,qnum) VALUES("user54",11);
INSERT INTO answer(username,qnum) VALUES("user54",201);
INSERT INTO answer(username,qnum) VALUES("user55",1);
INSERT INTO answer(username,qnum) VALUES("user55",2);
INSERT INTO answer(username,qnum) VALUES("user55",3);
INSERT INTO answer(username,qnum) VALUES("user55",4);
INSERT INTO answer(username,qnum) VALUES("user55",5);
INSERT INTO answer(username,qnum) VALUES("user55",6);
INSERT INTO answer(username,qnum) VALUES("user55",7);
INSERT INTO answer(username,qnum) VALUES("user55",8);
INSERT INTO answer(username,qnum) VALUES("user55",9);
INSERT INTO answer(username,qnum) VALUES("user55",10);
INSERT INTO answer(username,qnum) VALUES("user55",11);
INSERT INTO answer(username,qnum) VALUES("user55",201);
INSERT INTO answer(username,qnum) VALUES("user56",1);
INSERT INTO answer(username,qnum) VALUES("user56",2);
INSERT INTO answer(username,qnum) VALUES("user56",3);
INSERT INTO answer(username,qnum) VALUES("user56",4);
INSERT INTO answer(username,qnum) VALUES("user56",5);
INSERT INTO answer(username,qnum) VALUES("user56",6);
INSERT INTO answer(username,qnum) VALUES("user56",7);
INSERT INTO answer(username,qnum) VALUES("user56",8);
INSERT INTO answer(username,qnum) VALUES("user56",9);
INSERT INTO answer(username,qnum) VALUES("user56",10);
INSERT INTO answer(username,qnum) VALUES("user56",11);
INSERT INTO answer(username,qnum) VALUES("user56",201);
INSERT INTO answer(username,qnum) VALUES("user57",1);
INSERT INTO answer(username,qnum) VALUES("user57",2);
INSERT INTO answer(username,qnum) VALUES("user57",3);
INSERT INTO answer(username,qnum) VALUES("user57",4);
INSERT INTO answer(username,qnum) VALUES("user57",5);
INSERT INTO answer(username,qnum) VALUES("user57",6);
INSERT INTO answer(username,qnum) VALUES("user57",7);
INSERT INTO answer(username,qnum) VALUES("user57",8);
INSERT INTO answer(username,qnum) VALUES("user57",9);
INSERT INTO answer(username,qnum) VALUES("user57",10);
INSERT INTO answer(username,qnum) VALUES("user57",11);
INSERT INTO answer(username,qnum) VALUES("user57",201);
INSERT INTO answer(username,qnum) VALUES("user58",1);
INSERT INTO answer(username,qnum) VALUES("user58",2);
INSERT INTO answer(username,qnum) VALUES("user58",3);
INSERT INTO answer(username,qnum) VALUES("user58",4);
INSERT INTO answer(username,qnum) VALUES("user58",5);
INSERT INTO answer(username,qnum) VALUES("user58",6);
INSERT INTO answer(username,qnum) VALUES("user58",7);
INSERT INTO answer(username,qnum) VALUES("user58",8);
INSERT INTO answer(username,qnum) VALUES("user58",9);
INSERT INTO answer(username,qnum) VALUES("user58",10);
INSERT INTO answer(username,qnum) VALUES("user58",11);
INSERT INTO answer(username,qnum) VALUES("user58",201);
INSERT INTO answer(username,qnum) VALUES("user59",1);
INSERT INTO answer(username,qnum) VALUES("user59",2);
INSERT INTO answer(username,qnum) VALUES("user59",3);
INSERT INTO answer(username,qnum) VALUES("user59",4);
INSERT INTO answer(username,qnum) VALUES("user59",5);
INSERT INTO answer(username,qnum) VALUES("user59",6);
INSERT INTO answer(username,qnum) VALUES("user59",7);
INSERT INTO answer(username,qnum) VALUES("user59",8);
INSERT INTO answer(username,qnum) VALUES("user59",9);
INSERT INTO answer(username,qnum) VALUES("user59",10);
INSERT INTO answer(username,qnum) VALUES("user59",11);
INSERT INTO answer(username,qnum) VALUES("user59",201);
INSERT INTO answer(username,qnum) VALUES("user60",1);
INSERT INTO answer(username,qnum) VALUES("user60",2);
INSERT INTO answer(username,qnum) VALUES("user60",3);
INSERT INTO answer(username,qnum) VALUES("user60",4);
INSERT INTO answer(username,qnum) VALUES("user60",5);
INSERT INTO answer(username,qnum) VALUES("user60",6);
INSERT INTO answer(username,qnum) VALUES("user60",7);
INSERT INTO answer(username,qnum) VALUES("user60",8);
INSERT INTO answer(username,qnum) VALUES("user60",9);
INSERT INTO answer(username,qnum) VALUES("user60",10);
INSERT INTO answer(username,qnum) VALUES("user60",11);
INSERT INTO answer(username,qnum) VALUES("user60",201);
INSERT INTO answer(username,qnum) VALUES("user61",1);
INSERT INTO answer(username,qnum) VALUES("user61",2);
INSERT INTO answer(username,qnum) VALUES("user61",3);
INSERT INTO answer(username,qnum) VALUES("user61",4);
INSERT INTO answer(username,qnum) VALUES("user61",5);
INSERT INTO answer(username,qnum) VALUES("user61",6);
INSERT INTO answer(username,qnum) VALUES("user61",7);
INSERT INTO answer(username,qnum) VALUES("user61",8);
INSERT INTO answer(username,qnum) VALUES("user61",9);
INSERT INTO answer(username,qnum) VALUES("user61",10);
INSERT INTO answer(username,qnum) VALUES("user61",11);
INSERT INTO answer(username,qnum) VALUES("user61",201);
INSERT INTO answer(username,qnum) VALUES("user62",1);
INSERT INTO answer(username,qnum) VALUES("user62",2);
INSERT INTO answer(username,qnum) VALUES("user62",3);
INSERT INTO answer(username,qnum) VALUES("user62",4);
INSERT INTO answer(username,qnum) VALUES("user62",5);
INSERT INTO answer(username,qnum) VALUES("user62",6);
INSERT INTO answer(username,qnum) VALUES("user62",7);
INSERT INTO answer(username,qnum) VALUES("user62",8);
INSERT INTO answer(username,qnum) VALUES("user62",9);
INSERT INTO answer(username,qnum) VALUES("user62",10);
INSERT INTO answer(username,qnum) VALUES("user62",11);
INSERT INTO answer(username,qnum) VALUES("user62",201);
INSERT INTO answer(username,qnum) VALUES("user63",1);
INSERT INTO answer(username,qnum) VALUES("user63",2);
INSERT INTO answer(username,qnum) VALUES("user63",3);
INSERT INTO answer(username,qnum) VALUES("user63",4);
INSERT INTO answer(username,qnum) VALUES("user63",5);
INSERT INTO answer(username,qnum) VALUES("user63",6);
INSERT INTO answer(username,qnum) VALUES("user63",7);
INSERT INTO answer(username,qnum) VALUES("user63",8);
INSERT INTO answer(username,qnum) VALUES("user63",9);
INSERT INTO answer(username,qnum) VALUES("user63",10);
INSERT INTO answer(username,qnum) VALUES("user63",11);
INSERT INTO answer(username,qnum) VALUES("user63",201);
INSERT INTO answer(username,qnum) VALUES("user64",1);
INSERT INTO answer(username,qnum) VALUES("user64",2);
INSERT INTO answer(username,qnum) VALUES("user64",3);
INSERT INTO answer(username,qnum) VALUES("user64",4);
INSERT INTO answer(username,qnum) VALUES("user64",5);
INSERT INTO answer(username,qnum) VALUES("user64",6);
INSERT INTO answer(username,qnum) VALUES("user64",7);
INSERT INTO answer(username,qnum) VALUES("user64",8);
INSERT INTO answer(username,qnum) VALUES("user64",9);
INSERT INTO answer(username,qnum) VALUES("user64",10);
INSERT INTO answer(username,qnum) VALUES("user64",11);
INSERT INTO answer(username,qnum) VALUES("user64",201);
INSERT INTO answer(username,qnum) VALUES("user65",1);
INSERT INTO answer(username,qnum) VALUES("user65",2);
INSERT INTO answer(username,qnum) VALUES("user65",3);
INSERT INTO answer(username,qnum) VALUES("user65",4);
INSERT INTO answer(username,qnum) VALUES("user65",5);
INSERT INTO answer(username,qnum) VALUES("user65",6);
INSERT INTO answer(username,qnum) VALUES("user65",7);
INSERT INTO answer(username,qnum) VALUES("user65",8);
INSERT INTO answer(username,qnum) VALUES("user65",9);
INSERT INTO answer(username,qnum) VALUES("user65",10);
INSERT INTO answer(username,qnum) VALUES("user65",11);
INSERT INTO answer(username,qnum) VALUES("user65",201);
INSERT INTO answer(username,qnum) VALUES("user66",1);
INSERT INTO answer(username,qnum) VALUES("user66",2);
INSERT INTO answer(username,qnum) VALUES("user66",3);
INSERT INTO answer(username,qnum) VALUES("user66",4);
INSERT INTO answer(username,qnum) VALUES("user66",5);
INSERT INTO answer(username,qnum) VALUES("user66",6);
INSERT INTO answer(username,qnum) VALUES("user66",7);
INSERT INTO answer(username,qnum) VALUES("user66",8);
INSERT INTO answer(username,qnum) VALUES("user66",9);
INSERT INTO answer(username,qnum) VALUES("user66",10);
INSERT INTO answer(username,qnum) VALUES("user66",11);
INSERT INTO answer(username,qnum) VALUES("user66",201);
INSERT INTO answer(username,qnum) VALUES("user67",1);
INSERT INTO answer(username,qnum) VALUES("user67",2);
INSERT INTO answer(username,qnum) VALUES("user67",3);
INSERT INTO answer(username,qnum) VALUES("user67",4);
INSERT INTO answer(username,qnum) VALUES("user67",5);
INSERT INTO answer(username,qnum) VALUES("user67",6);
INSERT INTO answer(username,qnum) VALUES("user67",7);
INSERT INTO answer(username,qnum) VALUES("user67",8);
INSERT INTO answer(username,qnum) VALUES("user67",9);
INSERT INTO answer(username,qnum) VALUES("user67",10);
INSERT INTO answer(username,qnum) VALUES("user67",11);
INSERT INTO answer(username,qnum) VALUES("user67",201);
INSERT INTO answer(username,qnum) VALUES("user68",1);
INSERT INTO answer(username,qnum) VALUES("user68",2);
INSERT INTO answer(username,qnum) VALUES("user68",3);
INSERT INTO answer(username,qnum) VALUES("user68",4);
INSERT INTO answer(username,qnum) VALUES("user68",5);
INSERT INTO answer(username,qnum) VALUES("user68",6);
INSERT INTO answer(username,qnum) VALUES("user68",7);
INSERT INTO answer(username,qnum) VALUES("user68",8);
INSERT INTO answer(username,qnum) VALUES("user68",9);
INSERT INTO answer(username,qnum) VALUES("user68",10);
INSERT INTO answer(username,qnum) VALUES("user68",11);
INSERT INTO answer(username,qnum) VALUES("user68",201);
INSERT INTO answer(username,qnum) VALUES("user69",1);
INSERT INTO answer(username,qnum) VALUES("user69",2);
INSERT INTO answer(username,qnum) VALUES("user69",3);
INSERT INTO answer(username,qnum) VALUES("user69",4);
INSERT INTO answer(username,qnum) VALUES("user69",5);
INSERT INTO answer(username,qnum) VALUES("user69",6);
INSERT INTO answer(username,qnum) VALUES("user69",7);
INSERT INTO answer(username,qnum) VALUES("user69",8);
INSERT INTO answer(username,qnum) VALUES("user69",9);
INSERT INTO answer(username,qnum) VALUES("user69",10);
INSERT INTO answer(username,qnum) VALUES("user69",11);
INSERT INTO answer(username,qnum) VALUES("user69",201);
INSERT INTO answer(username,qnum) VALUES("user70",1);
INSERT INTO answer(username,qnum) VALUES("user70",2);
INSERT INTO answer(username,qnum) VALUES("user70",3);
INSERT INTO answer(username,qnum) VALUES("user70",4);
INSERT INTO answer(username,qnum) VALUES("user70",5);
INSERT INTO answer(username,qnum) VALUES("user70",6);
INSERT INTO answer(username,qnum) VALUES("user70",7);
INSERT INTO answer(username,qnum) VALUES("user70",8);
INSERT INTO answer(username,qnum) VALUES("user70",9);
INSERT INTO answer(username,qnum) VALUES("user70",10);
INSERT INTO answer(username,qnum) VALUES("user70",11);
INSERT INTO answer(username,qnum) VALUES("user70",201);
INSERT INTO answer(username,qnum) VALUES("user71",1);
INSERT INTO answer(username,qnum) VALUES("user71",2);
INSERT INTO answer(username,qnum) VALUES("user71",3);
INSERT INTO answer(username,qnum) VALUES("user71",4);
INSERT INTO answer(username,qnum) VALUES("user71",5);
INSERT INTO answer(username,qnum) VALUES("user71",6);
INSERT INTO answer(username,qnum) VALUES("user71",7);
INSERT INTO answer(username,qnum) VALUES("user71",8);
INSERT INTO answer(username,qnum) VALUES("user71",9);
INSERT INTO answer(username,qnum) VALUES("user71",10);
INSERT INTO answer(username,qnum) VALUES("user71",11);
INSERT INTO answer(username,qnum) VALUES("user71",201);
INSERT INTO answer(username,qnum) VALUES("user72",1);
INSERT INTO answer(username,qnum) VALUES("user72",2);
INSERT INTO answer(username,qnum) VALUES("user72",3);
INSERT INTO answer(username,qnum) VALUES("user72",4);
INSERT INTO answer(username,qnum) VALUES("user72",5);
INSERT INTO answer(username,qnum) VALUES("user72",6);
INSERT INTO answer(username,qnum) VALUES("user72",7);
INSERT INTO answer(username,qnum) VALUES("user72",8);
INSERT INTO answer(username,qnum) VALUES("user72",9);
INSERT INTO answer(username,qnum) VALUES("user72",10);
INSERT INTO answer(username,qnum) VALUES("user72",11);
INSERT INTO answer(username,qnum) VALUES("user72",201);
INSERT INTO answer(username,qnum) VALUES("user73",1);
INSERT INTO answer(username,qnum) VALUES("user73",2);
INSERT INTO answer(username,qnum) VALUES("user73",3);
INSERT INTO answer(username,qnum) VALUES("user73",4);
INSERT INTO answer(username,qnum) VALUES("user73",5);
INSERT INTO answer(username,qnum) VALUES("user73",6);
INSERT INTO answer(username,qnum) VALUES("user73",7);
INSERT INTO answer(username,qnum) VALUES("user73",8);
INSERT INTO answer(username,qnum) VALUES("user73",9);
INSERT INTO answer(username,qnum) VALUES("user73",10);
INSERT INTO answer(username,qnum) VALUES("user73",11);
INSERT INTO answer(username,qnum) VALUES("user73",201);
INSERT INTO answer(username,qnum) VALUES("user74",1);
INSERT INTO answer(username,qnum) VALUES("user74",2);
INSERT INTO answer(username,qnum) VALUES("user74",3);
INSERT INTO answer(username,qnum) VALUES("user74",4);
INSERT INTO answer(username,qnum) VALUES("user74",5);
INSERT INTO answer(username,qnum) VALUES("user74",6);
INSERT INTO answer(username,qnum) VALUES("user74",7);
INSERT INTO answer(username,qnum) VALUES("user74",8);
INSERT INTO answer(username,qnum) VALUES("user74",9);
INSERT INTO answer(username,qnum) VALUES("user74",10);
INSERT INTO answer(username,qnum) VALUES("user74",11);
INSERT INTO answer(username,qnum) VALUES("user74",201);
INSERT INTO answer(username,qnum) VALUES("user75",1);
INSERT INTO answer(username,qnum) VALUES("user75",2);
INSERT INTO answer(username,qnum) VALUES("user75",3);
INSERT INTO answer(username,qnum) VALUES("user75",4);
INSERT INTO answer(username,qnum) VALUES("user75",5);
INSERT INTO answer(username,qnum) VALUES("user75",6);
INSERT INTO answer(username,qnum) VALUES("user75",7);
INSERT INTO answer(username,qnum) VALUES("user75",8);
INSERT INTO answer(username,qnum) VALUES("user75",9);
INSERT INTO answer(username,qnum) VALUES("user75",10);
INSERT INTO answer(username,qnum) VALUES("user75",11);
INSERT INTO answer(username,qnum) VALUES("user75",201);
INSERT INTO answer(username,qnum) VALUES("user76",1);
INSERT INTO answer(username,qnum) VALUES("user76",2);
INSERT INTO answer(username,qnum) VALUES("user76",3);
INSERT INTO answer(username,qnum) VALUES("user76",4);
INSERT INTO answer(username,qnum) VALUES("user76",5);
INSERT INTO answer(username,qnum) VALUES("user76",6);
INSERT INTO answer(username,qnum) VALUES("user76",7);
INSERT INTO answer(username,qnum) VALUES("user76",8);
INSERT INTO answer(username,qnum) VALUES("user76",9);
INSERT INTO answer(username,qnum) VALUES("user76",10);
INSERT INTO answer(username,qnum) VALUES("user76",11);
INSERT INTO answer(username,qnum) VALUES("user76",201);
INSERT INTO answer(username,qnum) VALUES("user77",1);
INSERT INTO answer(username,qnum) VALUES("user77",2);
INSERT INTO answer(username,qnum) VALUES("user77",3);
INSERT INTO answer(username,qnum) VALUES("user77",4);
INSERT INTO answer(username,qnum) VALUES("user77",5);
INSERT INTO answer(username,qnum) VALUES("user77",6);
INSERT INTO answer(username,qnum) VALUES("user77",7);
INSERT INTO answer(username,qnum) VALUES("user77",8);
INSERT INTO answer(username,qnum) VALUES("user77",9);
INSERT INTO answer(username,qnum) VALUES("user77",10);
INSERT INTO answer(username,qnum) VALUES("user77",11);
INSERT INTO answer(username,qnum) VALUES("user77",201);
INSERT INTO answer(username,qnum) VALUES("user78",1);
INSERT INTO answer(username,qnum) VALUES("user78",2);
INSERT INTO answer(username,qnum) VALUES("user78",3);
INSERT INTO answer(username,qnum) VALUES("user78",4);
INSERT INTO answer(username,qnum) VALUES("user78",5);
INSERT INTO answer(username,qnum) VALUES("user78",6);
INSERT INTO answer(username,qnum) VALUES("user78",7);
INSERT INTO answer(username,qnum) VALUES("user78",8);
INSERT INTO answer(username,qnum) VALUES("user78",9);
INSERT INTO answer(username,qnum) VALUES("user78",10);
INSERT INTO answer(username,qnum) VALUES("user78",11);
INSERT INTO answer(username,qnum) VALUES("user78",201);
INSERT INTO answer(username,qnum) VALUES("user79",1);
INSERT INTO answer(username,qnum) VALUES("user79",2);
INSERT INTO answer(username,qnum) VALUES("user79",3);
INSERT INTO answer(username,qnum) VALUES("user79",4);
INSERT INTO answer(username,qnum) VALUES("user79",5);
INSERT INTO answer(username,qnum) VALUES("user79",6);
INSERT INTO answer(username,qnum) VALUES("user79",7);
INSERT INTO answer(username,qnum) VALUES("user79",8);
INSERT INTO answer(username,qnum) VALUES("user79",9);
INSERT INTO answer(username,qnum) VALUES("user79",10);
INSERT INTO answer(username,qnum) VALUES("user79",11);
INSERT INTO answer(username,qnum) VALUES("user79",201);
INSERT INTO answer(username,qnum) VALUES("user80",1);
INSERT INTO answer(username,qnum) VALUES("user80",2);
INSERT INTO answer(username,qnum) VALUES("user80",3);
INSERT INTO answer(username,qnum) VALUES("user80",4);
INSERT INTO answer(username,qnum) VALUES("user80",5);
INSERT INTO answer(username,qnum) VALUES("user80",6);
INSERT INTO answer(username,qnum) VALUES("user80",7);
INSERT INTO answer(username,qnum) VALUES("user80",8);
INSERT INTO answer(username,qnum) VALUES("user80",9);
INSERT INTO answer(username,qnum) VALUES("user80",10);
INSERT INTO answer(username,qnum) VALUES("user80",11);
INSERT INTO answer(username,qnum) VALUES("user80",201);
INSERT INTO answer(username,qnum) VALUES("user81",1);
INSERT INTO answer(username,qnum) VALUES("user81",2);
INSERT INTO answer(username,qnum) VALUES("user81",3);
INSERT INTO answer(username,qnum) VALUES("user81",4);
INSERT INTO answer(username,qnum) VALUES("user81",5);
INSERT INTO answer(username,qnum) VALUES("user81",6);
INSERT INTO answer(username,qnum) VALUES("user81",7);
INSERT INTO answer(username,qnum) VALUES("user81",8);
INSERT INTO answer(username,qnum) VALUES("user81",9);
INSERT INTO answer(username,qnum) VALUES("user81",10);
INSERT INTO answer(username,qnum) VALUES("user81",11);
INSERT INTO answer(username,qnum) VALUES("user81",201);
INSERT INTO answer(username,qnum) VALUES("user82",1);
INSERT INTO answer(username,qnum) VALUES("user82",2);
INSERT INTO answer(username,qnum) VALUES("user82",3);
INSERT INTO answer(username,qnum) VALUES("user82",4);
INSERT INTO answer(username,qnum) VALUES("user82",5);
INSERT INTO answer(username,qnum) VALUES("user82",6);
INSERT INTO answer(username,qnum) VALUES("user82",7);
INSERT INTO answer(username,qnum) VALUES("user82",8);
INSERT INTO answer(username,qnum) VALUES("user82",9);
INSERT INTO answer(username,qnum) VALUES("user82",10);
INSERT INTO answer(username,qnum) VALUES("user82",11);
INSERT INTO answer(username,qnum) VALUES("user82",201);
INSERT INTO answer(username,qnum) VALUES("user83",1);
INSERT INTO answer(username,qnum) VALUES("user83",2);
INSERT INTO answer(username,qnum) VALUES("user83",3);
INSERT INTO answer(username,qnum) VALUES("user83",4);
INSERT INTO answer(username,qnum) VALUES("user83",5);
INSERT INTO answer(username,qnum) VALUES("user83",6);
INSERT INTO answer(username,qnum) VALUES("user83",7);
INSERT INTO answer(username,qnum) VALUES("user83",8);
INSERT INTO answer(username,qnum) VALUES("user83",9);
INSERT INTO answer(username,qnum) VALUES("user83",10);
INSERT INTO answer(username,qnum) VALUES("user83",11);
INSERT INTO answer(username,qnum) VALUES("user83",201);
INSERT INTO answer(username,qnum) VALUES("user84",1);
INSERT INTO answer(username,qnum) VALUES("user84",2);
INSERT INTO answer(username,qnum) VALUES("user84",3);
INSERT INTO answer(username,qnum) VALUES("user84",4);
INSERT INTO answer(username,qnum) VALUES("user84",5);
INSERT INTO answer(username,qnum) VALUES("user84",6);
INSERT INTO answer(username,qnum) VALUES("user84",7);
INSERT INTO answer(username,qnum) VALUES("user84",8);
INSERT INTO answer(username,qnum) VALUES("user84",9);
INSERT INTO answer(username,qnum) VALUES("user84",10);
INSERT INTO answer(username,qnum) VALUES("user84",11);
INSERT INTO answer(username,qnum) VALUES("user84",201);
INSERT INTO answer(username,qnum) VALUES("user85",1);
INSERT INTO answer(username,qnum) VALUES("user85",2);
INSERT INTO answer(username,qnum) VALUES("user85",3);
INSERT INTO answer(username,qnum) VALUES("user85",4);
INSERT INTO answer(username,qnum) VALUES("user85",5);
INSERT INTO answer(username,qnum) VALUES("user85",6);
INSERT INTO answer(username,qnum) VALUES("user85",7);
INSERT INTO answer(username,qnum) VALUES("user85",8);
INSERT INTO answer(username,qnum) VALUES("user85",9);
INSERT INTO answer(username,qnum) VALUES("user85",10);
INSERT INTO answer(username,qnum) VALUES("user85",11);
INSERT INTO answer(username,qnum) VALUES("user85",201);
INSERT INTO answer(username,qnum) VALUES("user86",1);
INSERT INTO answer(username,qnum) VALUES("user86",2);
INSERT INTO answer(username,qnum) VALUES("user86",3);
INSERT INTO answer(username,qnum) VALUES("user86",4);
INSERT INTO answer(username,qnum) VALUES("user86",5);
INSERT INTO answer(username,qnum) VALUES("user86",6);
INSERT INTO answer(username,qnum) VALUES("user86",7);
INSERT INTO answer(username,qnum) VALUES("user86",8);
INSERT INTO answer(username,qnum) VALUES("user86",9);
INSERT INTO answer(username,qnum) VALUES("user86",10);
INSERT INTO answer(username,qnum) VALUES("user86",11);
INSERT INTO answer(username,qnum) VALUES("user86",201);
INSERT INTO answer(username,qnum) VALUES("user87",1);
INSERT INTO answer(username,qnum) VALUES("user87",2);
INSERT INTO answer(username,qnum) VALUES("user87",3);
INSERT INTO answer(username,qnum) VALUES("user87",4);
INSERT INTO answer(username,qnum) VALUES("user87",5);
INSERT INTO answer(username,qnum) VALUES("user87",6);
INSERT INTO answer(username,qnum) VALUES("user87",7);
INSERT INTO answer(username,qnum) VALUES("user87",8);
INSERT INTO answer(username,qnum) VALUES("user87",9);
INSERT INTO answer(username,qnum) VALUES("user87",10);
INSERT INTO answer(username,qnum) VALUES("user87",11);
INSERT INTO answer(username,qnum) VALUES("user87",201);
INSERT INTO answer(username,qnum) VALUES("user88",1);
INSERT INTO answer(username,qnum) VALUES("user88",2);
INSERT INTO answer(username,qnum) VALUES("user88",3);
INSERT INTO answer(username,qnum) VALUES("user88",4);
INSERT INTO answer(username,qnum) VALUES("user88",5);
INSERT INTO answer(username,qnum) VALUES("user88",6);
INSERT INTO answer(username,qnum) VALUES("user88",7);
INSERT INTO answer(username,qnum) VALUES("user88",8);
INSERT INTO answer(username,qnum) VALUES("user88",9);
INSERT INTO answer(username,qnum) VALUES("user88",10);
INSERT INTO answer(username,qnum) VALUES("user88",11);
INSERT INTO answer(username,qnum) VALUES("user88",201);
INSERT INTO answer(username,qnum) VALUES("user89",1);
INSERT INTO answer(username,qnum) VALUES("user89",2);
INSERT INTO answer(username,qnum) VALUES("user89",3);
INSERT INTO answer(username,qnum) VALUES("user89",4);
INSERT INTO answer(username,qnum) VALUES("user89",5);
INSERT INTO answer(username,qnum) VALUES("user89",6);
INSERT INTO answer(username,qnum) VALUES("user89",7);
INSERT INTO answer(username,qnum) VALUES("user89",8);
INSERT INTO answer(username,qnum) VALUES("user89",9);
INSERT INTO answer(username,qnum) VALUES("user89",10);
INSERT INTO answer(username,qnum) VALUES("user89",11);
INSERT INTO answer(username,qnum) VALUES("user89",201);
INSERT INTO answer(username,qnum) VALUES("user90",1);
INSERT INTO answer(username,qnum) VALUES("user90",2);
INSERT INTO answer(username,qnum) VALUES("user90",3);
INSERT INTO answer(username,qnum) VALUES("user90",4);
INSERT INTO answer(username,qnum) VALUES("user90",5);
INSERT INTO answer(username,qnum) VALUES("user90",6);
INSERT INTO answer(username,qnum) VALUES("user90",7);
INSERT INTO answer(username,qnum) VALUES("user90",8);
INSERT INTO answer(username,qnum) VALUES("user90",9);
INSERT INTO answer(username,qnum) VALUES("user90",10);
INSERT INTO answer(username,qnum) VALUES("user90",11);
INSERT INTO answer(username,qnum) VALUES("user90",201);
INSERT INTO answer(username,qnum) VALUES("user91",1);
INSERT INTO answer(username,qnum) VALUES("user91",2);
INSERT INTO answer(username,qnum) VALUES("user91",3);
INSERT INTO answer(username,qnum) VALUES("user91",4);
INSERT INTO answer(username,qnum) VALUES("user91",5);
INSERT INTO answer(username,qnum) VALUES("user91",6);
INSERT INTO answer(username,qnum) VALUES("user91",7);
INSERT INTO answer(username,qnum) VALUES("user91",8);
INSERT INTO answer(username,qnum) VALUES("user91",9);
INSERT INTO answer(username,qnum) VALUES("user91",10);
INSERT INTO answer(username,qnum) VALUES("user91",11);
INSERT INTO answer(username,qnum) VALUES("user91",201);
INSERT INTO answer(username,qnum) VALUES("user92",1);
INSERT INTO answer(username,qnum) VALUES("user92",2);
INSERT INTO answer(username,qnum) VALUES("user92",3);
INSERT INTO answer(username,qnum) VALUES("user92",4);
INSERT INTO answer(username,qnum) VALUES("user92",5);
INSERT INTO answer(username,qnum) VALUES("user92",6);
INSERT INTO answer(username,qnum) VALUES("user92",7);
INSERT INTO answer(username,qnum) VALUES("user92",8);
INSERT INTO answer(username,qnum) VALUES("user92",9);
INSERT INTO answer(username,qnum) VALUES("user92",10);
INSERT INTO answer(username,qnum) VALUES("user92",11);
INSERT INTO answer(username,qnum) VALUES("user92",201);
INSERT INTO answer(username,qnum) VALUES("user93",1);
INSERT INTO answer(username,qnum) VALUES("user93",2);
INSERT INTO answer(username,qnum) VALUES("user93",3);
INSERT INTO answer(username,qnum) VALUES("user93",4);
INSERT INTO answer(username,qnum) VALUES("user93",5);
INSERT INTO answer(username,qnum) VALUES("user93",6);
INSERT INTO answer(username,qnum) VALUES("user93",7);
INSERT INTO answer(username,qnum) VALUES("user93",8);
INSERT INTO answer(username,qnum) VALUES("user93",9);
INSERT INTO answer(username,qnum) VALUES("user93",10);
INSERT INTO answer(username,qnum) VALUES("user93",11);
INSERT INTO answer(username,qnum) VALUES("user93",201);
INSERT INTO answer(username,qnum) VALUES("user94",1);
INSERT INTO answer(username,qnum) VALUES("user94",2);
INSERT INTO answer(username,qnum) VALUES("user94",3);
INSERT INTO answer(username,qnum) VALUES("user94",4);
INSERT INTO answer(username,qnum) VALUES("user94",5);
INSERT INTO answer(username,qnum) VALUES("user94",6);
INSERT INTO answer(username,qnum) VALUES("user94",7);
INSERT INTO answer(username,qnum) VALUES("user94",8);
INSERT INTO answer(username,qnum) VALUES("user94",9);
INSERT INTO answer(username,qnum) VALUES("user94",10);
INSERT INTO answer(username,qnum) VALUES("user94",11);
INSERT INTO answer(username,qnum) VALUES("user94",201);
INSERT INTO answer(username,qnum) VALUES("user95",1);
INSERT INTO answer(username,qnum) VALUES("user95",2);
INSERT INTO answer(username,qnum) VALUES("user95",3);
INSERT INTO answer(username,qnum) VALUES("user95",4);
INSERT INTO answer(username,qnum) VALUES("user95",5);
INSERT INTO answer(username,qnum) VALUES("user95",6);
INSERT INTO answer(username,qnum) VALUES("user95",7);
INSERT INTO answer(username,qnum) VALUES("user95",8);
INSERT INTO answer(username,qnum) VALUES("user95",9);
INSERT INTO answer(username,qnum) VALUES("user95",10);
INSERT INTO answer(username,qnum) VALUES("user95",11);
INSERT INTO answer(username,qnum) VALUES("user95",201);
INSERT INTO answer(username,qnum) VALUES("user96",1);
INSERT INTO answer(username,qnum) VALUES("user96",2);
INSERT INTO answer(username,qnum) VALUES("user96",3);
INSERT INTO answer(username,qnum) VALUES("user96",4);
INSERT INTO answer(username,qnum) VALUES("user96",5);
INSERT INTO answer(username,qnum) VALUES("user96",6);
INSERT INTO answer(username,qnum) VALUES("user96",7);
INSERT INTO answer(username,qnum) VALUES("user96",8);
INSERT INTO answer(username,qnum) VALUES("user96",9);
INSERT INTO answer(username,qnum) VALUES("user96",10);
INSERT INTO answer(username,qnum) VALUES("user96",11);
INSERT INTO answer(username,qnum) VALUES("user96",201);
INSERT INTO answer(username,qnum) VALUES("user97",1);
INSERT INTO answer(username,qnum) VALUES("user97",2);
INSERT INTO answer(username,qnum) VALUES("user97",3);
INSERT INTO answer(username,qnum) VALUES("user97",4);
INSERT INTO answer(username,qnum) VALUES("user97",5);
INSERT INTO answer(username,qnum) VALUES("user97",6);
INSERT INTO answer(username,qnum) VALUES("user97",7);
INSERT INTO answer(username,qnum) VALUES("user97",8);
INSERT INTO answer(username,qnum) VALUES("user97",9);
INSERT INTO answer(username,qnum) VALUES("user97",10);
INSERT INTO answer(username,qnum) VALUES("user97",11);
INSERT INTO answer(username,qnum) VALUES("user97",201);
INSERT INTO answer(username,qnum) VALUES("user98",1);
INSERT INTO answer(username,qnum) VALUES("user98",2);
INSERT INTO answer(username,qnum) VALUES("user98",3);
INSERT INTO answer(username,qnum) VALUES("user98",4);
INSERT INTO answer(username,qnum) VALUES("user98",5);
INSERT INTO answer(username,qnum) VALUES("user98",6);
INSERT INTO answer(username,qnum) VALUES("user98",7);
INSERT INTO answer(username,qnum) VALUES("user98",8);
INSERT INTO answer(username,qnum) VALUES("user98",9);
INSERT INTO answer(username,qnum) VALUES("user98",10);
INSERT INTO answer(username,qnum) VALUES("user98",11);
INSERT INTO answer(username,qnum) VALUES("user98",201);
INSERT INTO answer(username,qnum) VALUES("user99",1);
INSERT INTO answer(username,qnum) VALUES("user99",2);
INSERT INTO answer(username,qnum) VALUES("user99",3);
INSERT INTO answer(username,qnum) VALUES("user99",4);
INSERT INTO answer(username,qnum) VALUES("user99",5);
INSERT INTO answer(username,qnum) VALUES("user99",6);
INSERT INTO answer(username,qnum) VALUES("user99",7);
INSERT INTO answer(username,qnum) VALUES("user99",8);
INSERT INTO answer(username,qnum) VALUES("user99",9);
INSERT INTO answer(username,qnum) VALUES("user99",10);
INSERT INTO answer(username,qnum) VALUES("user99",11);
INSERT INTO answer(username,qnum) VALUES("user99",201);
