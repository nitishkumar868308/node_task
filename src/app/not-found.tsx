import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-4">
        <span className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">Go to Home</span>
      </Link>
    </div>
  );
}
