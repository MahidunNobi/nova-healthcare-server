-- AlterTable
ALTER TABLE "public"."admins" ALTER COLUMN "profilePhoto" DROP NOT NULL,
ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "needPasswordChange" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
