interface PaginationSummaryProps {
  currentPage: number; // 1-indexed, for display
  pageSize: number;
  totalElements: number;
  isLoading?: boolean;
  loadingLabel?: string;
  itemLabel?: string;
}

export function PaginationSummary({
  currentPage,
  pageSize,
  totalElements,
  isLoading = false,
  loadingLabel = "Loading…",
  itemLabel = "items",
}: PaginationSummaryProps) {
  if (isLoading) {
    return (
      <span className="text-xs text-base-content/50 font-semibold">
        {loadingLabel}
      </span>
    );
  }

  const itemsOnPage = Math.min(
    pageSize,
    Math.max(totalElements - (currentPage - 1) * pageSize, 0),
  );

  return (
    <span className="text-xs text-base-content/50 font-semibold">
      Showing {itemsOnPage} of {totalElements} {itemLabel}
    </span>
  );
}
