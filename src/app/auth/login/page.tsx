"use client"
import React, { useState, FC } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/admin/auth';

interface Alert {
  type: string;
  message: string;
}

const AdminLogin: FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState<Alert>({ type: '', message: '' });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      console.log('Login successful:', response);
      localStorage.setItem('token', response.token);
      setAlert({ type: 'success', message: 'Login successful!' });
      router.push('../../dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setAlert({ type: 'error', message: 'Login failed. Please try again.' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                password ? 'scale-75 -translate-y-6' : ''
              }`}
            >
              Password
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            >
              Sign in
            </button>
          </div>
          {alert.message && (
            <div
              className={`${
                alert.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
              } border px-4 py-3 rounded relative mb-4`}
              role="alert"
            >
              <span className="block sm:inline">{alert.message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;