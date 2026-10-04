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
      <h3 className="text-xl font-bold text-slate-800">Masuk Akun</h3>
      
      <div>
        <label htmlFor="login-email-input" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="login-email-input"
          name="email"
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label htmlFor="login-password-input" className="block text-sm font-medium text-slate-700">
          Kata Sandi
        </label>
        <input
          id="login-password-input"
          name="password"
          type="password"
          required
          value={password}
          onChange={onPasswordChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="••••••••"
        />
      </div>

      <button
        id="login-submit-button"
        type="submit"
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        Masuk
      </button>

      <div className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Daftar sekarang
        </Link>
      </div>
    </form>
  );
}