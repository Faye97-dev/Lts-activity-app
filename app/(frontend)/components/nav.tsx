import Navbar from './navbar';
import { auth } from '../../(backend)/api/auth/[...nextauth]/route';

export default async function Nav() {
  const session = await auth();
  return <Navbar user={session?.user} />;
}
