

Use rateMe;

CREATE TABLE Users(
   id INT NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (id),
   full_name                       VARCHAR(70)  NOT NULL  
  ,email             VARCHAR(30)  NOT NULL UNIQUE
  ,password        VARCHAR(500)  NOT NULL
);