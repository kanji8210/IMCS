import { PolicyService, SecurityContext } from "@/Domain/Services/Ports";

export class RolePolicyService implements PolicyService {
  canExecute(action: string, context: SecurityContext, resourceOwnerId?: string): boolean {
    if (context.role === "ADMIN") return true;

    if (context.role === "SUPERVISOR") {
      return action !== "submitRecommendation" || !!resourceOwnerId;
    }

    if (context.role === "OFFICER") {
      if (action === "processDocumentRejection" || action === "submitRecommendation") {
        return resourceOwnerId === context.actorId;
      }
      return action === "flagExpiringEta" || action === "notifyIndividual";
    }

    return false;
  }
}
