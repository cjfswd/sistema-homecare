import { useParams } from 'react-router-dom';
import { ProfessionalDetail } from '@/modules/professionals';

export default function ProfessionalDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <ProfessionalDetail professionalId={id!} />;
}
