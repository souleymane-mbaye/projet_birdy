import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/api/user/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const logoutCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGOUT" });
  try {
    console.log("user creditial ",userCredential)
    const res = await axios.post("/api/user/"+userCredential._id+"/logout", userCredential);
    dispatch({ type: "LOGOUT", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGOUT_FAIL", payload: err });
  } 
};

