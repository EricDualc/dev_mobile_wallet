import { Observable } from 'rxjs'
import { ajax } from 'rxjs/observable/dom/ajax'
import moment from 'moment'
import { setAccessTokenAction } from '../../redux/modules/login'
import { retryHandler } from '../../redux/modules/utilities'
import superagent from 'superagent'

export const SET_BALANCE = 'SET_BALANCE'
export const FETCH_BALANCE = 'FETCH_BALANCE'
export const SET_DASHBOARD = 'SET_DASHBOARD'
export const FETCH_DASHBOARD = 'FETCH_DASHBOARD'
export const SET_ADDRESSES = 'SET_ADDRESSES'
export const FETCH_ADDRESSES = 'FETCH_ADDRESSES'
export const FETCH_BTC_VALUE = 'FETCH_BTC_VALUE'
export const SET_BTC_VALUE = 'SET_BTC_VALUE'

const initialState = { balance: 0 }

export const setBalanceAction = payload => ({ type: SET_BALANCE, payload })

export const setDashboardAction = payload => ({ type: SET_DASHBOARD, payload })

export const fetchBalanceAction = () => ({ type: FETCH_BALANCE })

export const fetchDashboardAction = () => ({ type: FETCH_DASHBOARD })

export const setAddressesAction = payload => ({ type: SET_ADDRESSES, payload })

export const fetchAddressesAction = () => ({ type: FETCH_ADDRESSES })

export const fetchBTCValueAction = () => ({ type: FETCH_BTC_VALUE })

export const setBTCValueAction = payload => ({ type: SET_BTC_VALUE, payload })

export const fetchBalanceEpic = (action$, store) =>
  action$.ofType(FETCH_BALANCE).switchMap(
    () =>
      moment(store.getState().Login.expiresIn).isSameOrBefore(Date.now())
        ? ajax
            .post(
              'https://dev.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
              `client_id=Login&grant_type=refresh_token&refresh_token=${store.getState().Login.refresh_token}`,
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${store.getState().Login.access_token}`
              }
            )
            .timeout(5000)
            .map(({ response }) => response)
            .mergeMap(data => Observable.of(setAccessTokenAction(data), fetchBalanceAction()))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
        : Observable.of(store.getState().Login.access_token)
            .flatMap(access_token =>
              ajax.get(`https://dev.poswallet.io/getBalance?exact=true`, {
                Authorization: `Bearer ${access_token}`
              })
            )
            .retryWhen(retryHandler)
            .map(({ response }) => response)
            .flatMap(data => Observable.of(setBalanceAction(data)))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
  )

export const fetchDashboardEpic = (action$, store) =>
  action$.ofType(FETCH_DASHBOARD).switchMap(
    () =>
      moment(store.getState().Login.expiresIn).isSameOrBefore(Date.now())
        ? ajax
            .post(
              'https://dev.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
              `client_id=Login&grant_type=refresh_token&refresh_token=${store.getState().Login.refresh_token}`,
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${store.getState().Login.access_token}`
              }
            )
            .timeout(5000)
            .map(({ response }) => response)
            .mergeMap(data => Observable.of(setAccessTokenAction(data), fetchDashboardAction()))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
        : Observable.of(store.getState().Login.access_token)
            .flatMap(access_token =>
              ajax.get(`https://dev.poswallet.io/getDashboard`, {
                Authorization: `Bearer ${access_token}`
              })
            )
            .retryWhen(retryHandler)
            .map(({ response }) => response)
            .flatMap(data => Observable.of(setDashboardAction(data)))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
  )

export const fetchAddressesEpic = (action$, store) =>
  action$.ofType(FETCH_ADDRESSES).switchMap(
    () =>
      moment(store.getState().Login.expiresIn).isSameOrBefore(Date.now())
        ? ajax
            .post(
              'https://dev.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
              `client_id=Login&grant_type=refresh_token&refresh_token=${store.getState().Login.refresh_token}`,
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${store.getState().Login.access_token}`
              }
            )
            .timeout(5000)
            .map(({ response }) => response)
            .mergeMap(data => Observable.of(setAccessTokenAction(data), fetchAddressesAction()))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
        : Observable.of(store.getState().Login.access_token)
            .flatMap(access_token =>
              ajax.get(`https://dev.poswallet.io/getAddresses?exact=true`, {
                Authorization: `Bearer ${access_token}`
              })
            )
            .retryWhen(retryHandler)
            .map(({ response }) => response)
            .flatMap(data => Observable.of(setAddressesAction(data)))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
  )

export const fetchBTCValueEpic = (action$, store) =>
  action$.ofType(FETCH_BTC_VALUE).switchMap(
    () =>
      moment(store.getState().Login.expiresIn).isSameOrBefore(Date.now())
        ? ajax
            .post(
              'https://dev.poswallet.io/auth/realms/webwallet/protocol/openid-connect/token',
              `client_id=Login&grant_type=refresh_token&refresh_token=${store.getState().Login.refresh_token}`,
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${store.getState().Login.access_token}`
              }
            )
            .timeout(5000)
            .map(({ response }) => response)
            .mergeMap(data => Observable.of(setAccessTokenAction(data), fetchBTCValueAction()))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
        : Observable.of(store.getState().Login.access_token)
            .flatMap(access_token =>
              ajax.get(`https://dev.poswallet.io/getBTCValue`, {
                Authorization: `Bearer ${access_token}`
              })
            )
            .retryWhen(retryHandler)
            .map(({ response }) => response)
            .flatMap(data => Observable.of(setBTCValueAction(data)))
            .catch(err => Observable.of({ type: 'LOGOUT' }))
  )

const overviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BALANCE:
      return { ...state, ...action.payload }

    case SET_DASHBOARD:
      return {
        ...state,
        dashboard: { ...action.payload, transactions: action.payload && action.payload.transactions.slice(0, 20) }
      }

    case SET_ADDRESSES:
      return { ...state, addresses: action.payload }

    case SET_BTC_VALUE:
      return { ...state, btc: action.payload }

    default:
      return state
  }
}

export default overviewReducer
