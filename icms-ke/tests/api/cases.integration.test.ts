import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";

import { POST as postDocumentRejection } from "@/app/api/cases/document-rejection/route";
import { POST as postFlagExpiringEta } from "@/app/api/cases/flag-expiring-eta/route";
import { POST as postNotifyIndividual } from "@/app/api/cases/notify-individual/route";
import { POST as postRecommendations } from "@/app/api/cases/recommendations/route";
import { prisma } from "@/Infrastructure/Persistence/prismaClient";

const actorHeaders = {
  "content-type": "application/json",
  "x-actor-id": "officer-1",
  "x-actor-role": "OFFICER",
  "x-actor-jurisdiction": "KE",
};

const seededIndividualId = "ind-it-1";
const seededEtaId = "eta-it-1";
const seededEtaNumber = "ETA-IT-0001";

function buildRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: actorHeaders,
    body: JSON.stringify(body),
  });
}

beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set to run integration tests");
  }

  await prisma.individual.upsert({
    where: { id: seededIndividualId },
    update: {
      fullName: "Integration Test Person",
      email: "integration.person@example.com",
      phoneNumber: "+254700000123",
      countryCode: "KE",
    },
    create: {
      id: seededIndividualId,
      fullName: "Integration Test Person",
      email: "integration.person@example.com",
      phoneNumber: "+254700000123",
      countryCode: "KE",
    },
  });

  await prisma.eTARecord.upsert({
    where: { id: seededEtaId },
    update: {
      individualId: seededIndividualId,
      etaNumber: seededEtaNumber,
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    create: {
      id: seededEtaId,
      individualId: seededIndividualId,
      etaNumber: seededEtaNumber,
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  });
});

describe("Case API Integration", () => {
  it("flags expiring ETA records", async () => {
    const request = buildRequest("http://localhost/api/cases/flag-expiring-eta", { windowDays: 30 });
    const response = await postFlagExpiringEta(request);
    const payload = (await response.json()) as { flagged: number };

    expect(response.status).toBe(200);
    expect(payload.flagged).toBeGreaterThanOrEqual(1);
  });

  it("creates a case from document rejection", async () => {
    const request = buildRequest("http://localhost/api/cases/document-rejection", {
      individualId: seededIndividualId,
      assignedOfficerId: "officer-1",
      rejectionReason: "Incomplete supporting documents",
      riskLevel: "LOW",
    });

    const response = await postDocumentRejection(request);
    const payload = (await response.json()) as { caseId: string };

    expect(response.status).toBe(200);
    expect(payload.caseId.startsWith("case_")).toBe(true);
  });

  it("submits recommendation for an existing case", async () => {
    const createRequest = buildRequest("http://localhost/api/cases/document-rejection", {
      individualId: seededIndividualId,
      assignedOfficerId: "officer-1",
      rejectionReason: "Need recommendation testing case",
      riskLevel: "LOW",
    });

    const createResponse = await postDocumentRejection(createRequest);
    const createPayload = (await createResponse.json()) as { caseId: string };

    const recommendationRequest = buildRequest("http://localhost/api/cases/recommendations", {
      caseId: createPayload.caseId,
      summary: "Recommend approval after officer review.",
    });

    const recommendationResponse = await postRecommendations(recommendationRequest);
    const recommendationPayload = (await recommendationResponse.json()) as { recommendationId: string };

    expect(recommendationResponse.status).toBe(200);
    expect(recommendationPayload.recommendationId.startsWith("rec_")).toBe(true);
  });

  it("notifies an existing individual", async () => {
    const request = buildRequest("http://localhost/api/cases/notify-individual", {
      individualId: seededIndividualId,
      message: "Integration test notification",
    });

    const response = await postNotifyIndividual(request);
    const payload = (await response.json()) as { notified: boolean };

    expect(response.status).toBe(200);
    expect(payload.notified).toBe(true);
  });
});
