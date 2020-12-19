import React, { useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LedPoint from "./LedPoint";

export const SingleState = () => {
  const [state, setState] = useState({ pressed: 0});
  function save() {
    alert("This will be save to presets function someday");
  }
  
  function undo() {
    alert("This will be undo someday");
  }

  
  function _onPress() {
    state.pressed ? setState(prevState => { return { ...prevState, pressed:0 }}) : setState(prevState => { return { ...prevState, pressed: 1}});
    
    console.log("Clicked point");
  }
  
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#282828' }}>
         <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={200}
                       imageHeight={200}>
            <Image 
                style={styles.lamp}
                source={require('./assets/Lamp.png')}
                />
            <LedPoint onPress={_onPress} top={100} left={100} pressed={state.pressed} />
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
  
  