import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  NativeModules,
} from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { loginAction, logoutAction, fingerprintLoginAction } from '../redux/modules/login'
import { MonoText } from '../components/StyledText'
import { List, InputItem, Button } from 'antd-mobile'
import { Container, Content, CheckBox, Toast } from 'native-base'
import { createForm } from 'rc-form'
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'

const Item = List.Item

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    waitingForFingerprint: false,
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        return this.props.loginAction(values)
      }
      console.error(err)
    })
  }

  openCreateAccountPageInBrowser = () => WebBrowser.openBrowserAsync('https://dev.poswallet.io')

  onErrorClick = field => {
    const errors = this.props.form.getFieldError(field)
    Toast.show({ text: errors[0] })
  }

  fingerprintLogin = async () => {
    let authFunction
    Toast.show({
      text: 'Scan your fingerprint now!',
      position: 'top',
      buttonText: 'Okay',
    })

    if (Platform.OS === 'android') {
      authFunction = async () => {
        let result
        this.setState({ waitingForFingerprint: true })
        try {
          result = await NativeModules.ExponentFingerprint.authenticateAsync()
          if (result.success) {
            this.props.fingerprintLoginAction()
          } else {
            alert('Failed to authenticate')
          }
        } finally {
          this.setState({ waitingForFingerprint: false })
        }
      }
    } else if (Platform.OS === 'ios') {
      authFunction = async () => {
        let result = await NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!')
        if (result.success) {
          this.props.fingerprintLoginAction()
        } else {
          alert('Cancel!')
        }
      }
    }

    await authFunction()
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    const { password } = this.props
    return (
      <Container>
        <Content style={{ height: '100%', backgroundColor: '#263345' }}>
          <List>
            <Item style={{ height: 200, backgroundColor: '#263345' }}>
              <Image
                style={{
                  flex: 1,
                  resizeMode: 'center',
                }}
                source={{
                  uri: 'https://auth.poswallet.io/auth/resources/4.0.0.beta1/login/keycloak/img/keycloak-logo.png',
                }}
              />
            </Item>
            <InputItem
              onErrorClick={this.onErrorClick.bind(this, 'username')}
              {...getFieldProps('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: this.props.email,
              })}
              placeholder="john.smith@gmail.com"
              error={getFieldError('username')}
              clear
              type="email"
            >
              Email
            </InputItem>

            <InputItem
              styles={StyleSheet.create({
                ...InputItemStyle,
                text: {
                  ...InputItemStyle.text,
                  fontSize: 15,
                },
                input: {
                  ...InputItemStyle.input,
                },
              })}
              onErrorClick={this.onErrorClick.bind(this, 'password')}
              {...getFieldProps('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })}
              placeholder="*****"
              type="password"
              error={getFieldError('password')}
              clear
            >
              Password
            </InputItem>

            <InputItem
              onErrorClick={this.onErrorClick.bind(this, 'totp')}
              {...getFieldProps('totp', {
                rules: [],
              })}
              placeholder="OPTIONAL - e.g. 123456"
              type="text"
              error={getFieldError('totp')}
              clear
            >
              2FA Code
            </InputItem>
            <Button style={{ marginTop: 70 }} onClick={this.handleSubmit}>
              <Text>Submit</Text>
            </Button>
            {this.state.waitingForFingerprint ? (
              <Button>
                <Text>{'Awaiting Fingerprint'}</Text>
              </Button>
            ) : (
              password &&
              password.length > 0 && (
                <Button
                  onClick={async () => {
                    await this.fingerprintLogin()
                  }}
                >
                  <Text>{'Fingerprint login'}</Text>
                </Button>
              )
            )}
            <Button style={{ marginTop: 70 }} onClick={this.openCreateAccountPageInBrowser}>
              <Text>Create Account</Text>
            </Button>
          </List>
        </Content>
      </Container>
    )
  }
}

export default compose(
  connect(
    state => ({ email: state.Login.email, password: state.Login.password }),
    {
      loginAction,
      logoutAction,
      fingerprintLoginAction,
    },
  ),
  createForm(),
)(LoginScreen)
