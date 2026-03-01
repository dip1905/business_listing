import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OWNER") {
    redirect("/owner/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Business Listing
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Owner Dashboard</h1>
              <p className="text-gray-600 mb-8">
                Manage your business listings and connect with customers.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">My Businesses</h3>
                  <p className="text-gray-600 mb-4">View and manage your business listings</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Add Business</h3>
                  <p className="text-gray-600 mb-4">Create a new business listing</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                  <p className="text-gray-600 mb-4">View your business performance</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Reviews</h3>
                  <p className="text-gray-600 mb-4">Manage customer reviews</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Messages</h3>
                  <p className="text-gray-600 mb-4">Customer inquiries and messages</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                  <p className="text-gray-600 mb-4">Update your account information</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}