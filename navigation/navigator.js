import { StackNavigator, TabNavigator, addNavigationHelpers, NavigationAction } from 'react-navigation'
import LoginScreen from '../screens/LoginScreen'
import OverviewScreen from '../screens/OverviewScreen'
import ReceiveScreen from '../screens/ReceiveScreen'
import SettingsScreen from '../screens/SettingsScreen'
import EnableFingerprintScreen from '../screens/SettingsScreen/EnableFingerprintScreen'
import ReceiveForAddressScreen from '../screens/ReceiveScreen/ReceiveForAddressScreen'
import SendToAddressScreen from '../screens/SendScreen'
import ScanQRCodeScreen from '../screens/SendScreen/ScanQRCodeScreen'

const receiveNavigator = StackNavigator({
  receive: {
    screen: ReceiveScreen
  },
  receiveAddress: {
    screen: ReceiveForAddressScreen
  }
})

const sendNavigator = StackNavigator({
  send: {
    screen: SendToAddressScreen
  },
  scanQRCode: {
    screen: ScanQRCodeScreen
  }
})

const settingsNavigator = StackNavigator({
  settings: {
    screen: SettingsScreen
  },
  enableFingerprint: {
    screen: EnableFingerprintScreen
  }
})

export const Tabs = TabNavigator(
  {
    overview: {
      screen: OverviewScreen,
      navigationOptions: {
        tabBarLabel: 'Overview',
        title: 'Overview'
      }
    },
    receive: {
      screen: receiveNavigator,
      navigationOptions: {
        tabBarLabel: 'Receive',
        header: null
      }
    },
    send: {
      screen: sendNavigator,
      navigationOptions: {
        tabBarLabel: 'Send',
        header: null
      }
    },
    settings: {
      screen: settingsNavigator,
      navigationOptions: {
        tabBarLabel: 'Settings',
        header: null
      }
    }
  },
  // TODO: Change back to overview
  {
    initialRouteName: 'overview',
    tabBarOptions: {
      activeTintColor: '#69c0d9',
      labelStyle: {
        fontSize: 13,
        textAlign: 'center',
        textAlignVertical: 'center'
      },
      // allowFontScaling?: boolean,
      // activeBackgroundColor: '#22354F',
      // inactiveTintColor?: string,
      inactiveBackgroundColor: '#22354F'
      // inactiveBackgroundColor?: string,
      // showLabel?: boolean,
      // style?: StyleProp<ViewStyle>,
      // iconStyle?: StyleProp<ViewStyle>,
      // // Top
      // showIcon?: boolean,
      // upperCaseLabel?: boolean,
      // pressColor?: string,
      // pressOpacity?: number,
      // scrollEnabled?: boolean,
      // tabStyle?: StyleProp<ViewStyle>,
      // indicatorStyle?: StyleProp<ViewStyle>,
    }
  }
)

const navigator = StackNavigator(
  {
    login: {
      // TODO: REVERT THIS PLEASE
      screen: LoginScreen
    },
    mainScreens: {
      screen: Tabs,
      navigationOptions: {
        gesturesEnabled: false,
        headerLeft: null
      }
    }
  },
  {
    initialRouteName: 'login'
  }
)

export default navigator
