import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';

function MyButton4({ title, onPress, backgroundColor }) {
    return (
      <TouchableHighlight
        style={[styles.button1, { backgroundColor }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText1}>{title}</Text>
      </TouchableHighlight>
    );
  }

const styles = StyleSheet.create({
  button1: {
    // backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    borderColor: '#FF6666',
    borderWidth: 3,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText1: {
    color: '#FF6666',
    fontSize: 20,
  },
});

export default MyButton4;