export const initialState = {
  user: null,
  name: "default-room",
  seed: null,
  uid: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        uid: action.uid,
      };
    case "SET_ACTIVE":
      return {
        ...state,
        name: action.name,
        seed: action.seed,
      };
    default:
      return state;
  }
};

export default reducer;
