import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput";
import { asyncLogin } from "../states/action";

export default function LoginPage() {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(asyncLogin({ email, password }));
    if (success) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Masuk Akun</h1>
      
      <div>
        <label htmlFor="login-email-input" className="block text-xs font-bold text-slate-800 mb-1">
          Email
        </label>
        <input
          id="login-email-input"
          name="email"
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-blue-600 shadow-sm"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="login-password-input" className="block text-xs font-bold text-slate-800 mb-1">
          Kata Sandi
        </label>
        <input
          id="login-password-input"
          name="password"
          type="password"
          required
          value={password}
          onChange={onPasswordChange}
          className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-blue-600 shadow-sm"
          placeholder="••••••••"
        />
      </div>

      <button
        id="login-submit-button"
        type="submit"
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow cursor-pointer transition-colors"
      >
        Masuk
      </button>

      <div className="text-center text-xs text-slate-700 font-medium">
        Belum punya akun?{" "}
        <Link to="/auth/register" className="font-bold text-blue-700 hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </form>
  );
}