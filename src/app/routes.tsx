import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { GetInTouchPage } from "./pages/GetInTouchPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
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
]);
