import React from 'react';
import { Text, TouchableHighlight, StyleSheet } from 'react-native';

function MyButton3({ title, onPress, backgroundColor }) {
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
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
        borderColor: '#FF6666',
        borderWidth: 3,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 20,
      },
});

export default MyButton3;