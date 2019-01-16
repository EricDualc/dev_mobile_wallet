import React from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  Image,
  ListView,
  NativeModules,
  Platform,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import Expo, {
  Constants,
  Contacts,
  DocumentPicker,
  MapView,
  KeepAwake,
  BlurView,
  LinearGradient,
  Font,
  Location,
  Notifications,
  Permissions,
  Video
} from 'expo'

export default class TouchIDExample extends React.Component {
  state = {
    waiting: false
  }

  render() {
    let authFunction
    if (Platform.OS === 'android') {
      authFunction = async () => {
        let result
        try {
          this.setState({ waiting: true }, async () => {
            result = await NativeModules.ExponentFingerprint.authenticateAsync()
            if (result.success) {
              alert('Authenticated!')
            } else {
              alert('Failed to authenticate')
            }
          })
        } finally {
          this.setState({ waiting: false })
        }
      }
    } else if (Platform.OS === 'ios') {
      authFunction = async () => {
        let result = await NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!')
        if (result.success) {
          alert('Success!')
        } else {
          alert('Cancel!')
        }
      }
    }

    return (
      <View style={{ padding: 10 }}>
        <Button title="Hello" onPress={authFunction}>
          {this.state.waiting ? 'Waiting for fingerprint... ' : 'Authenticate with fingerprint'}
        </Button>
      </View>
    )
  }
}
