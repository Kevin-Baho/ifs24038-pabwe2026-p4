import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput";
import { asyncRegister } from "../states/action";

export default function RegisterPage() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(asyncRegister({ name, email, password }));
    if (success) {
      navigate("/auth/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Daftar Akun Baru</h1>
      
      <div>
        <label htmlFor="register-name-input" className="block text-xs font-bold text-slate-800 mb-1">
          Nama Lengkap
        </label>
        <input
          id="register-name-input"
          name="name"
          type="text"
          required
          value={name}
          onChange={onNameChange}
          className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-blue-600 shadow-sm"
          placeholder="Nama Lengkap"
        />
      </div>

      <div>
        <label htmlFor="register-email-input" className="block text-xs font-bold text-slate-800 mb-1">
          Email
        </label>
        <input
          id="register-email-input"
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
        <label htmlFor="register-password-input" className="block text-xs font-bold text-slate-800 mb-1">
          Kata Sandi
        </label>
        <input
          id="register-password-input"
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
        id="register-submit-button"
        type="submit"
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow cursor-pointer transition-colors"
      >
        Daftar
      </button>

      <div className="text-center text-xs text-slate-700 font-medium">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-bold text-blue-700 hover:underline">
          Masuk di sini
        </Link>
      </div>
    </form>
  );
}