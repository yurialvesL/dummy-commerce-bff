/*
  Warnings:

  - You are about to drop the column `passaword_account` on the `User` table. All the data in the column will be lost.
  - Added the required column `password_account` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passaword_account",
ADD COLUMN     "password_account" TEXT NOT NULL;
