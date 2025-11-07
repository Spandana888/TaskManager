import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, StyleSheet, View } from 'react-native'

export default class ErrorList extends Component {
  render() {
    const { t } = useTranslation()
    return (
      <View style={styles.container}>
        <Text> {t("noError")} </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 30}
})
