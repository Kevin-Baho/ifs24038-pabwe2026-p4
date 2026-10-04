import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useInput } from "../../../hooks/useInput";
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
    if (success) navigate("/auth/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Daftar Akun Baru</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
        <input
          type="text"
          required
          value={name}
          onChange={onNameChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nama Lengkap"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="nama@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
        <input
          type="password"
          required
          value={password}
          onChange={onPasswordChange}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Daftar
      </button>
      <div className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Masuk di sini
        </Link>
      </div>
    </form>
  );
}