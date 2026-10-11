import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Bookings from "./pages/Bookings.jsx";
import Users from "./pages/Users.jsx";
import Settings from "./pages/Settings.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Cabins from "./pages/Cabins.jsx";
import GlobalStyles from "./styles/GlobalStyles.js";
import AppLayout from "./ui/AppLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booking from "./pages/Booking.jsx";
import Checkin from "./pages/Checkin.jsx";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { isSupabaseConfigured } from "./services/supabase.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  if (!isSupabaseConfigured)
    return (
      <>
        <GlobalStyles />
        <main style={{ maxWidth: "64rem", margin: "10rem auto", padding: "2.4rem" }}>
          <h1>The Wild Oasis needs configuration</h1>
          <p>Connect a Supabase project to finish setting up this application.</p>
          <p>See the repository README for local setup and deployment instructions.</p>
        </main>
      </>
    );

  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:bookingId" element={<Booking />} />
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          toastStyle={{
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
            padding: "16px 24px",
            fontSize: "16px",
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
