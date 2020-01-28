import React from "react";

import { View, Button } from "react-native";

class Header extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ backgroundColor: "#CCC" }}>
        <Button title="Menu" onPress={() => navigation.toggleDrawer()} />
      </View>
    );
  }
}

export default Header;
