import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Text, StyleSheet, View } from "react-native";

class ErrorList extends Component<any> {
  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        ListEmptyComponent={<Text>No errors available</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 30 },
});

export default withTranslation()(ErrorList);
