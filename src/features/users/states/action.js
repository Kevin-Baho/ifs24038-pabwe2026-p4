import {
  getProfileApi,
  getUsersApi,
  updateProfileApi,
  updateAvatarApi,
  updatePasswordApi,
} from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_PROFILE: "users/setProfile",
  SET_USERS: "users/setUsers",
};

export function setProfile(payload) {
  return { type: ActionType.SET_PROFILE, payload };
}

export function setUsers(payload) {
  return { type: ActionType.SET_USERS, payload };
}

export function asyncSetProfile() {
  return async (dispatch) => {
    try {
      const data = await getProfileApi();
      const user = data?.user || data;
      dispatch(setProfile(user));
      return user;
    } catch (error) {
      dispatch(setProfile(null));
      return null;
    }
  };
}

export function asyncGetUsers() {
  return async (dispatch) => {
    try {
      const data = await getUsersApi();
      // Ekstrak array dari data.users (Delcom API) atau langsung data (mock test)
      const items = Array.isArray(data) ? data : data?.users || data?.items || [];
      dispatch(setUsers(items));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncUpdateProfile({ name, bio }) {
  return async (dispatch) => {
    try {
      await updateProfileApi({ name, bio });
      await dispatch(asyncSetProfile());
      showSuccessDialog("Profil berhasil diperbarui!");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncUpdateAvatar(file) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);
      await updateAvatarApi(formData);
      await dispatch(asyncSetProfile());
      showSuccessDialog("Foto profil berhasil diperbarui!");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncUpdatePassword(payload) {
  return async () => {
    try {
      const current_password = payload?.current_password;
      const new_password = payload?.new_password || payload?.password;
      await updatePasswordApi({ current_password, new_password });
      showSuccessDialog("Kata sandi berhasil diperbarui!");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

// Alias ekspor untuk kompatibilitas
export const asyncChangeProfile = asyncUpdateProfile;
export const asyncChangeProfilePhoto = asyncUpdateAvatar;
export const asyncChangeProfilePassword = asyncUpdatePassword;