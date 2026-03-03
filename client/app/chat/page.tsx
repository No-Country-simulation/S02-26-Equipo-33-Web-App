import { cookies } from 'next/headers';
import { getMe } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient'; 

export default async function Page() {
  const user = await getMe();

  if (!user) {
    redirect('/login');
  }

  return <ChatClient currentUser={user} />;
}