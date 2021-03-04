import React, { useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LedPoint from "./LedPoint";

const initialLedState = { ledState : [[121, 10, 0], [112, 20, 0], [105, 32, 0], [101, 46, 0], [98, 60, 0], [94, 76, 0], [92, 90, 0], [91, 105, 0]]};
export const SingleState = () => {
  let ledState = JSON.parse(JSON.stringify(initialLedState));
  const [state, setState] = useState(ledState);
  function save() {
    alert("This will be save to presets function someday");
  }
  
  function undo() {
    alert("This will be undo someday");
  }

  
  function _onPress(index: number) {
    const newLedState = [...state.ledState];
    
    const singularLedState = newLedState[index];
    if (singularLedState[2] == 0) {
      singularLedState[2] = 1;
    } else {
      singularLedState[2] = 0;
    }
    newLedState[index] = singularLedState;
    setState(prevState => { return { ...prevState, newLedState}});
    console.log("Clicked point");
  }

  function resetArray() {
    console.log("clear");
    setState(JSON.parse(JSON.stringify(initialLedState)));
    console.log(initialLedState);
    
  }
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#282828' }}>
         <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={300}
                       imageHeight={300}>
            <Image 
                style={styles.lamp}
                source={require('./assets/Lamp.png')}
                />
                {state.ledState.map((item: Array<number>, index: number) => (
                  <LedPoint key={index} onPress={() => _onPress(index)} top={item[0]} left={item[1]} pressed={item[2]} />
                ))}
          </ImageZoom>
        <TouchableOpacity onPress={resetArray} style={[styles.appButtonContainer, styles.reset]}>
          <Text style={styles.appButtonText}>{"Reset"}</Text>
        </TouchableOpacity>
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
    reset: {
      alignSelf: 'center'
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
  
  