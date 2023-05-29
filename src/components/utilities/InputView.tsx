import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const InputView = ({ children }: { children: React.ReactNode }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView style={styles.flex1} behavior="height">
      {children}
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default InputView;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
