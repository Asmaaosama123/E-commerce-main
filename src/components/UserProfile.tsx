import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom'; // ✅ استخدم useNavigate هنا

interface UserProfileProps {
  onBack: () => void;
  logout: () => void;
  onOpenMyStore?: () => void;
  user?: { role?: string } | null;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onBack,
  logout,
  onOpenMyStore,
  user: userProp = null,
}) => {
  const { t, isRTL } = useLanguage();
  const { user: contextUser } = useAuth();
  const user = userProp ?? contextUser;
  const navigate = useNavigate(); // ✅ hook التنقل

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b py-3 px-4">
        <div className="flex items-center">
          {/* ✅ تم تصحيح onClick */}
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium mr-3">{t('profile.title') || 'Profile'}</h2>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4">
        <div className="mt-4">
          {user && user.role === 'vendor' && (
            <div className="mb-3">
              <button
                onClick={() => {
                  if (onOpenMyStore) onOpenMyStore();
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mb-2"
              >
                <span>My Store</span>
              </button>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              onBack();
            }}
            className={`w-full bg-white hover:bg-gray-50 text-red-500 py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
