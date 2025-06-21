/*
  Warnings:

  - You are about to drop the column `action` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `permissionCode` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionName` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "permissionName" TEXT NOT NULL,
    "permissionCode" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Permission" ("description", "id") SELECT "description", "id" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
