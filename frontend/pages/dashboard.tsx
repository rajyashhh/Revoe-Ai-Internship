import Head from 'next/head';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Google Sheets Dashboard</title>
        <meta name="description" content="Real-time Google Sheets Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Dashboard />
      </main>
    </>
  );
}