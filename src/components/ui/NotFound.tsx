import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20 flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-base-content">Page not found</h1>
      <p className="text-base-content/60">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary bg-[#D2531E] hover:bg-[#B34517] border-none text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
