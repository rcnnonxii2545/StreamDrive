import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';

function MyButton({ title, onPress, backgroundColor }) {
  return (
    <TouchableHighlight
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  button: {
    // backgroundColor: '#FF6666',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50, // ค่านี้คือครึ่งของความสูง (height) ของปุ่ม
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FF6666',
    // borderWidth: 3,
},

  buttonText: {
    color: 'white',
    fontSize: 25,
  },
});

export default MyButton;