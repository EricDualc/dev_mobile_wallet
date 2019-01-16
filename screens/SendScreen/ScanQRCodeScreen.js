import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  _handleBarCodeRead = ({ type, data }) => {
    if (type === BarCodeScanner.Constants.BarCodeType.qr) {
      // alert(`Bar code with type ${type} and data ${data} has been scanned!`)
      // send ${this.props.navigation.state.params.address} ${values.amount}
      let initialValues = data.split(' ')
      console.log(initialValues)
      initialValues = { sendTo: initialValues[1], amount: initialValues[2] }
      console.log(initialValues)
      this.pushToSendScreenAndPrefill(initialValues)
      this.setState({ hasCameraPermission: null })
      return true
    }
  }

  pushToSendScreenAndPrefill = prefillInitialValues => this.props.navigation.navigate('send', { prefillInitialValues })

  render() {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner onBarCodeRead={this._handleBarCodeRead} style={StyleSheet.absoluteFill} />
        </View>
      )
    }
  }
}
