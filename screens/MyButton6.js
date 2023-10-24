import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';

function MyButton6({ title, onPress, backgroundColor }) {
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
    borderRadius: 10, // ค่านี้คือครึ่งของความสูง (height) ของปุ่ม
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    padding:20,
    borderWidth: 3,
},

  buttonText: {
    color: '#FF6666',
    fontSize: 15,
  fontWeight: 'bold',

  },
});

export default MyButton6;