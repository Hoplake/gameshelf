import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Pelihylly</p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="https://boardgamegeek.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/powered_by_BGG.png"
                alt="Powered by BoardGameGeek"
                width={240}
                height={60}
                className="h-16 md:h-20 w-auto"
                unoptimized
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
