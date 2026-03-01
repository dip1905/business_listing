import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Business Listing Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect businesses with customers through our comprehensive listing platform. 
            Choose your role to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">User</h3>
            <p className="text-gray-600 mb-6">
              Browse and discover local businesses, read reviews, and find what you need.
            </p>
            <div className="space-y-3">
              <Link 
                href="/user/login"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/user/register"
                className="block w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Business Owner Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Business Owner</h3>
            <p className="text-gray-600 mb-6">
              List your business, manage your profile, and connect with customers.
            </p>
            <div className="space-y-3">
              <Link 
                href="/owner/login"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/owner/register"
                className="block w-full border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Administrator</h3>
            <p className="text-gray-600 mb-6">
              Manage the platform, oversee users, and maintain system integrity.
            </p>
            <div className="space-y-3">
              <Link 
                href="/admin/login"
                className="block w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Admin Login
              </Link>
              <p className="text-sm text-gray-500">
                Admin accounts are manually created
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}