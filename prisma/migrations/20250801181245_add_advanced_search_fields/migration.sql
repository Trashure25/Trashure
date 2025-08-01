-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "collaboration" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designer" TEXT,
ADD COLUMN     "era" TEXT,
ADD COLUMN     "exclusivity" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "releaseYear" INTEGER,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "style" TEXT;

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedSearch_userId_idx" ON "SavedSearch"("userId");

-- CreateIndex
CREATE INDEX "SavedSearch_createdAt_idx" ON "SavedSearch"("createdAt");

-- CreateIndex
CREATE INDEX "SavedSearch_emailNotifications_idx" ON "SavedSearch"("emailNotifications");

-- CreateIndex
CREATE INDEX "Listing_style_idx" ON "Listing"("style");

-- CreateIndex
CREATE INDEX "Listing_color_idx" ON "Listing"("color");

-- CreateIndex
CREATE INDEX "Listing_material_idx" ON "Listing"("material");

-- CreateIndex
CREATE INDEX "Listing_season_idx" ON "Listing"("season");

-- CreateIndex
CREATE INDEX "Listing_era_idx" ON "Listing"("era");

-- CreateIndex
CREATE INDEX "Listing_releaseYear_idx" ON "Listing"("releaseYear");

-- CreateIndex
CREATE INDEX "Listing_department_idx" ON "Listing"("department");

-- CreateIndex
CREATE INDEX "Listing_location_idx" ON "Listing"("location");

-- CreateIndex
CREATE INDEX "Listing_designer_idx" ON "Listing"("designer");

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
