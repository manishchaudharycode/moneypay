/*
  Warnings:

  - Added the required column `balance` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "balance" INTEGER NOT NULL;
