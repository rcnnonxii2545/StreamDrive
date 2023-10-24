import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';

function MyButton2({ title, onPress, backgroundColor }) {
    return (
      <TouchableHighlight
        style={[styles.button2, { backgroundColor }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText2}>{title}</Text>
      </TouchableHighlight>
    );
  }

const styles = StyleSheet.create({
  button2: {
    // backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 3,
    margin: 10,
  },
  buttonText2: {
    color: 'black',
    fontSize: 25,
  },
});

export default MyButton2;