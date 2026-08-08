import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6" />
        {profile?.name || user.email}
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>Role:</strong> {profile?.role || 'tourist'}</p>
        {/* Add more profile fields here if needed */}
      </div>
    </div>
  );
}
