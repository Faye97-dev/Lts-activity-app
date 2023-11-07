import { Card, Title, Text } from '@tremor/react';
import Search from '@/components/search';
import { db } from 'db';

// import UsersTable from './components/table';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  // const result = await sql`
  //   SELECT id, name, username, email
  //   FROM users
  //   WHERE name ILIKE ${'%' + search + '%'};
  // `;
  // const users = result.rows as User[];

  // const users = await db.query.users.findMany({
  //   with: {
  //     role: true
  //   }
  // });
  // console.log(users, 'users');
  db;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A list of users retrieved from a Postgres database.</Text>
      <Search />
      <Card className="mt-6">{/* <UsersTable users={users} /> */}</Card>
    </main>
  );
}
