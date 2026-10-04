import {
  getLostFoundsApi,
  getLostFoundDetailApi,
  createLostFoundApi,
  updateLostFoundApi,
  uploadCoverLostFoundApi,
  deleteLostFoundApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
} from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_LOST_FOUNDS: "lostFounds/setLostFounds",
  SET_LOST_FOUND_DETAIL: "lostFounds/setDetail",
  SET_DAILY_STATS: "lostFounds/setDailyStats",
  SET_MONTHLY_STATS: "lostFounds/setMonthlyStats",
};

export function setLostFounds(payload) {
  return { type: ActionType.SET_LOST_FOUNDS, payload };
}

export function setLostFoundDetail(payload) {
  return { type: ActionType.SET_LOST_FOUND_DETAIL, payload };
}

export function setDailyStats(payload) {
  return { type: ActionType.SET_DAILY_STATS, payload };
}

export function setMonthlyStats(payload) {
  return { type: ActionType.SET_MONTHLY_STATS, payload };
}

export function asyncGetLostFounds(filters = {}) {
  return async (dispatch) => {
    try {
      const data = await getLostFoundsApi(filters);
      dispatch(setLostFounds(data));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncGetLostFoundDetail(id) {
  return async (dispatch) => {
    try {
      const data = await getLostFoundDetailApi(id);
      dispatch(setLostFoundDetail(data));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncGetDailyStats() {
  return async (dispatch) => {
    try {
      const data = await getDailyStatsApi();
      dispatch(setDailyStats(data));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncGetMonthlyStats() {
  return async (dispatch) => {
    try {
      const data = await getMonthlyStatsApi();
      dispatch(setMonthlyStats(data));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

export function asyncCreateLostFound({ title, description, status }) {
  return async (dispatch) => {
    try {
      await createLostFoundApi({ title, description, status });
      showSuccessDialog("Laporan berhasil dibuat!");
      dispatch(asyncGetLostFounds());
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncUpdateLostFound(id, payload) {
  return async (dispatch) => {
    try {
      await updateLostFoundApi(id, payload);
      showSuccessDialog("Laporan berhasil diperbarui!");
      dispatch(asyncGetLostFoundDetail(id));
      dispatch(asyncGetLostFounds());
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncUploadCoverLostFound(id, file) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("cover", file);
      await uploadCoverLostFoundApi(id, formData);
      showSuccessDialog("Cover berhasil diunggah!");
      dispatch(asyncGetLostFoundDetail(id));
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncDeleteLostFound(id) {
  return async (dispatch) => {
    try {
      await deleteLostFoundApi(id);
      showSuccessDialog("Laporan berhasil dihapus!");
      dispatch(asyncGetLostFounds());
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}