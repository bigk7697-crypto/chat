import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
      <Head>
        <title>Secure Chat - Developer Collaboration Platform</title>
        <meta name="description" content="Secure real-time messaging for developers and ethical hackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 w-full max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Secure Chat</h1>
          <p className="text-xl mb-8">
            A secure communication platform for developers and ethical hackers to collaborate without fear of being monitored.
          </p>
          <div className="space-x-4">
            <a href="/login" className="bg-white text-blue-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Sign In
            </a>
            <a href="/register" className="border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-6 text-sm text-white/70">
        &copy; {new Date().getFullYear()} Secure Chat. All rights reserved.
      </footer>
    </div>
  );
}