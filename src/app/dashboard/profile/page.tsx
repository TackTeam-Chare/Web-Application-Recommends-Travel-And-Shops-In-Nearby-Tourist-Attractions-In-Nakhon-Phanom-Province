"use client";
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, verifyPassword } from '@/services/admin/auth';

export default function AdminProfile() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in again.');
          return;
        }
        const profile = await getProfile(token);
        setUsername(profile.username);
        setName(profile.name);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await verifyPassword({ username, password: oldPassword }, token);
      if (response.verified) {
        setPasswordVerified(true);
      } else {
        alert('Incorrect current password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Error verifying password');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (name === '' || username === '') {
      alert('Name and Username cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await updateProfile({ username, name }, token);
      alert('Profile updated successfully');
      resetState();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword === '') {
      alert('New Password cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await updateProfile({ password: newPassword }, token);
      alert('Password changed successfully');
      resetState();
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Error changing password');
    }
  };

  const resetState = () => {
    setOldPassword('');
    setNewPassword('');
    setPasswordVerified(false);
    setAction('');
    setError('');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Profile</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="mt-8 space-y-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="username"
              id="username"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label
              htmlFor="username"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                username ? 'scale-75 -translate-y-6' : ''
              }`}
            >
              Username
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor="name"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                name ? 'scale-75 -translate-y-6' : ''
              }`}
            >
              Name
            </label>
          </div>
          <div className="flex justify-between">
            {!passwordVerified && (
              <>
                <button
                  onClick={() => setAction('updateProfile')}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => setAction('changePassword')}
                  className="ml-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
        {action && !passwordVerified && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyPassword}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label
                htmlFor="oldPassword"
                className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                  oldPassword ? 'scale-75 -translate-y-6' : ''
                }`}
              >
                Current Password
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                Verify Password
              </button>
            </div>
          </form>
        )}
        {passwordVerified && action === 'updateProfile' && (
          <form className="mt-8 space-y-6" onSubmit={handleUpdateProfile}>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              >
                Confirm Update Profile
              </button>
            </div>
          </form>
        )}
        {passwordVerified && action === 'changePassword' && (
          <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label
                htmlFor="newPassword"
                className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                  newPassword ? 'scale-75 -translate-y-6' : ''
                }`}
              >
                New Password
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
