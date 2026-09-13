import { describe, expect, it } from "vitest";
import { isHttpUrl, isOwnedSubmissionPagePath } from "@/lib/storage/submission-pages";

describe("isOwnedSubmissionPagePath", () => {
  const uid = "11111111-1111-1111-1111-111111111111";

  it("accepts owned nested paths", () => {
    expect(isOwnedSubmissionPagePath(uid, `${uid}/folder/1.jpg`)).toBe(true);
  });

  it("rejects other users and URLs", () => {
    expect(isOwnedSubmissionPagePath(uid, `other/folder/1.jpg`)).toBe(false);
    expect(isOwnedSubmissionPagePath(uid, `https://example.com/x.jpg`)).toBe(false);
    expect(isOwnedSubmissionPagePath(uid, `${uid}/../escape.jpg`)).toBe(false);
    expect(isOwnedSubmissionPagePath(uid, `${uid}/only.jpg`)).toBe(false);
  });
});

describe("isHttpUrl", () => {
  it("detects http(s)", () => {
    expect(isHttpUrl("https://x/y")).toBe(true);
    expect(isHttpUrl("uid/folder/1.jpg")).toBe(false);
  });
});
