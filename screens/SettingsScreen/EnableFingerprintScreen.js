import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { List, InputItem, Button, Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { Toast, Container } from 'native-base'
import { createForm } from 'rc-form'
import { enableFingerprintLoginAction } from '../../redux/modules/login'
import InputItemStyle from 'antd-mobile/lib/input-item/style/index.native'

class EnableFingerprint extends React.Component {
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.enableFingerprintLoginAction(values)
        return console.log(values)
      }
      console.error(err)
    })
  }

  onErrorClick = field => {
    const errors = this.props.form.getFieldError(field)
    Toast.show({ text: errors[0] })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <Container>
        <List>
          <InputItem
            styles={StyleSheet.create({
              ...InputItemStyle,
              text: {
                ...InputItemStyle.text,
                fontSize: 15
              },
              input: {
                ...InputItemStyle.input
              }
            })}
            onErrorClick={this.onErrorClick.bind(this, 'password')}
            {...getFieldProps('password', {
              rules: [
                {
                  required: true
                }
              ]
            })}
            placeholder="*****"
            error={getFieldError('password')}
            clear
            type="password"
          >
            Password
          </InputItem>
        </List>
        <Button style={{ marginTop: 50 }} onClick={this.handleSubmit}>
          <Text>Enable</Text>
        </Button>
      </Container>
    )
  }
}

export default compose(connect(state => ({}), { enableFingerprintLoginAction }), createForm())(EnableFingerprint)
