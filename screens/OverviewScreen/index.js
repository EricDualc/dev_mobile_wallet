import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'
import { fetchBalanceAction, fetchDashboardAction, fetchAddressesAction, fetchBTCValueAction } from './Module'
import Overview from './View'

export default compose(
  connect(state => ({ ...state.Overview }), {
    logoutAction,
    fetchBalanceAction,
    fetchDashboardAction,
    fetchAddressesAction,
    fetchBTCValueAction
  })
)(Overview)
