import { auth } from '@/api/auth/[...nextauth]/route';
import Navbar from '@/components/navbar';

export default async function Nav() {
  const session = await auth();
  return <Navbar user={session?.user} />;
}
