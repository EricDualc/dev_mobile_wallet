import { Observable } from 'rxjs'
import { ajax } from 'rxjs/observable/dom/ajax'
import { setBalanceAction } from '../../screens/OverviewScreen/Module'
import { Toast } from 'native-base'
import moment from 'moment'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const PERSIST_EMAIL = 'PERSIST_EMAIL'
export const PERSIST_PASSWORD = 'PERSIST_PASSWORD'
export const FINGERPRINT_LOGIN = 'FINGERPRINT_LOGIN'
export const ENABLE_FINGERPRINT_LOGIN = 'ENABLE_FINGERPRINT_LOGIN'
export const DISABLE_FINGERPRINT_LOGIN = 'DISABLE_FINGERPRINT_LOGIN'

const initialState = { isLoggedIn: false, email: null }

export const loginAction = payload => ({ type: LOGIN, payload })

export const fingerprintLoginAction = payload => ({ type: FINGERPRINT_LOGIN })

export const enableFingerprintLoginAction = payload => ({ type: ENABLE_FINGERPRINT_LOGIN, payload })

export const disableFingerprintLoginAction = payload => ({ type: DISABLE_FINGERPRINT_LOGIN })

export const setAccessTokenAction = payload => ({ type: SET_ACCESS_TOKEN, payload })

export const persistEmailAction = payload => ({ type: PERSIST_EMAIL, payload })

export const persistPasswordAction = payload => ({ type: PERSIST_PASSWORD, payload })

export const logoutAction = payload => ({ type: LOGOUT })

export const loginEpic = (action$, store) =>
  action$
    .ofType(LOGIN)
    .do(payload => console.log(payload))
    .mergeMap(({ payload }) =>
      ajax
        .post(
          'https://auth.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
          `grant_type=password&client_id=Login&username=${payload.username}&password=${payload.password}${
            payload.totp ? `&totp=${payload.totp}` : ''
          }`,
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .timeout(5000)
        .map(({ response }) => response)
        .do(h => console.log(h))
        .mergeMap(
          data =>
            store.getState().Login.email !== payload.username
              ? Observable.of(
                  setAccessTokenAction(data),
                  persistEmailAction({ email: payload.username }),
                  persistPasswordAction({ password: null }),
                  {
                    type: `${LOGIN}_SUCCESS`
                  }
                )
              : Observable.of(setAccessTokenAction(data), persistEmailAction({ email: payload.username }), {
                  type: `${LOGIN}_SUCCESS`
                })
        )
        .catch(err => {
          Toast.show({
            text: 'Error logging in.',
            type: 'danger'
          })
          return Observable.of({ type: 'ERROR' })
        })
    )

export const enableFingerprintLoginEpic = (action$, store) =>
  action$.ofType(ENABLE_FINGERPRINT_LOGIN).switchMap(({ payload }) =>
    Observable.combineLatest(Expo.Fingerprint.hasHardwareAsync(), Expo.Fingerprint.isEnrolledAsync()).switchMap(() =>
      ajax
        .post(
          'https://auth.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
          `grant_type=password&client_id=Login&username=${store.getState().Login.email}&password=${payload.password}`,
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .map(({ response }) => response)
        .mergeMap(() =>
          Observable.of(persistPasswordAction({ password: payload.password }), {
            type: `ENABLE_FINGERPRINT_LOGIN_SUCCESS`
          })
            .do(() => Toast.show({ text: 'Successfully enabled fingerprint login' }))
            .catch(err => {
              Toast.show({
                text: 'Error logging in.',
                type: 'danger'
              })
              return Observable.of({ type: 'ERROR' })
            })
        )
        .catch(err => {
          Toast.show({
            text: 'Error logging in.',
            type: 'danger'
          })
          return Observable.of({ type: 'ERROR' })
        })
    )
  )

export const disableFingerprintLoginEpic = (action$, store) =>
  action$.ofType(DISABLE_FINGERPRINT_LOGIN).mergeMap(() =>
    Observable.of(persistPasswordAction({ password: null }), {
      type: `ENABLE_FINGERPRINT_LOGIN_SUCCESS`
    }).do(() => Toast.show({ text: 'Successfully disabled fingerprint login' }))
  )

export const fingerprintLoginEpic = (action$, store) =>
  action$
    .ofType(FINGERPRINT_LOGIN)
    .mergeMap(() =>
      Observable.of(loginAction({ username: store.getState().Login.email, password: store.getState().Login.password }))
    )

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${LOGIN}_SUCCESS`:
      return { ...state, isLoggedIn: true }

    case SET_ACCESS_TOKEN:
      return {
        ...state,
        ...action.payload,
        expiresIn: moment().add(action.payload.expires_in, 'seconds'),
        refreshExpiresIn: moment().add(action.payload.refresh_expires_in, 'seconds')
      }

    case PERSIST_EMAIL:
      return {
        ...state,
        email: action.payload.email
      }

    case PERSIST_PASSWORD:
      return {
        ...state,
        password: action.payload.password
      }

    case LOGOUT:
      return { ...state, isLoggedIn: false }
    //   return initialState

    default:
      return state
  }
}

export default loginReducer

// [exp] Object {
//   [exp]   "access_token": "eyJhbGciOiJSUzI1NiI",
//   [exp]   "expires_in": 900,
//   [exp]   "not-before-policy": 0,
//   [exp]   "refresh_expires_in": 1800,
//   [exp]   "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI.eyJqdGkiOiJmMjJkZTk3Mi1hMGI",
//   [exp]   "session_state": "b07254df-c78f-4ad1-940c-8c07bde9460c",
//   [exp]   "token_type": "bearer",
//   [exp] }
