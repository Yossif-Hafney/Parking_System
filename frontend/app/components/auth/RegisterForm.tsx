"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FaCarSide, FaExclamationTriangle, FaLock, FaParking, FaRocket, FaUser } from "react-icons/fa";
import { api } from "../../lib/api";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const result = await api.register(username, password);
      if (result.success) {
        setPassword("");
        setSuccess("Account created. You can now sign in.");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="absolute top-1/4 left-10 text-6xl animate-bounce opacity-20">
        <FaCarSide />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaParking className="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-blue-200">Register to start managing parking</p>
          </div>

          {success && (
            <div role="status" className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-4 text-sm text-emerald-100">
              {success}{" "}
              <Link href="/" className="font-semibold underline underline-offset-4">
                Sign in
              </Link>
            </div>
          )}

          {error && (
            <div role="alert" className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-blue-200 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <FaUser />
                </span>
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/40 focus:outline-none transition-all"
                  placeholder="Choose a username"
                  required
                  maxLength={50}
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <FaLock />
                </span>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/40 focus:outline-none transition-all"
                  placeholder="Choose a password"
                  required
                  minLength={4}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
              <p className="mt-2 text-xs text-blue-200">At least 4 characters. New accounts have operator access.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <FaRocket />
                  Register
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-blue-100">
            Already have an account?{" "}
            <Link href="/" className="font-semibold text-white underline underline-offset-4 hover:text-blue-200">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Parking Management System © 2025
        </p>
      </div>
    </div>
  );
}
