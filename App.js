import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Location from './screens/Location';
import Post from './screens/Post';
import Get from './screens/Get';
import Time from './screens/Sitecustomer';
import Driver from './screens/Driver';
import Passenger from './screens/Passenger';
import Start from './screens/Start';
import Busline from './screens/Busline';
import Busstop from './screens/Busstop';
import Routestop from './screens/Routestop';
import Bus from './screens/Bus';
import Sitecustomer from './screens/Sitecustomer';
import Test from './screens/Test';
import Postdata1 from './screens/Postdata1';
import Deliverly from './screens/Deliverly';
import Driver1 from './screens/Driver1';
import Driver2 from './screens/Driver2';
import Startstop from './screens/Startstop';
import Deliverly2 from './screens/Deliverly2';
import Deliverlyroute from './screens/Deliverlyroute';
import Routestop2 from './screens/Routestop2';
import Startstop2 from './screens/Startstop2';
import Deliverly3 from './screens/Deliverly3';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Start"
          component={Start}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Driver"
          component={Driver}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{title : 'Go to Location'}}
        />
        <Stack.Screen
          name="Routestop"
          component={Routestop}
          options={{headerShown: false}}
          
        />
        <Stack.Screen
          name="Routestop2"
          component={Routestop2}
          options={{headerShown: false}}
          
        />
        <Stack.Screen
          name="Startstop"
          component={Startstop}
          options={{headerShown: false}}
          
        />
        <Stack.Screen
          name="Startstop2"
          component={Startstop2}
          options={{headerShown: false}}
          
        />
        <Stack.Screen
          name="Busstop"
          component={Busstop}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Passenger"
          component={Passenger}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Busline"
          component={Busline}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Bus"
          component={Bus}
          options={{title : 'Bus'}}
        />
        <Stack.Screen
          name="Datadriver"
          component={Location}
          options={{title : 'Send Data Driver'}}
        />
        <Stack.Screen
          name="Postdata"
          component={Post}
        />
        <Stack.Screen
          name="Sitecustomer"
          component={Sitecustomer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deliverlyroute"
          component={Deliverlyroute} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Test"
          component={Test} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Driver2"
          component={Driver2} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Postdata1"
          component={Postdata1} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deliverly"
          component={Deliverly} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deliverly2"
          component={Deliverly2} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Deliverly3"
          component={Deliverly3} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Driver1"
          component={Driver1} 
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
    
  )
}

export default App