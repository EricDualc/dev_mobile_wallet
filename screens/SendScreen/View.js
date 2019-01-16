import React from 'react'
import moment from 'moment'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Picker, Modal, List, InputItem, Button, Card, WhiteSpace, WingBlank, Stepper } from 'antd-mobile'
import { Toast } from 'native-base'
import { logoutAction } from '../../redux/modules/login'
import styled from 'styled-components/native'

const alert = Modal.alert

const QRCodeButton = styled(Button)`
  margin-top: 50;
`

const SendForm = styled.View`
  margin-top: 20;
`

class Send extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    total: 'Invalid',
    amount: null,
    fee: null
  }

  componentDidMount() {
    this.calculateTotal(this.props.form.getFieldValue('amount'), this.props.form.getFieldValue('fee'))
  }

  calculateTotal = (amount, fee) => {
    console.log(amount)
    console.log(fee)
    if (!parseFloat(amount) || !parseFloat(fee)) {
      return this.setState({ total: 'Invalid' })
    }
    this.setState({ total: parseFloat(fee) + parseFloat(amount) })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        if (!Number(values.amount)) {
          const valuesWithAmountFloatError = {
            fee: { value: values.fee },
            sendTo: { value: values.sendTo },
            amount: { errors: ['Amount is not a valid float'], value: values.amount }
          }
          console.log(valuesWithAmountFloatError)
          this.props.form.setFields(valuesWithAmountFloatError)
          return false
        }
        // TODO: chosenAddressFunds
        // if (this.state.total > this.props.chosenAddressFunds) {
        // const valuesWithAmountFloatError = {
        //   fee: { value: values.fee },
        //   sendTo: { value: values.sendTo },
        //   amount: { errors: ['Chosen amount or fees is greater than available funds'], value: values.amount }
        // }
        //   this.props.form.setFields(valuesWithAmountFloatError)
        // }

        // ALL CLEAR WOO
        alert(
          `
 You are about to send
 ${values.amount} DEV 
 to 
 ${values.sendTo}
 The fee will be
 ${values.fee} DEV.
        `,
          'Are you sure?',
          [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            {
              text: 'Ok',
              onPress: () =>
                new Promise((resolve, reject) => {
                  this.props.sendDevAction(
                    {
                      ...values,
                      amount: parseFloat(values.amount),
                      inputAdds: []
                    },
                    resolve,
                    reject
                  )
                  Toast.show({ text: 'Sending...' })
                })
            }
          ]
        )
      }
      return console.log(values)
    })
    // Toast.show({ text: err })
  }

  onErrorClick = field => {
    const errors = this.props.form.getFieldError(field)
    Toast.show({ text: errors[0] })
  }

  pushToscanQRCodeScreen = () => this.props.navigation.navigate('scanQRCode')

  render() {
    const { addresses } = this.props
    const { getFieldProps, getFieldError } = this.props.form

    const { params } = this.props.navigation.state

    return (
      <View>
        <List>
          <InputItem
            onErrorClick={this.onErrorClick.bind(this, 'sendTo')}
            {...getFieldProps('sendTo', {
              rules: [
                {
                  required: true,
                  min: 30
                }
              ],
              initialValue: params && params.prefillInitialValues.sendTo
            })}
            placeholder="LbMBwLkw3sSB1AVeRdfP1mHcf8Zpgfwgi2"
            error={getFieldError('sendTo')}
            clear
            type="text"
          >
            To
          </InputItem>

          <InputItem
            onErrorClick={this.onErrorClick.bind(this, 'amount')}
            {...getFieldProps('amount', {
              onChange: amount => this.calculateTotal(amount, this.props.form.getFieldValue('fee')),
              rules: [
                {
                  required: true
                }
              ],
              initialValue: (params && params.prefillInitialValues.amount) || '0'
            })}
            placeholder="1337"
            error={getFieldError('amount')}
            type="number"
            clear
          >
            Amount
          </InputItem>
          <List.Item
            onErrorClick={this.onErrorClick.bind(this, 'amount')}
            error={getFieldError('fee')}
            extra={
              <Stepper
                {...getFieldProps('fee', {
                  onChange: fee => this.calculateTotal(this.props.form.getFieldValue('amount'), fee),
                  rules: [
                    {
                      required: true,
                      type: 'float',
                      min: 0.0
                    }
                  ],
                  initialValue: parseFloat(0.0001)
                })}
                min={parseFloat(0.0001)}
                showNumber
                size="small"
                defaultValue={parseFloat(0.0001)}
                step={parseFloat(0.0001)}
              />
            }
          >
            Fee
          </List.Item>
          <List.Item>{`Total DEV: ${this.state.total}`}</List.Item>
          {this.props.totpEnabled && (
            <InputItem
              maxLength={4}
              onErrorClick={this.onErrorClick.bind(this, 'oneTimeCode')}
              {...getFieldProps('oneTimeCode', {
                rules: [
                  {
                    required: true,
                    min: 6
                  }
                ]
              })}
              showNumber
              placeholder="1337"
              error={getFieldError('oneTimeCode')}
              type="number"
              clear
            >
              2FA Code
            </InputItem>
          )}
        </List>
        <Button onClick={this.handleSubmit}>Submit</Button>
        <QRCodeButton onClick={this.pushToscanQRCodeScreen}>Scan QR Code</QRCodeButton>
      </View>
    )
  }
}

export default Send
