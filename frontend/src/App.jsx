import React, { useEffect } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components and Pages
import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";

// Auth Store
import { useAuthStore } from "./store/authStore";

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
 
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, Admin } = useAuthStore();

  // console.log(
  //   "Checking Admin Access - isAuthenticated:",
  //   isAuthenticated,
  //   "isAdmin:",
  //   Admin
  // );

  if (!isAuthenticated || !Admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirect Authenticated Users
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, Admin } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to={Admin ? "/Admin-Dashboard" : "/"} replace />;
  }

  return children;
};

// Auth Layout for Login/Signup Pages
const AuthLayout = ({ children }) => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Container */}
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: "url('./Images/african.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 opacity-70"></div>
    </div>

    {/* Floating Shapes */}
    <FloatingShape
      color="bg-pink-500"
      size="w-64 h-64"
      top="-5%"
      left="10%"
      delay={0}
    />
    <FloatingShape
      color="bg-blue-500"
      size="w-48 h-48"
      top="70%"
      left="80%"
      delay={5}
    />
    <FloatingShape
      color="bg-purple-500"
      size="w-32 h-32"
      top="40%"
      left="-10%"
      delay={2}
    />

    {/* Main Content */}
    <div className="relative w-full max-w-lg mx-auto p-6">{children}</div>
    <Toaster />
  </div>
);

// Dashboard Layout for Authenticated Pages
const DashboardLayout = ({ children }) => (
  <div
    className="min-h-screen"
    style={{
      backgroundImage: "url('./Images/punjab.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="bg-black bg-opacity-50 min-h-screen">{children}</div>
  </div>
);

// Main App Component
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <AuthLayout>
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          </AuthLayout>
        }
      />
      <Route
        path="/verify-email"
        element={
          <AuthLayout>
            <EmailVerificationPage />
          </AuthLayout>
        }
      />
      <Route
        path="/Admin-Dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Dashboard Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
