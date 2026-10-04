import { POST as handleChat, maxDuration } from '@/app/api/tutor/chat/route';

export { maxDuration };

export async function POST(req: Request) {
  return handleChat(req);
}
