import React from 'react'
import moment from 'moment'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Modal, List, InputItem, Toast, Button, Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'
import Transactions from './Transactions'

const Item = List.Item

const alert = Modal.alert

class Receive extends React.Component {
  static navigationOptions = { headerMode: 'none', header: null }

  confirmNewAddress = () => {
    alert(`Create a new address to receive DEV?`, '', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () =>
          new Promise((resolve, reject) => {
            this.props.createNewAddressAction(resolve, reject)
            Toast.show({ text: 'Creating new DEV address...' })
          })
      }
    ])
  }

  render() {
    const { addresses } = this.props
    return (
      <View>
        <List>
          <View style={{ fontSize: 17, marginBottom: 30, border: 'none' }}>
            <Text style={{ textAlign: 'center', fontSize: 17 }}>Choose an address to receive Dev</Text>
          </View>
          {addresses ? (
            addresses.map(address => (
              <Button
                onClick={() => this.props.navigation.navigate('receiveAddress', { address: address.address })}
                key={address && address.address}
              >
                {address.address}
              </Button>
            ))
          ) : (
            <Text>Loading...</Text>
          )}
        </List>
        <View style={{ marginTop: 50 }}>
          <Button onClick={() => this.confirmNewAddress()}>Create new address</Button>
        </View>
      </View>
    )
  }
}

export default Receive
