import React, { useState, useReducer } from 'react';

import { createUndoRedo } from "react-undo-redo";
import { SafeAreaView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LedPoint from "./LedPoint";

type LedState = {
    leds: number[][],
    history: Array<number>
}

type reducerAction = {
    index?: number,
    type: string
}

function reducer(state: LedState, action: reducerAction) {
    switch (action.type) {
        case "click":
            console.log(state);
            if (typeof action.index !== 'undefined') {
                let index = action.index;
                let singleLed = state.leds[index];
                if (singleLed[2] == 0) {
                    singleLed[2] = 1;
                } else {
                    singleLed[2] = 0;
                }
                state.leds[index] = singleLed;
                state.history.push(index);
            }
            return {
                leds: [...state.leds],
                history: [...state.history]
            };
        case "reset":
            return {
                leds: generateLedArray(),
                history: []
            }
        case "undo":
            let undoLed = state.history.pop()
            if (typeof(undoLed) !== 'undefined') {
                let undidLed = state.leds[undoLed]
                if (undidLed[2] == 0) {
                    undidLed[2] = 1;
                } else {
                    undidLed[2] = 0;
                }
                state.leds[undoLed] = undidLed;
            }
            return {
                leds: [...state.leds],
                history: [...state.history]
            };
        default:
            return state;
    }
}

let generateLedArray = () => {
    var ledAmount= {
        length: 28,
        height: 10
    }
    var ledArray = [];
    for (var i = 0; i < ledAmount.height; i++ ) {
        for (var j = 0; j < ledAmount.length; j++) {
            ledArray.push([i*10+100, j*10+10, 0])
        }
    }
    return ledArray
    
}

const initialLedState = { ledState : generateLedArray() };

export const SingleState = () => {

    const [ { leds, history }, dispatch] = useReducer(reducer, { leds: generateLedArray(), history: []} )

    function save() {
        alert("This will be save to presets function someday")
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
                {leds.map((item: Array<number>, index: number) => (
                  <LedPoint key={index} onPress={() => dispatch({ index: index, type: 'click'})} top={item[0]} left={item[1]} pressed={item[2]} />
                ))}
          </ImageZoom>
        <TouchableOpacity onPress={() => dispatch({type: 'reset'})} style={[styles.appButtonContainer, styles.reset]}>
          <Text style={styles.appButtonText}>{"Reset"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({type: 'undo'})} style={[styles.appButtonContainer, styles.undo]}>
          <Text style={styles.appButtonText}>{"Undo"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={[styles.appButtonContainer, styles.save]}>
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
  
  