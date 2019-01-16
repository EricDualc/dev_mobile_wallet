import { Observable } from 'rxjs'
import { ajax } from 'rxjs/observable/dom/ajax'
import moment from 'moment'
import { setAccessTokenAction } from '../../redux/modules/login'
import { Toast } from 'native-base'
import superagent from 'superagent'

export const SET_BALANCE = 'SET_BALANCE'
export const FETCH_BALANCE = 'FETCH_BALANCE'
export const SET_DASHBOARD = 'SET_DASHBOARD'
export const FETCH_DASHBOARD = 'FETCH_DASHBOARD'
export const SET_ADDRESSES = 'SET_ADDRESSES'
export const FETCH_ADDRESSES = 'FETCH_ADDRESSES'
export const SEND_DEV = 'SEND_DEV'

export const setBalanceAction = payload => ({ type: SET_BALANCE, payload })

export const setDashboardAction = payload => ({ type: SET_DASHBOARD, payload })

export const fetchBalanceAction = () => ({ type: FETCH_BALANCE })

export const fetchDashboardAction = () => ({ type: FETCH_DASHBOARD })

export const setAddressesAction = payload => ({ type: SET_ADDRESSES, payload })

export const fetchAddressesAction = () => ({ type: FETCH_ADDRESSES })

export const sendDevAction = (payload, resolve, reject) => ({ type: SEND_DEV, payload, resolve, reject })

const getFormData = object =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key])
    return formData
  }, new FormData())

export const sendDevEpic = (action$, store) =>
  action$.ofType(SEND_DEV).mergeMap(action =>
    ajax
      .post('https://dev.poswallet.io/sendTransaction', action.payload, {
        Authorization: `Bearer ${store.getState().Login.access_token}`
      })
      .mergeMap(
        ({ response: { error, txid } }) =>
          error
            ? Observable.of({ type: 'ERROR' }).do(() => Toast.show({ text: error, type: 'danger' }))
            : Observable.of(fetchAddressesAction(), fetchBalanceAction(), fetchDashboardAction()).do(() => {
                Toast.show({ text: txid, type: 'success' }), action.resolve()
              })
      )
      .catch(err => {
        return Observable.of({ type: 'LOGOUT' }).do(() => Toast.show({ text: error, type: 'danger' }))
      })
  )
