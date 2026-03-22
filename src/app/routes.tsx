import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { GetInTouchPage } from "./pages/GetInTouchPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl mb-4 font-light tracking-tighter">404 - PATH NOT FOUND</h1>
      <p className="text-neutral-500 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-neutral-200 transition-colors">
        Back to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/get-in-touch",
    Component: GetInTouchPage,
  },
  {
    path: "/privacy",
    Component: PrivacyPage,
  },
  {
    path: "/terms",
    Component: TermsPage,
  },
  {
    path: "/collexa-hq-portal",
    Component: AdminLogin,
  },
  {
    path: "/collexa-hq-portal/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
