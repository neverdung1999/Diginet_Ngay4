import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
// import ApiCaller from "../../utils/apiCaller";
import * as Types from "../constants";
import * as actions from "../actions";
import * as Api from "../../utils/apiCaller";

function* getDataRequest(action) {
  const results = yield call(Api.fetchData);
  action.setShowLoading(false);
  yield put(actions.getDataSuccess(results));
}

function* addDataRequest(action) {
  const value = action.valueInput;
  const setShowLoading = action.setShowLoading;
  const setShowLoadingNoti = action.setShowLoadingNoti;
  const setValueNotification = action.setValueNotification;
  const objectTemp = {
    time: value.dateStart + " - " + value.dateEnd,
  };

  for (const [key, data] of Object.entries(value)) {
    objectTemp[key] = data;
  }

  const results = yield call(Api.addData, objectTemp);
  if (results?.status >= 200 && results?.status < 300) {
    setShowLoading(false);
    setValueNotification({
      color: "success",
      text: "Thêm dữ liệu thành công",
    });
    yield put(actions.getData(setShowLoading));
  } else {
    setShowLoading(false);
    setValueNotification({
      color: "danger",
      text: "Thêm dữ liệu thất bại",
    });
  }
  setShowLoadingNoti(true);
  setTimeout(() => {
    setShowLoadingNoti(false);
  }, 5000);
}

function* updateDataRequest(action) {
  const value = action.data;
  const setShowLoading = action.setShowLoading;
  const setValueNotification = action.setValueNotification;
  const setShowLoadingNoti = action.setShowLoadingNoti;
  const objectTemp = {
    time: value.dateStart + " - " + value.dateEnd,
  };
  for (const [key, data] of Object.entries(value)) {
    objectTemp[key] = data;
  }
  const results = yield call(Api.updateData, objectTemp);
  if (results?.status >= 200 && results?.status < 300) {
    setShowLoading(false);
    setValueNotification({
      color: "success",
      text: "Cập nhật dữ liệu thành công",
    });
    yield put(actions.getData(setShowLoading));
  } else {
    setShowLoading(false);
    setValueNotification({
      color: "danger",
      text: "Cập nhật dữ liệu thất bại",
    });
  }
  setShowLoadingNoti(true);
  setTimeout(() => {
    setShowLoadingNoti(false);
  }, 5000);
}

function* deleteDataRequest(action) {
  const id = action.id;
  const setShowLoading = action.setShowLoading;
  const setValueNotification = action.setValueNotification;
  const setShowLoadingNoti = action.setShowLoadingNoti;
  yield call(Api.deleteData, id);
  setShowLoading(false);
  setShowLoadingNoti(true);
  setValueNotification({
    color: "success",
    text: "Xóa dữ liệu thành công",
  });
  setShowLoadingNoti(true);
  setTimeout(() => {
    setShowLoadingNoti(false);
  }, 5000);
  yield put(actions.getData(setShowLoading));
}

function* mySaga() {
  yield takeEvery(Types.GET_DATA, getDataRequest);
  yield takeLatest(Types.ADD_DATA, addDataRequest);
  yield takeEvery(Types.DELETE_DATA, deleteDataRequest);
  yield takeEvery(Types.UPDATE_DATA, updateDataRequest);
}

export default mySaga;
