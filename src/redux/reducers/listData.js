import * as Types from "../constants";

const initialState = [];

const listData = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_DATA_SUCCESS:
      state = action.data.data;
      return state;
    default:
      return state;
  }
};

export default listData;
