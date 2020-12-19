import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SingleState } from './SingleState';
import { Animation } from './Animation';
import { Presets } from './Presets';

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen({ navigation }) {

  const [state, setState] = useState({ text: "This miata light app thing"});

  const text = state.text;
  
  function changeText(string: string) {
    console.log(string);
    setState(prevState => { return { ...prevState, text: string}});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>{text}</Text>
      <AppButton title="Single state" 
              onPress={() => navigation.navigate(SingleState)} />
              
      <AppButton title="Animation" 
              onPress={() => navigation.navigate(Animation)} />
              
      <AppButton title="Presets" 
              onPress={() => navigation.navigate(Presets)} />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();
console.log("App executed");
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} 
          options={{ 
            title: 'Options',
            headerStyle: {
              backgroundColor: '#282828',
            },
            headerTintColor: '#cc241d',
            headerTitleStyle: {
              fontWeight: '100',
            }
          }} />
        <Stack.Screen name="SingleState" component={SingleState} 
                  options={{ 
                    headerStyle: {
                      backgroundColor: '#282828',
                    },
                    headerTintColor: '#cc241d',
                    headerTitleStyle: {
                      fontWeight: '100',
                    }
                  }}/>
        <Stack.Screen name="Animation" component={Animation} />
        <Stack.Screen name="Presets" component={Presets} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#504945',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'top',
    minHeight: "100%"
  },
  h1: {
    fontSize: 25,
    color: '#cc241d'
  },
  appButtonContainer: {
      elevation: 20,
      backgroundColor: "#fb4934",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      margin: 10
  },
  appButtonText: {
      fontSize: 18,
      color: "#504945",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
  }
});



export default App;