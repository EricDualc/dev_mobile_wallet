import React from 'react'
import styled from 'styled-components/native'
import moment from 'moment'
import { View, Text, FlatList } from 'react-native'
import { Accordion, List, Card, WhiteSpace, WingBlank } from 'antd-mobile'

/*
{
  address: 'LbMBwLkw3sSB1AVeRdfP1mHcf8Zpgfwgi2',
  amount: '0.60000234',
  confirmations: 321,
  txid: '0bfd3460c59d5c19da4d71d0ca33bc1b9e9472f4e98f81c0cca84556543fd1b9',
  time: 1516298272,
  category: 'generate'
}
*/

const TxDate = styled.Text``

const categoryColorMapping = category => {
  if (category === 'generate' || category === 'receive') return 'green'
  if (category === 'send') return 'red'
}
const TxCategory = styled.View`
  flex-wrap: wrap;
  background-color: ${props => categoryColorMapping(props.category)};
`
const TxCategoryText = styled.Text``

const Tx = styled(List.Item)`
  flex-direction: column;
`

const Transaction = ({ address, amount, confirmations, txid, time, category }) => (
  <View style={{ paddingLeft: 10 }}>
    <Text>PoW: {amount}</Text>
    <Text>PoS: {address}</Text>
  </View>
  // // <WingBlank size="lg">
  //   {/* <Card>
  //     <Card.Header title="Difficulty" />
  //     <Card.Body> */}

  // //     </Card.Body>
  // //   </Card>
  // </WingBlank>
)

export default ({ transactions }) => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={item => item.txid + item.category + item.amount + item.time}
      renderItem={({ item }) => <Transaction {...item} />}
    />
  )
}
