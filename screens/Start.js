import { View, Text,Button ,StyleSheet,TouchableHighligh,Image} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import MyButton from './Mybutton';
import MyButton1 from './Mybutton1';

const Start = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.BG}>
      <View>
      <Image
          source={require('./image/logox2.png')} 
          style={styles.image1}
        />
        <Image
          source={require('./image/bus.png')} 
          style={styles.image}
        />
        
        <Text style = {styles.text1}>
          Welcome to StreamDrive
        </Text>
        </View>
      <View style={styles.container}>
      {/* <MyButton1
          title="ssss"
          onPress={() => navigation.navigate('Location')}
          backgroundColor="white"
        /> */}
        <MyButton
          title="Driver"
          onPress={() => navigation.navigate('Driver1')}
          backgroundColor="#FF6666"
        />
        <MyButton1
          title="User"
          onPress={() => navigation.navigate('Passenger')}
          backgroundColor="white"
        />
      </View>
      <Image
          source={require('./image/stream.png')} 
          style={styles.image2}
        />
    </View>
    
    
  )
}
const styles = StyleSheet.create({
  container: {
    padding : 50,
    justifyContent : 'center',
    alignContent : 'center',
    top: '27%',
    
  },
  BG: {
    flex: 1,
    backgroundColor : 'white',
    
  },
  image: {
    width: 250,
    height: 250,
    left: '17%',
    resizeMode: 'cover',
    top: '50%',
    position: 'absolute',
  },
  image1: {
    width: 235,
    height: 80,
    left: '17.5%',
    resizeMode: 'cover',
    top: '39%',
    backgroundColor : 'black',
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
    fontSize: 35,
    left : '18%',
    top: '118%',
    fontWeight: 'bold',
    
  }
  
});
export default Start