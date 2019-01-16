import React from 'react'
import moment from 'moment'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Container } from 'native-base'
import { List, InputItem, Toast, Button, Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'

class Settings extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentWillMount() {}

  render() {
    return (
      <Container>
        <List>
          {this.props.password && this.props.password.length > 0 ? (
            <Button onClick={() => this.props.disableFingerprintLoginAction()}>Disable Fingerprint Login</Button>
          ) : (
            <Button onClick={() => this.props.navigation.navigate('enableFingerprint')}>
              Enable Fingerprint Login (2FA incompatible)
            </Button>
          )}
          <Button onClick={this.props.logoutAction}>Logout</Button>
        </List>
      </Container>
    )
  }
}

export default Settings
