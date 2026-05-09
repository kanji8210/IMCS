-- CreateEnum
CREATE TYPE "public"."CaseStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RECOMMENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "public"."Individual" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ETARecord" (
    "id" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "etaNumber" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ETARecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImmigrationCase" (
    "id" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "assignedOfficerId" TEXT NOT NULL,
    "status" "public"."CaseStatus" NOT NULL DEFAULT 'OPEN',
    "riskLevel" "public"."RiskLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImmigrationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recommendation" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "authorOfficerId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Individual_email_key" ON "public"."Individual"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ETARecord_etaNumber_key" ON "public"."ETARecord"("etaNumber");

-- CreateIndex
CREATE INDEX "ETARecord_individualId_idx" ON "public"."ETARecord"("individualId");

-- CreateIndex
CREATE INDEX "ETARecord_expiresAt_idx" ON "public"."ETARecord"("expiresAt");

-- CreateIndex
CREATE INDEX "ImmigrationCase_individualId_idx" ON "public"."ImmigrationCase"("individualId");

-- CreateIndex
CREATE INDEX "ImmigrationCase_assignedOfficerId_idx" ON "public"."ImmigrationCase"("assignedOfficerId");

-- CreateIndex
CREATE INDEX "ImmigrationCase_status_idx" ON "public"."ImmigrationCase"("status");

-- CreateIndex
CREATE INDEX "Recommendation_caseId_idx" ON "public"."Recommendation"("caseId");

-- AddForeignKey
ALTER TABLE "public"."ETARecord" ADD CONSTRAINT "ETARecord_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "public"."Individual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImmigrationCase" ADD CONSTRAINT "ImmigrationCase_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "public"."Individual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recommendation" ADD CONSTRAINT "Recommendation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."ImmigrationCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
