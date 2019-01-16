import { combineEpics } from 'redux-observable'
import { persistCombineReducers, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { combineReducers } from 'redux'
import reducerExample from './reducerExample'
import Navigation from './navigation'
import login, {
  loginEpic,
  fingerprintLoginEpic,
  enableFingerprintLoginEpic,
  disableFingerprintLoginEpic
} from './login'
import overview, {
  fetchBalanceEpic,
  fetchDashboardEpic,
  fetchAddressesEpic,
  fetchBTCValueEpic
} from '../../screens/OverviewScreen/Module'
import { sendDevEpic } from '../../screens/SendScreen/Module'
import { createNewAddressEpic } from '../../screens/ReceiveScreen/Module'

const epics = [
  loginEpic,
  fetchBalanceEpic,
  fetchDashboardEpic,
  fetchAddressesEpic,
  fetchBTCValueEpic,
  fingerprintLoginEpic,
  enableFingerprintLoginEpic,
  disableFingerprintLoginEpic,
  sendDevEpic,
  createNewAddressEpic
]

export const rootEpic = combineEpics(...epics)

const config = {
  key: 'root',
  storage,
  blacklist: []
}

const ReducerExample = persistReducer(config, reducerExample)
const Login = persistReducer({ ...config, key: 'primary' }, login)
const Overview = persistReducer(config, overview)

export const rootReducer = combineReducers({ ReducerExample, Login, Navigation, Overview })
