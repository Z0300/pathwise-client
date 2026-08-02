import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useFlows } from "../../api/queries";
import type { Flow, SearchablePageRequest } from "../../types/flow";
import { FlowIcon } from "./FlowIcon";
import { PaginationSummary } from "../ui/PaginationSummary";
import { Pagination } from "../ui/Pagination";
import {
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  MoreVertical,
  CheckCircle2,
  Cloud,
  Network,
  ArrowRight,
  List,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// Skeleton row shown while loading
function SkeletonRow() {
  return (
    <tr className="border-b border-base-200">
      <td className="py-5 px-6">
        <div className="flex items-center gap-4">
          <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton h-3.5 w-40" />
            <div className="skeleton h-2.5 w-64" />
          </div>
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="skeleton h-5 w-14 rounded-md" />
      </td>
      <td className="py-5 px-6">
        <div className="skeleton h-3.5 w-20" />
      </td>
      <td className="py-5 px-6 text-right">
        <div className="flex justify-end gap-2">
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
}

const PAGE_SIZE = 25;

export default function FlowList() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(0);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const params: SearchablePageRequest = {
    page: currentPage,
    size: PAGE_SIZE,
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  const { data: pageResponse, isLoading, isError, error } = useFlows(params);

  const flows = pageResponse?.data ?? [];
  const totalElements = pageResponse?.meta?.totalElements ?? 0;
  const totalPages = pageResponse?.meta?.totalPages ?? 0;
  const activePage = pageResponse?.meta?.page ?? currentPage;

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-serif font-bold text-base-content tracking-tight">
          My Flows
        </h1>
        <p className="text-base-content/60 mt-1 text-[15px]">
          A curated overview of your operational process diagrams and logic
          structures.
        </p>
      </div>

      {/* Metrics Row — daisyUI cards */}
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-1">
            <span className="text-[11px] font-bold text-base-content/50 tracking-widest uppercase">
              Total Flows
            </span>
            {isLoading ? (
              <div className="skeleton h-9 w-12 mt-1" />
            ) : (
              <span className="text-4xl font-bold text-[#D2531E]">
                {totalElements}
              </span>
            )}
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-1">
            <span className="text-[11px] font-bold text-base-content/50 tracking-widest uppercase">
              Drafts
            </span>
            <span className="text-4xl font-bold text-success/80">4</span>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-1">
            <span className="text-[11px] font-bold text-base-content/50 tracking-widest uppercase">
              Nodes Analyzed
            </span>
            <span className="text-4xl font-bold text-success/80">256</span>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 gap-1">
            <span className="text-[11px] font-bold text-base-content/50 tracking-widest uppercase">
              Last Run
            </span>
            <span className="text-4xl font-bold text-base-content">2h ago</span>
          </div>
        </div>
      </div>

      {/* Error Banner — daisyUI alert */}
      {isError && (
        <div role="alert" className="alert alert-error alert-soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Could not load flows.{" "}
            {error instanceof Error
              ? error.message
              : "Check that the backend is running."}
          </span>
        </div>
      )}

      {/* Flows Card Container */}
      <div className="card bg-base-100 border border-base-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
        {/* Top Control Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-base-200 bg-base-100">
          {/* Search input */}
          <label className="input input-bordered flex items-center gap-2 w-full max-w-sm rounded-lg bg-base-100/50">
            <Search className="w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search your editorial flows..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="grow"
            />
          </label>

          <div className="flex items-center gap-2">
            {/* Filter button */}
            <button
              className="btn btn-ghost border-none btn-sm gap-2 text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
              aria-label="Filter flows"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {/* Sort button */}
            <button
              className="btn btn-ghost border-none btn-sm gap-2 text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
              aria-label="Sort flows"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        {/* Table Area — daisyUI table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-[11px] font-bold text-base-content/50 tracking-wider uppercase bg-base-200/30 border-b border-base-200">
                <th className="font-bold py-4 px-6">Flow Name</th>
                <th className="font-bold w-48 py-4 px-6">Status &amp; Info</th>
                <th className="font-bold w-40 py-4 px-6">Created</th>
                <th className="font-bold w-32 py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : flows.length > 0 ? (
                flows.map((flow: Flow, idx: number) => (
                  <tr
                    key={flow.id}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-b-0"
                  >
                    {/* Flow Name + Description */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <FlowIcon index={activePage * PAGE_SIZE + idx} />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-base-content text-[14.5px]">
                            {flow.name}
                          </span>
                          <span className="text-base-content/50 text-xs font-normal max-w-md truncate">
                            {flow.description || (
                              <span className="italic opacity-70">
                                No description
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status — daisyUI badge */}
                    <td className="py-4 px-6">
                      {idx % 3 === 0 ? (
                        <span className="badge badge-outline text-base-content/60 border-base-content/20 bg-base-200/20 font-medium">
                          Draft
                        </span>
                      ) : (
                        <span className="badge badge-outline text-success/80 border-success/30 bg-success/5 font-medium">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Created date */}
                    <td className="py-4 px-6 text-base-content/70 text-[13.5px] whitespace-nowrap">
                      {formatDate(flow.createdAt)}
                    </td>

                    {/* Actions — daisyUI ghost buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/flows/$flowId/edit"
                          params={{ flowId: String(flow.id) }}
                          className="btn btn-ghost border-none btn-sm btn-square text-base-content/60 hover:bg-[#D2531E]/10 hover:text-[#D2531E]"
                          aria-label="Edit flow"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <div className="dropdown dropdown-end">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost border-none btn-sm btn-square text-base-content/60 hover:bg-blue-500/10 hover:text-blue-500"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-100 menu p-2 shadow-sm border border-base-200 bg-base-100 rounded-box w-40 mt-1"
                          >
                            <li>
                              <Link
                                to="/flows/$flowId/nodes"
                                params={{ flowId: String(flow.id) }}
                                className="text-[13px] text-base-content/70 hover:text-base-content"
                              >
                                <Network className="w-4 h-4" />
                                Add Nodes
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/flows/$flowId/edges"
                                params={{ flowId: String(flow.id) }}
                                className="text-[13px] text-base-content/70 hover:text-base-content"
                              >
                                <ArrowRight className="w-4 h-4" />
                                Add Edges
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/flows/$flowId/enumerate"
                                params={{ flowId: String(flow.id) }}
                                className="text-[13px] text-base-content/70 hover:text-base-content"
                              >
                                <List className="w-4 h-4" />
                                Enumerate
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-base-content/50 font-medium"
                  >
                    {debouncedSearch
                      ? "No flows found matching your search."
                      : "No flows yet. Create your first flow!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-base-200 bg-base-100">
          <PaginationSummary
            currentPage={activePage + 1}
            pageSize={PAGE_SIZE}
            totalElements={totalElements}
            isLoading={isLoading}
            loadingLabel="Loading flows…"
            itemLabel="editorial flows"
          />
          <Pagination
            currentPage={activePage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Footer Text Row */}
      <div className="flex items-center justify-between text-[13px] text-base-content/50 pt-2 pb-6 border-t border-base-200/60 mt-2 px-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Securely Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            <span>Cloud Sync Enabled</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>v2.4.0-stable</span>
          <span>&copy; 2024 PathWise</span>
        </div>
      </div>
    </div>
  );
}
