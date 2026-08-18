export const SUBMISSION_STATUS_LABEL: Record<string, string> = {
  QUEUED: "Queued",
  OCR_PROCESSING: "Reading your handwriting…",
  EVALUATING: "Grading against the rubric…",
  COMPLETED: "Graded",
  FAILED: "Something went wrong",
};

export function submissionStatusLabel(status: string): string {
  return SUBMISSION_STATUS_LABEL[status] ?? status;
}
