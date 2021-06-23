import * as Types from "../constants";

export const getData = (setShowLoading) => {
  return {
    type: Types.GET_DATA,
    setShowLoading,
  };
};

export const getDataSuccess = (data) => {
  return {
    type: Types.GET_DATA_SUCCESS,
    data,
  };
};

export const addData = (
  valueInput,
  setShowLoading,
  setValueNotification,
  setShowLoadingNoti
) => {
  return {
    type: Types.ADD_DATA,
    valueInput,
    setShowLoading,
    setValueNotification,
    setShowLoadingNoti,
  };
};

export const deleteData = (
  id,
  setShowLoading,
  setValueNotification,
  setShowLoadingNoti
) => {
  return {
    type: Types.DELETE_DATA,
    id,
    setShowLoading,
    setValueNotification,
    setShowLoadingNoti,
  };
};

export const updateData = (
  data,
  id,
  setShowLoading,
  setValueNotification,
  setShowLoadingNoti
) => {
  return {
    type: Types.UPDATE_DATA,
    data,
    id,
    setShowLoading,
    setValueNotification,
    setShowLoadingNoti,
  };
};
