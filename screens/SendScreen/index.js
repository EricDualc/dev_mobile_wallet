import React from 'react'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { WebBrowser } from 'expo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List, InputItem, Toast, Button } from 'antd-mobile'
import { logoutAction } from '../../redux/modules/login'
import { fetchBalanceAction, fetchDashboardAction, fetchAddressesAction, sendDevAction } from './Module'
import { createForm } from 'rc-form'
import Send from './View'

export default compose(
  connect(
    state => ({
      addresses: state.Overview.addresses,
      totpEnabled: state.Login['2fa']
      // true
    }),
    {
      logoutAction,
      fetchBalanceAction,
      fetchDashboardAction,
      fetchAddressesAction,
      sendDevAction
    }
  ),
  createForm()
)(Send)
