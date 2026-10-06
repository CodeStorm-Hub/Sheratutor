import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PHYSICS_CHAPTERS_REGISTRY } from '@/lib/physics-playground/registry';
import { getPhysicsChapterData } from '@/lib/physics-playground/chapters';
import { PhysicsGuidebookShell } from '@/components/physics-playground/PhysicsGuidebookShell';
import DashboardLoading from '@/app/dashboard/loading';

interface ChapterPageProps {
  params: Promise<{
    chapterNo: string;
  }>;
}

export async function generateStaticParams() {
  return PHYSICS_CHAPTERS_REGISTRY.map((c) => ({
    chapterNo: String(c.chapterNo),
  }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapterNo } = await params;
  const num = parseInt(chapterNo, 10);
  const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === num);

  if (!meta) {
    return {
      title: 'অধ্যায় পাওয়া যায়নি | SheraTutor',
    };
  }

  return {
    title: `${meta.titleBn} (অধ্যায় ${meta.chapterNo}) | পদার্থবিজ্ঞান ল্যাব | SheraTutor`,
    description: meta.overviewBn,
  };
}

async function ChapterGuidebookContent({ params }: ChapterPageProps) {
  const { chapterNo } = await params;
  const num = parseInt(chapterNo, 10);

  if (isNaN(num) || num < 1 || num > 14) {
    notFound();
  }

  const chapterData = getPhysicsChapterData(num);

  if (!chapterData) {
    notFound();
  }

  return <PhysicsGuidebookShell chapterData={chapterData} />;
}

export default function PhysicsChapterGuidebookPage({ params }: ChapterPageProps) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <ChapterGuidebookContent params={params} />
    </Suspense>
  );
}
