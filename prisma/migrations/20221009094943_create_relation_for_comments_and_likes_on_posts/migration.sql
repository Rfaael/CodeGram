/*
  Warnings:

  - You are about to drop the column `comments` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "comments",
DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "RelationLikesPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelationLikesPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationCommentsPost" (
    "id" TEXT NOT NULL,
    "commentContent" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelationCommentsPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelationLikesPost_id_key" ON "RelationLikesPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RelationCommentsPost_id_key" ON "RelationCommentsPost"("id");

-- AddForeignKey
ALTER TABLE "RelationLikesPost" ADD CONSTRAINT "RelationLikesPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationLikesPost" ADD CONSTRAINT "RelationLikesPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationCommentsPost" ADD CONSTRAINT "RelationCommentsPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationCommentsPost" ADD CONSTRAINT "RelationCommentsPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
