import { Notifications } from 'expo'
import React from 'react'
import { connect } from 'react-redux'
import { Text, BackHandler } from 'react-native'
import { StackNavigator, addNavigationHelpers, NavigationAction } from 'react-navigation'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import configureStore from '../redux/configureStore'
import NavigationStack from './navigator'
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync'
import { Container, Content } from 'native-base'

class AppNavigator extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  onBackPress = () => {
    const { dispatch, navigationState } = this.props
    console.log(this.props)
    if (navigationState.stateForLoggedIn.index <= 1) {
      BackHandler.exitApp()
      return
    }
    dispatch(NavigationActions.back())
    return true
  }

  render() {
    const { navigationState, dispatch, isLoggedIn } = this.props
    const state = isLoggedIn ? navigationState.stateForLoggedIn : navigationState.stateForLoggedOut

    return <NavigationStack navigation={addNavigationHelpers({ dispatch, state })} />
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.Login.isLoggedIn,
    navigationState: state.Navigation
  }
}

export default connect(mapStateToProps)(AppNavigator)
