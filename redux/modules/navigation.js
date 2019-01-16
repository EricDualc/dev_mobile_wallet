import { NavigationActions } from 'react-navigation'
import AppNavigator, { Tabs } from '../../navigation/navigator'
import { LOGIN, LOGOUT } from './login'
const ActionForLoggedOut = AppNavigator.router.getActionForPathAndParams('login')
const ActionForLoggedIn = AppNavigator.router.getActionForPathAndParams('mainScreens')
const ActionForEnableFingerprintSuccess = AppNavigator.router.getActionForPathAndParams('mainScreens')

const stateForLoggedOut = AppNavigator.router.getStateForAction(ActionForLoggedOut)
const stateForLoggedIn = AppNavigator.router.getStateForAction(ActionForLoggedIn, stateForLoggedOut)
const initialState = { stateForLoggedOut, stateForLoggedIn }

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${LOGIN}_SUCCESS`:
      return {
        ...state,
        stateForLoggedIn: AppNavigator.router.getStateForAction(ActionForLoggedIn, stateForLoggedOut)
      }

    case `ENABLE_FINGERPRINT_LOGIN_SUCCESS`:
      return {
        ...state,
        stateForLoggedIn: AppNavigator.router.getStateForAction(ActionForEnableFingerprintSuccess, stateForLoggedOut)
      }

    case LOGOUT:
      return {
        ...state,
        stateForLoggedOut: AppNavigator.router.getStateForAction(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'login' })]
          })
        )
      }

    /* Other logic for logging out, more cleaner but unlike the above isn't telling the reader 
           that navigation is reset, that's why I chose the *reset* one for the article. I prefer
           this one, what about you?
        
        case 'LOGOUT':
            return { 
              ...state, 
              stateForLoggedIn, 
              stateForLoggedOut
            }
            break;

        */

    default:
      return {
        ...state,
        stateForLoggedIn: AppNavigator.router.getStateForAction(action, state.stateForLoggedIn)
      }
  }
}

export default navigationReducer
