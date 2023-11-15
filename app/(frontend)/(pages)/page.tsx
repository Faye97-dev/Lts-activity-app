import {
  ROLE_ADMIN,
  ROLE_DEFAULT,
  ROLE_SUPER_ADMIN
} from 'config/global.config';
import { auth } from 'lib/auth';
import { redirect } from 'next/navigation';

export default async function IndexPage() {
  const session = await auth();
  if (!session?.user) redirect('api/auth/signin'); // todo update to /login

  if (session?.user) {
    switch (session.user?.token.role.slug) {
      case ROLE_SUPER_ADMIN:
        redirect('/dashboard');
      case ROLE_ADMIN:
        redirect('/departments');
      default:
        redirect('/activities');
    }
  }

  return <></>;
}
