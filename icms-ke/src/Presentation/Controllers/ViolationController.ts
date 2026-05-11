import { ReportViolationUseCase, ReportViolationCommand, ReportViolationResult } from "@/Application/UseCases/ReportViolationUseCase";
import { SecurityContext } from "@/Domain/Services/Ports";

export class ViolationController {
  constructor(private readonly reportViolationUseCase: ReportViolationUseCase) {}

  async reportViolation(
    command: ReportViolationCommand,
    _context: SecurityContext
  ): Promise<ReportViolationResult> {
    return this.reportViolationUseCase.execute(command);
  }
}
