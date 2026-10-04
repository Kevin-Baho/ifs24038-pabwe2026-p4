import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  asyncUpdateProfile,
  asyncUpdateAvatar,
  asyncUpdatePassword,
} from "../states/action";
import useInput from "../../../hooks/useInput";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.users?.profile);

  const [name, onNameChange, setName] = useInput("");
  const [bio, onBioChange, setBio] = useInput("");
  const [currentPassword, onCurrentPasswordChange, setCurrentPassword] = useInput("");
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
    }
  }, [profile, setName, setBio]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncUpdateProfile({ name, bio }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(
      asyncUpdatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
    );
    setCurrentPassword("");
    setNewPassword("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(asyncUpdateAvatar(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="text-slate-700 text-sm">Kelola profil dan keamanan kata sandi Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="relative mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center font-bold text-2xl text-blue-800 overflow-hidden border border-blue-200">
            {profile?.photo ? (
              <img src={profile.photo} alt={profile.name || "Avatar"} className="h-full w-full object-cover" />
            ) : (
              profile?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              {profile?.name || "Profil Pengguna"}
            </h2>
            <p className="text-xs text-slate-700 font-medium">
              {profile?.email || "Email Pengguna"}
            </p>
          </div>
          <label className="inline-block bg-slate-100 text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-slate-200 cursor-pointer border border-slate-300">
            Ganti Avatar
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-900 text-lg">Informasi Profil</h2>
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-800 mb-1">
                Nama
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={onNameChange}
                required
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-blue-700"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-xs font-bold text-slate-800 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows="3"
                value={bio}
                onChange={onBioChange}
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-blue-700"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-800 cursor-pointer shadow-sm"
            >
              Simpan Profil
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-900 text-lg">Ubah Kata Sandi</h2>
            <div>
              <label htmlFor="currentPassword" className="block text-xs font-bold text-slate-800 mb-1">
                Kata Sandi Saat Ini
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={onCurrentPasswordChange}
                required
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-blue-700"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold text-slate-800 mb-1">
                Kata Sandi Baru
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={onNewPasswordChange}
                required
                className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-blue-700"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-black cursor-pointer shadow-sm"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}