import React from "react";
import { Button as RNButton, Platform, View, Text } from "react-native";
import { C } from "./constants";
import Touchable from "react-native-platform-touchable";

type Props = {
  onPress: () => void,
  style?: Object,
  disabled?: boolean,
  title: string
};

class Button extends React.Component<Props> {

  render() {
    return Platform.OS === "ios" ? (
      <RNButton {...this.props} />
    ) : (
      <Touchable disabled={this.props.disabled} onPress={this.props.onPress}>
        <View style={this.props.style}>
          <Text
            style={{
              color: this.props.disabled ? "#CCC" : C.BUTTON_COLOR,
              fontSize: 18
            }}
          >
            {this.props.title}
          </Text>
        </View>
      </Touchable>
    );
  }

}

export default Button;
