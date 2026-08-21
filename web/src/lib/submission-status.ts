export const SUBMISSION_STATUS_LABEL: Record<string, string> = {
  QUEUED: "সারিতে আছে",
  OCR_PROCESSING: "তোমার হাতের লেখা পড়া হচ্ছে…",
  EVALUATING: "রুব্রিক অনুযায়ী মূল্যায়ন হচ্ছে…",
  COMPLETED: "ফলাফল তৈরি",
  FAILED: "কিছু একটা সমস্যা হয়েছে",
};

export function submissionStatusLabel(status: string): string {
  return SUBMISSION_STATUS_LABEL[status] ?? status;
}
