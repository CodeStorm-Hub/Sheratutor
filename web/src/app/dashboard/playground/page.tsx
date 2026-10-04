import { redirect } from 'next/navigation';

export const metadata = {
  title: 'ইন্টারেক্টিভ ল্যাব ও ভার্চুয়াল গাইডবুক (Playground) | SheraTutor',
  description: 'এনসিটিবি নবম-দশম শ্রেণির সাধারণ গণিত ও পদার্থবিজ্ঞানের ইন্টারেক্টিভ সিমুলেশন ও ৫-ধাপের ভার্চুয়াল গাইডবুক।',
};

export default function PlaygroundRedirectPage() {
  redirect('/dashboard/playground/v2');
}
