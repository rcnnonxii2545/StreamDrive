import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

const Get = () => {
  const [data, setData] = useState([]);
  const [currentData, setcurrentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://13.236.182.88:8055/items/Bus', {
          headers: {
            Authorization: 'JOpWZxWnZQkOHb-0TdaJ7eRMn6lS5MDw',
          },
        });
        setData(response.data.data); // Assuming the API response has a 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[]);

  useEffect(() => {
    if (data.length > 0) {
      const currentData = data.reduce((max, item) => (item.id > max.id ? item : max), data[0]);
      setcurrentData(currentData);
    }
  }, [data]);

  return (
    <View>
      {currentData && (
        <View style={styles.dataContainer}>
          {/* <Text style={styles.dataText}>Get Latitude: {currentData.Latitude}</Text>
          <Text style={styles.dataText}>Get Longitude: {currentData.Longitude}</Text>
          <Text style={styles.dataText}>Get Time: {currentData.Time}</Text>
          <Text style={styles.dataText}>Get Date: {currentData.Date}</Text> */}
          <Text style={styles.dataText}>Get Name: {currentData.Name}</Text>
          <Text style={styles.dataText}>Get Surname: {currentData.Surname}</Text>
          <Text style={styles.dataText}>Get Phonenumber: {currentData.Phonenumber}</Text>
          <Text style={styles.dataText}>Get Typecar: {currentData.Typecar}</Text>
          <Text style={styles.dataText}>Get Busnumber: {currentData.Busnumber}</Text>
          <Text style={styles.dataText}>Get Capacity: {currentData.Capacity}</Text>
          
 
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Get;