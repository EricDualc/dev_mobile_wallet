import React from 'react'
import moment from 'moment'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button, Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'
import Transactions from './Transactions'

class Overview extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    this.props.fetchBalanceAction()
    this.props.fetchDashboardAction()
    this.props.fetchAddressesAction()
    this.props.fetchBTCValueAction()
    if (process.env.NODE_ENV !== 'development') {
      setInterval(() => {
        this.props.fetchBalanceAction()
        this.props.fetchDashboardAction()
        this.props.fetchAddressesAction()
        this.props.fetchBTCValueAction()
      }, 15 * 1000)
    }
  }

  render() {
    const { balance, balanceStaking, dashboard, addresses, btc } = this.props

    return (
      <List>
        {dashboard && balanceStaking && addresses && balance && btc ? (
          <ScrollView>
            <WingBlank size="lg">
              <Card>
                <Card.Header title={`DEV Value`} />
                <Card.Body>
                  <View style={{ paddingLeft: 10 }}>
                    <Text>Market rate: {btc && btc.btcValue} BTC</Text>
                    <Text>Last 24 hours change: {btc && btc.priceChange}%</Text>
                    <Text>BTCUSD pair: {btc && btc.btcPrice}</Text>
                  </View>
                </Card.Body>
              </Card>
            </WingBlank>

            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />

            <WingBlank size="lg">
              <Card>
                <Card.Header title={`Balance`} />
                <Card.Body>
                  <View style={{ paddingLeft: 10 }}>
                    <Text>TOTAL DEV BALANCE: {balance}</Text>
                    <Text>TOTAL STAKING: {balanceStaking}</Text>
                    <Text>EQUIVALENT BTC BALANCE: {(parseFloat(balance) * parseFloat(btc.btcValue)).toFixed(5)}</Text>
                  </View>
                </Card.Body>
              </Card>
            </WingBlank>

            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />

            <WingBlank size="lg">
              <Card>
                <Card.Header title={`Total Addresses: ${dashboard && dashboard.addresses}`} />
                <Card.Body>
                  <View style={{ paddingLeft: 10 }}>
                    {addresses &&
                      addresses.map(({ address, balance }) => (
                        <Text key={address}>
                          Address: {address} Balance: {balance}
                        </Text>
                      ))}
                  </View>
                </Card.Body>
              </Card>
            </WingBlank>
            <WhiteSpace size="lg" />

            <WhiteSpace size="lg" />
            <WingBlank size="lg">
              <Card>
                <Card.Header title="Difficulty" />
                <Card.Body>
                  <View style={{ paddingLeft: 10 }}>
                    <Text>PoW: {dashboard && dashboard.difficulty.PoW}</Text>
                    {dashboard && dashboard.difficulty.PoS && <Text>PoS: {dashboard && dashboard.difficulty.PoS}</Text>}
                  </View>
                </Card.Body>
              </Card>
            </WingBlank>
            <WhiteSpace size="lg" />

            <Transactions transactions={dashboard && dashboard.transactions} />
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
      </List>
    )
  }
}

export default Overview
