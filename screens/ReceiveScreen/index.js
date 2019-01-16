import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'
import { fetchBalanceAction, fetchDashboardAction, fetchAddressesAction, createNewAddressAction } from './Module'
import Receive from './View'

export default compose(
  connect(state => ({ addresses: state.Overview.addresses }), {
    logoutAction,
    fetchBalanceAction,
    fetchDashboardAction,
    fetchAddressesAction,
    createNewAddressAction
  })
)(Receive)
