import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import {
  LayoutGrid,
  BarChart2,
  Archive,
  Settings,
  FileText,
  HelpCircle,
  Bell,
} from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isWizard =
    currentPath.startsWith("/flows/new") || currentPath.match(/^\/flows\/\d+/);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 flex font-sans">
      {/* Sidebar */}
      <aside className="w-70 bg-base-100 border-r border-base-200 flex flex-col justify-between py-6 px-4 shrink-0 shadow-sm z-10">
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-serif font-bold text-[#D2531E] tracking-tight px-4 hover:opacity-90 transition-opacity"
          >
            PathWise
          </Link>

          {/* New Flow Button */}
          <div className="px-2">
            <Link
              to="/flows/new"
              className="btn btn-primary rounded-full w-full font-semibold text-white bg-[#D2531E] hover:bg-[#B34517] border-none"
            >
              + New Flow
            </Link>
          </div>

          {/* Main Nav Items - DaisyUI Menu */}
          <ul className="menu w-full px-2 gap-1">
            <li>
              <Link
                to="/"
                className="active:bg-[#D2531E]! active:text-white! bg-[#D2531E]/10 text-[#D2531E] font-medium"
                activeProps={{
                  className: "bg-[#D2531E]/10 text-[#D2531E] font-medium",
                }}
              >
                <LayoutGrid className="w-5 h-5 mr-1" />
                Flows
              </Link>
            </li>
            <li>
              <button className="text-base-content/70 hover:text-base-content font-medium">
                <BarChart2 className="w-5 h-5 mr-1" />
                Insights
              </button>
            </li>
            <li>
              <button className="text-base-content/70 hover:text-base-content font-medium">
                <Archive className="w-5 h-5 mr-1" />
                Archived
              </button>
            </li>
          </ul>
        </div>

        {/* Bottom Nav Items - DaisyUI Menu */}
        <ul className="menu w-full px-2 gap-1 mt-auto">
          <li>
            <button className="text-base-content/70 hover:text-base-content font-medium">
              <Settings className="w-5 h-5 mr-1" />
              Settings
            </button>
          </li>
          <li>
            <button className="text-base-content/70 hover:text-base-content font-medium">
              <FileText className="w-5 h-5 mr-1" />
              Docs
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        <header className="navbar bg-white border-b border-base-200 h-16 shrink-0 relative z-0 p-0 shadow-sm">
          <div
            className={
              isWizard
                ? "max-w-4xl mx-auto px-8 w-full flex items-center justify-between"
                : "max-w-7xl mx-auto px-8 w-full flex items-center justify-between"
            }
          >
            {/* Left Side: Title / Breadcrumbs */}
            <div className="flex items-center gap-4">
              {isWizard ? (
                <div className="flex items-center gap-2">
                  <span className="text-[14.5px] font-medium text-base-content/50">
                    Flow /
                  </span>
                  <span className="text-[14.5px] font-bold text-[#D2531E]">
                    Node Builder
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-0.5 h-5 bg-base-300"></div>
                  <span className="text-sm font-bold text-base-content/80 tracking-tight">
                    Flows Overview
                  </span>
                </>
              )}
            </div>

            {/* Right Side: Generic Icons & Avatar */}
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                title="Help"
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </button>

              <button
                className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
              </button>

              <button
                className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                title="Settings"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>

              <div className="ml-1 w-8 h-8 rounded-full border border-base-200 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main
          className={`flex-1 ${isWizard ? "bg-[#F8F9FC]" : ""}`}
          style={
            isWizard
              ? {
                  backgroundImage:
                    "radial-gradient(#D1D5DB 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }
              : undefined
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
