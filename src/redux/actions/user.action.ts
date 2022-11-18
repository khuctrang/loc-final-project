import { TypedDispatch } from "redux/store";
import AuthService from "services/auth.service";
import UserService from "services/user.service";
import { handleAsyncAction } from "utils/library";

export const userActions = {
  SET_USER: "SET_USER",
  DELETE_USER: "DELETE_USER",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  GET_USER_INFO: "GET_USER_INFO",
  LOGOUT: "LOGOUT",
};

export const register =
  (name: string, email: string, password: string) =>
  (dispatch: TypedDispatch) =>
    handleAsyncAction(dispatch, userActions.REGISTER, () =>
      AuthService.register(name, email, password)
    );

export const login =
  (email: string, password: string) => (dispatch: TypedDispatch) =>
    handleAsyncAction(dispatch, userActions.LOGIN, () =>
      AuthService.login(email, password)
    );

export const logout = () => (dispatch: TypedDispatch) => {
  AuthService.logout();
  dispatch({ type: userActions.LOGOUT });
};

export const getUserInfo = () => (dispatch: TypedDispatch) =>
  handleAsyncAction(dispatch, userActions.GET_USER_INFO, () =>
    UserService.getUserInfo()
  );
