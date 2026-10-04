import { loginApi, registerApi } from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { asyncSetProfile, setProfile } from "../../users/states/action";

export const ActionType = {
  SET_AUTH_LOGIN: "auth/setLogin",
  SET_AUTH_LOGOUT: "auth/setLogout",
  SET_AUTH_REGISTER: "auth/setRegister",
};

export function setAuthLogin(payload) {
  return { type: ActionType.SET_AUTH_LOGIN, payload };
}

export function setAuthLogout() {
  return { type: ActionType.SET_AUTH_LOGOUT };
}

export function setAuthRegister(payload) {
  return { type: ActionType.SET_AUTH_REGISTER, payload };
}

export function asyncLogin({ email, password }) {
  return async (dispatch) => {
    try {
      const data = await loginApi({ email, password });
      putAccessToken(data.token);
      dispatch(setAuthLogin(true));
      await dispatch(asyncSetProfile());
      showSuccessDialog("Login berhasil! Selamat datang.");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncRegister({ name, email, password }) {
  return async (dispatch) => {
    try {
      await registerApi({ name, email, password });
      dispatch(setAuthRegister(true));
      showSuccessDialog("Registrasi akun berhasil! Silakan login.");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncLogout() {
  return (dispatch) => {
    removeAccessToken();
    dispatch(setAuthLogout());
    dispatch(setProfile(null));
    showSuccessDialog("Berhasil keluar.");
  };
}