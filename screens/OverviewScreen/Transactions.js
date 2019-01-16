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
const RecentTransactionsLabel = styled.Text`
  font-size: 18px;
  padding-left: 10px;
  margin-bottom: 10px;
`

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

const Transaction = ({ address, amount, confirmations, txid, time, category }) => {
  let formattedTime = moment.unix(time).toDate()
  formattedTime = moment(formattedTime)
    .local()
    .format('DD/MM/YYYY HH:mm:ss')
  return (
    <View style={{ paddingLeft: 10, borderTopColor: 'black', borderTopWidth: 1 }}>
      <Text>Category: {category}</Text>
      <Text>Amount: {amount}</Text>
      <Text>Address: {address}</Text>
      <Text>Time: {formattedTime}</Text>
      <Text>Confirmations: {confirmations}</Text>
    </View>
  )
  // // <WingBlank size="lg">
  //   {/* <Card>
  //     <Card.Header title="Difficulty" />
  //     <Card.Body> */}

  // //     </Card.Body>
  // //   </Card>
  // </WingBlank>
}

export default ({ transactions }) => {
  return (
    <View>
      <RecentTransactionsLabel>Recent Transactions:</RecentTransactionsLabel>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) =>
          item.txid + item.category + item.amount + item.time + item.confirmations + item.address + index
        }
        renderItem={({ item }) => <Transaction {...item} />}
      />
    </View>
  )
}
