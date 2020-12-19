import React, { useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export const SingleState = () => {

  function save() {
    alert("This will be save to presets function someday");
  }
  
  function undo() {
    alert("This will be undo someday");
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={200}
                       imageHeight={200}>
            <Image 
                style={styles.lamp}
                source={require('./assets/Lamp.png')}
                />
        </ImageZoom>
        <TouchableOpacity onPress={save} style={[styles.appButtonContainer, styles.undo]}>
          <Text style={styles.appButtonText}>{"Undo"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={undo} style={[styles.appButtonContainer, styles.save]}>
          <Text style={styles.appButtonText}>{"Save"}</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    lamp: {
        flex: 1, 
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
        aspectRatio: 1,
    },
    appButtonContainer: {
        position: 'absolute',
        bottom: '0%',
        width: 80,
        height: 40,
        borderRadius: 0,
        elevation: 0,
        backgroundColor: "#fb4934",
        paddingVertical: 10,
        paddingHorizontal: 0,
        margin: 0
    },
    save: {
        right: '10%',
    },
    undo: {
        left: '10%',
    },
    appButtonText: {
        position: "absolute",
        fontSize: 18,
        color: "#504945",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
  });
  
  