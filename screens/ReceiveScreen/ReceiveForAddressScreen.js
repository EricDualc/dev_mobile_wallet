import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import QRCode from 'react-native-qrcode'

class ReceiveForAddressScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params && navigation.state.params.address
  })

  state = { qrCodeValue: null }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const qrCodeInstruction = `send ${this.props.navigation.state.params.address} ${values.amount}`
        this.setState({ qrCodeValue: qrCodeInstruction, qrCodeInstruction })
        return console.log(values)
      }
      console.error(err)
    })
  }

  onErrorClick = field => {
    const errors = this.props.form.getFieldError(field)
    Toast.info(errors[0])
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <View>
        <List>
          <InputItem
            onErrorClick={this.onErrorClick.bind(this, 'amount')}
            {...getFieldProps('amount', {
              rules: [
                {
                  required: true
                }
              ]
            })}
            placeholder="1337"
            error={getFieldError('amount')}
            clear
            type="number"
          >
            Amount
          </InputItem>
        </List>
        <Button
          style={{
            marginTop: 25
          }}
          onClick={this.handleSubmit}
        >
          Generate QR Code
        </Button>
        <View
          style={{
            marginTop: 50,
            marginBottom: 20,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {this.state.qrCodeInstruction && <Text>{this.state.qrCodeInstruction}</Text>}
          {this.state.qrCodeValue && <QRCode value={this.state.qrCodeValue} />}
        </View>
      </View>
    )
  }
}

export default compose(connect(state => ({ lol: state.ReducerExample.hello })), createForm())(ReceiveForAddressScreen)
