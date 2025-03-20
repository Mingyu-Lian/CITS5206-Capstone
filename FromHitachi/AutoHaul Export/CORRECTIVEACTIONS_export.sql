--------------------------------------------------------
--  File created - Thursday-May-10-2018   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table EWMS_CORRECTIVEACTIONS
--------------------------------------------------------

  CREATE TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" 
   (	"CORRECTIVEACTIONID" RAW(16), 
	"EVENTTIME" TIMESTAMP (6), 
	"STARTTIME" TIMESTAMP (6), 
	"COMPLETIONTIME" TIMESTAMP (6), 
	"DIAGNOSTICDURATIONMINUTES" NUMBER(10,0), 
	"ACTIVEREPAIRDURATIONMINUTES" NUMBER(10,0), 
	"VERIFICATIONDURATIONMINUTES" NUMBER(10,0), 
	"DIMSTICKET" VARCHAR2(4000 CHAR), 
	"RECORDCOMMENT" VARCHAR2(4000 CHAR), 
	"STATUS" VARCHAR2(4000 CHAR), 
	"VERIFICATIONCOMMENT" VARCHAR2(4000 CHAR), 
	"CORRECTIVEACTIONDISCRIMINATOR" VARCHAR2(4000 CHAR), 
	"ASSETID" RAW(16), 
	"INSTALLERID" RAW(16), 
	"VERIFIERID" RAW(16), 
	"COMPONENTID" RAW(16)
   ) SEGMENT CREATION DEFERRED 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  TABLESPACE "USERS" ;

   COMMENT ON COLUMN "AUTOHAUL"."EWMS_CORRECTIVEACTIONS"."CORRECTIVEACTIONID" IS 'A globally unique identifier suitable for use in an occasionally connected distributed system as well as a local database.';
   COMMENT ON COLUMN "AUTOHAUL"."EWMS_CORRECTIVEACTIONS"."EVENTTIME" IS 'The point in time at which this asset event occurred. Note that this time can be manually entered in which case it is the perceived time of occurrence.';
   COMMENT ON TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS"  IS 'The recording of an event occurrence that relates to an asset. This is a base class for different types of asset events which then have specific properties based on the event context.';
REM INSERTING into AUTOHAUL.EWMS_CORRECTIVEACTIONS
SET DEFINE OFF;
--------------------------------------------------------
--  DDL for Index PK_EWMS_CORRECTIVEACTIONS
--------------------------------------------------------

  CREATE UNIQUE INDEX "AUTOHAUL"."PK_EWMS_CORRECTIVEACTIONS" ON "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" ("CORRECTIVEACTIONID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  TABLESPACE "USERS" ;
--------------------------------------------------------
--  Constraints for Table EWMS_CORRECTIVEACTIONS
--------------------------------------------------------

  ALTER TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" MODIFY ("CORRECTIVEACTIONID" NOT NULL ENABLE);
  ALTER TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" MODIFY ("EVENTTIME" NOT NULL ENABLE);
  ALTER TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" MODIFY ("CORRECTIVEACTIONDISCRIMINATOR" NOT NULL ENABLE);
  ALTER TABLE "AUTOHAUL"."EWMS_CORRECTIVEACTIONS" ADD CONSTRAINT "PK_EWMS_CORRECTIVEACTIONS" PRIMARY KEY ("CORRECTIVEACTIONID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  TABLESPACE "USERS"  ENABLE;
