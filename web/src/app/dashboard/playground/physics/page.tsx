import type { Metadata } from 'next';
import { PhysicsCatalogView } from '@/components/physics-playground/PhysicsCatalogView';

export const metadata: Metadata = {
  title: 'পদার্থবিজ্ঞান ল্যাব | SheraTutor',
  description: 'NCTB SSC Physics Interactive Laboratory - Visual sandboxes, concept trees, formula decoders, and board exam traps for all 14 chapters.',
};

export default function PhysicsPlaygroundPage() {
  return <PhysicsCatalogView />;
}
