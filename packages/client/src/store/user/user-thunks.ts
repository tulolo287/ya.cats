import { createAsyncThunk } from '@reduxjs/toolkit'
import AuthController from '@controllers/auth-controller'
import UserController from '@controllers/user-controller'
import {
  AuthLoginData,
  AuthSignupData,
  OAuthLoginRequest,
  OAuthServiceIdRequest,
  UserData,
  UserPasswordData,
  UserProfileData,
} from '@core/types'
import oauthController from '@controllers/oauth-controller'
import { oAuthYandexUrl, redirectUri } from '@core/constants'
import { PageInitContext } from '@routes'

export const getUser = createAsyncThunk<UserData, PageInitContext | undefined>(
  'user/getUser',
  async (ctx?) => {
    const data = { headers: { Cookie: ctx?.authCookie } }
    const response = await AuthController.getUser(data)
    return response.data
  }
)

export const login = createAsyncThunk<UserData, AuthLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      await AuthController.login(data)
      const response = await AuthController.getUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const signup = createAsyncThunk<UserData, AuthSignupData>(
  'user/signup',
  async (data, { rejectWithValue }) => {
    try {
      await AuthController.signup(data)
      const response = await AuthController.getUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const logout = createAsyncThunk<boolean, undefined>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthController.logout()
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const changeProfileData = createAsyncThunk<UserData, UserProfileData>(
  'user/changeProfileData',
  async (data, { rejectWithValue }) => {
    try {
      const response = await UserController.changeProfileData(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const changeAvatar = createAsyncThunk<UserData, FormData>(
  'user/changeAvatar',
  async (data, { rejectWithValue }) => {
    try {
      const response = await UserController.changeAvatar(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const changePassword = createAsyncThunk<boolean, UserPasswordData>(
  'user/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      await UserController.changePassword(data)
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const oAuthLogin = createAsyncThunk<UserData, OAuthLoginRequest>(
  'user/oauth',
  async (data, { rejectWithValue }) => {
    try {
      await oauthController.oAuthLogin(data)
      const response = await AuthController.getUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const oAuthServiceId = createAsyncThunk<boolean, OAuthServiceIdRequest>(
  'user/oauth/serviceId',
  async (data, { rejectWithValue }) => {
    try {
      const response = await oauthController.oAuthServiceId(data)
      window.open(
        `${oAuthYandexUrl}?response_type=code&client_id=${response.data.service_id}&redirect_uri=${redirectUri}`,
        '_self'
      )
      return true
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
