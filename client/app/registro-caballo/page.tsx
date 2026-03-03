import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RegistroCaballoForm from './RegistroCaballoForm'; 

export default async function RegistroCaballoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('horse_trust_token');

  if (!token?.value) {
    redirect('/login');
  }

  return <RegistroCaballoForm />;
}