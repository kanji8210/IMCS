import { SecurityContext } from "@/Domain/Services/Ports";

export function buildSecurityContext(headers: Headers): SecurityContext {
  const actorId = headers.get("x-actor-id") ?? "";
  const roleRaw = headers.get("x-actor-role") ?? "OFFICER";
  const jurisdiction = headers.get("x-actor-jurisdiction") ?? "GOK";

  const role = ["OFFICER", "SUPERVISOR", "ADMIN"].includes(roleRaw)
    ? (roleRaw as SecurityContext["role"])
    : "OFFICER";

  return { actorId, role, jurisdiction };
}
