import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity, GestureResponderEvent} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { SingleState } from './SingleState/SingleState';
import { NormalMode } from './NormalMode/NormalMode';
import { Connection } from './Bluetooth/Connection';
import { Animation } from './Animation';
import { Presets } from './Presets/Presets';

const Stack = createStackNavigator();

type Props = {
    onPress: (event: GestureResponderEvent) => void,
    title: string
}

const AppButton = ({ onPress , title } : Props) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen({ navigation }) {

  return (
    <SafeAreaView style={styles.container}>
      <AppButton title="Normal Mode" 
            onPress={() => navigation.navigate(NormalMode)} />

      <AppButton title="Single state" 
              onPress={() => navigation.navigate(SingleState)} />
              
      <AppButton title="Animation" 
              onPress={() => navigation.navigate(Animation)} />
              
      <AppButton title="Presets" 
              onPress={() => navigation.navigate(Presets)} />
              
      <AppButton title="Connect" 
              onPress={() => navigation.navigate(Connection)} />


      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

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
        <Stack.Screen name="NormalMode" component={NormalMode}
        options={{ 
            title: 'Lights',
            headerStyle: {
              backgroundColor: '#282828',
            },
            headerTintColor: '#cc241d',
            headerTitleStyle: {
              fontWeight: '100',
            }
          }} />
        <Stack.Screen name="Animation" component={Animation} />
        <Stack.Screen name="Presets" component={Presets}
            options={{ 
                headerStyle: {
                backgroundColor: '#282828',
                },
                headerTintColor: '#cc241d',
                headerTitleStyle: {
                fontWeight: '100',
                }
            }} />
        <Stack.Screen name="Connection" component={Connection}
            options={{ 
                title: 'Connection',
                headerStyle: {
                  backgroundColor: '#282828',
                },
                headerTintColor: '#cc241d',
                headerTitleStyle: {
                  fontWeight: '100',
                }
              }} />
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
      backgroundColor: "#504945",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      margin: 10
  },
  appButtonText: {
      fontSize: 18,
      color: "#fb4934",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
  }
});



export default App;