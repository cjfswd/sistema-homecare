import { useParams } from 'react-router-dom';
import { PatientDetail } from '@/modules/patients';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <PatientDetail patientId={id!} />;
}
