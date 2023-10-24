import { View, Text,Button ,StyleSheet,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyButton1 from './Mybutton1';
import MyButton from './Mybutton';
const Driver1= () => {
  const navigation = useNavigation();
  return (
    <View style={styles.BG}>
      <View>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FF6666" />
          </TouchableOpacity>
        <Image
            source={require('./image/driver.png')} 
            style={styles.image}
          />
          <View>
            <Text style = {styles.text1}>
              Please select service 
            </Text>
          </View>
          
        </View>
      <View style={styles.container}>
        <MyButton
          title="Bus"
          onPress={() => navigation.navigate('Driver')}
          backgroundColor="#FF6666"
        />
        <MyButton1
          title="Deliverly"
          onPress={() => navigation.navigate('Deliverly')}
          backgroundColor="white"
        />
      </View>
      <TouchableOpacity
          style={styles. backButton1}
          onPress={() => navigation.navigate('Start')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <Image
          source={require('./image/stream.png')} 
          style={styles.image2}
        />
    </View>
       
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor : 'white',
    padding : 50,
    justifyContent : 'center',
    alignContent : 'center',
    top: '5%',
    
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
  },
  BG: {
    flex: 1,
    backgroundColor : 'white',
    
  },
  image: {
    width: 250,
    height: 250,
    left : '15%',
    resizeMode: 'cover',
    top: '40%',
  },
  image1: {
    width: 235,
    height: 80,
    left: 80,
    resizeMode: 'cover',
    top: 130,
    backgroundColor : 'black',
  },
  backButton1: {
    position: 'absolute',
    bottom: 0, 
    left: 10,
    zIndex: 1,
    borderRadius: 10,
    padding: 10,
  },
image2: {
    width: 200,
    height:50,
    position: 'absolute',
    right: 0, 
    bottom: 0, 
    resizeMode: 'cover',

},
  text1: {
    color: '#FF6666',
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 120,
    textAlign: 'center',
  }
  
  
});
export default Driver1