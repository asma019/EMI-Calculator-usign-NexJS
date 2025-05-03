import EMICalculator from './components/EMICalculator';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <EMICalculator />
      
      <div className="mt-6 text-center">
        <Link 
          href="/iframe-embed-code.html" 
          className="text-blue-600 hover:text-blue-800 text-sm"
          target="_blank"
        >
          Get WordPress Embed Code
        </Link>
      </div>
    </main>
  );
}
