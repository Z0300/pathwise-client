import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <div className="join">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage <= 1 || disabled}
        className="join-item btn btn-sm btn-ghost border border-base-200 text-base-content/70 hover:text-base-content"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={disabled}
            className={`join-item btn btn-sm border border-base-200 ${
              isActive 
                ? "btn-primary text-white border-primary" 
                : "btn-ghost text-base-content/70 hover:text-base-content"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage >= totalPages || disabled}
        className="join-item btn btn-sm btn-ghost border border-base-200 text-base-content/70 hover:text-base-content"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
