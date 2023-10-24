import { View, Text,StyleSheet,Button } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react';
import {  useNavigation,useRoute } from '@react-navigation/native';
import MapView, {enableLatestRenderer,Marker} from 'react-native-maps';
import axios from 'axios';

// enableLatestRenderer();
const Map = () => {
  
  const navigation = useNavigation();
  const route = useRoute();
  const {busnumber} = route.params;
 
  const [data, setData] = useState([])

  useEffect(() => {
    const query = `
    query {
      Buslocation {
        BusID {
          Busnumber
          Capacity
          Model
        }
        LocationID
        Latitude
        Longitude
      }
    }
    `;
  
    axios
      .post('http://10.10.99.9:8055/graphql', { query })
      .then((response) => {
        if (response.data && response.data.data) {
          setData(response.data.data.Buslocation);
        } else {
          console.error('Invalid GraphQL response:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const filteredData = data.filter((item) => item.BusID.Busnumber === busnumber);

  // Find the data with the highest locationID for each Busnumber
  const latestLocationDataByBusnumber = {};
  filteredData.forEach((item) => {
    const currentBusnumber = item.BusID.Busnumber;
    if (
      !latestLocationDataByBusnumber[currentBusnumber] ||
      item.LocationID > latestLocationDataByBusnumber[currentBusnumber].LocationID
    ) {
      latestLocationDataByBusnumber[currentBusnumber] = item;
    }
  });

  console.log("bus position : ", latestLocationDataByBusnumber)
  
  return (
    
   
      <View style = {{flex : 1}}>
        {Object.values(latestLocationDataByBusnumber).map((latestLocationData) => (
          
          <MapView
            key={latestLocationData.LocationID}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(latestLocationData.Latitude),
              longitude: parseFloat(latestLocationData.Longitude),
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,}}
          >
          <Marker
            coordinate={{
              latitude: parseFloat(latestLocationData.Latitude),
              longitude:parseFloat(latestLocationData.Longitude),
            }}
            title="Bus Location"
          />
        </MapView>
        ))}
    </View>
      )}
    
  
  

  
        
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    
  },
  locationMap: {
    margin: 10,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  suggestionList: {
    marginTop: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  suggestionList: {
    marginTop: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
export default Map