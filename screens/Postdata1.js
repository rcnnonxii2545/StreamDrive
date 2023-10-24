import axios from 'axios';
import {View, Text, StyleSheet, Button, Linking,PermissionsAndroid } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {  useNavigation,useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const Postdata1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentDate, setCurrentDate] = useState(new Date());
  const {Licenseplate,Name,Package,Phonenumber,nDate,x,y,time} = route.params;
  const apiKey = '42hOVCKcUHoAx8T0DDMNony4duoS9DcR';
  const baseUrl1 = 'http://13.236.182.88:8055/items/Deliverly';

  
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  
  useEffect(() => {
    const newItem1 = {
      Latitude: x,
      Longitude: y,
      Licenseplate: Licenseplate,
      Package : Package,
      Name : Name,
      Phonenumber : Phonenumber,
    };
  
    fetch(baseUrl1, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newItem1),
    })
      .then(response => response.json())
      .then(data => {
        console.log('New item added to Buslocation:', data);
      })
      .catch(error => {
        console.error('Error adding item to Buslocation:', error);
      });
  }, [x, y, time, nDate]);
  
  return (
      <View style={styles.locationMap}>
        <Button
          title="Next"
          onPress={() => navigation.navigate('Start')}
        />
      </View>
  );
}
const styles = StyleSheet.create({
  locationMap: {
    margin: 10,
  },
});

export default Postdata1;