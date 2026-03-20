import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f9f5] flex flex-col font-body">
      <div className="bg-[#0a2e18] py-4 px-6">
        <Link href="/" className="flex items-center gap-2.5 w-fit hover:opacity-80 transition-opacity">
          <Image src="/serbisyo360-logo.png" alt="Serbisyo360" width={36} height={36} />
          <span className="font-display font-bold text-white text-base">
            Serbisyo<span className="text-[#a8e6bf]">360</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-fade-up">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <p className="font-display text-8xl font-bold text-[#0f4d2b]/10 mb-2">404</p>
            <h1 className="font-display text-2xl font-bold text-[#0a2e18] mb-2">Page Not Found</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The page you are looking for does not exist or may have been moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#0f4d2b] text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-[#1a7a45] transition-colors shadow-lg text-sm"
            >
              Go to Homepage
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Powered by <span className="font-semibold text-[#0f4d2b]">Serbisyo360</span>
          </p>
        </div>
      </div>
    </div>
  );
}