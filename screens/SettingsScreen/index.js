import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import { logoutAction, disableFingerprintLoginAction } from '../../redux/modules/login'
import { fetchBalanceAction, fetchDashboardAction, fetchAddressesAction } from './Module'
import Settings from './View'

export default compose(
  connect(state => ({ ...state.Overview, password: state.Login.password }), {
    logoutAction,
    fetchBalanceAction,
    fetchDashboardAction,
    fetchAddressesAction,
    disableFingerprintLoginAction
  })
)(Settings)
