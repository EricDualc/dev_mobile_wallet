import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistCombineReducers, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { rootEpic, rootReducer } from './modules/root'

const epicMiddleware = createEpicMiddleware(rootEpic)

// This will persist all the reducers, but I don't want to persist navigation state, so instead will use persistReducer.
// const rootReducer = persistCombineReducers(config, reducer)

// We are only persisting the counterReducer and loginRducer
// const CounterReducer = persistReducer(config, counterReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore() {
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)))
  let persistor = persistStore(store)

  return { store, persistor }
}
