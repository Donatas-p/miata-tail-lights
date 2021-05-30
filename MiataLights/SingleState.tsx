import React, { useState, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity, Modal } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LedPoint from "./LedPoint";
import { ColorPicker } from 'react-native-color-picker';

type LedState = {
    leds: Array<Array<any>>,
    history: Array<number>
}
  
type reducerAction = {
    index?: number,
    color?: any,
    type: string
}

function reducer(state: LedState, action: reducerAction) {
    switch (action.type) {
        case "click":
            if (typeof action.index !== 'undefined') {
                let index = action.index;
                let singleLed = state.leds[index];
                let {r,g,b} = hexToRGB(action.color);
                singleLed[3] = {r:r,g:g,b:b};
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
            ledArray.push([i*10+100, j*10+10, 0, { r:255,g:0,b:0}])
        }
    }
    return ledArray
    
}

let hexToRGB = (hex : any) => {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
        r: parseInt(m[1], 16), 
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)     
    };
}

const storeData = async (value: Object) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
        console.error(e);
    }
}

export const SingleState = () => {

    const [ { leds, history }, dispatch] = useReducer(reducer, { leds: generateLedArray(), history: []} )
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerColor, setPickerColor] = useState('#ff0000');
    
    function save() {
        storeData(leds)
        alert("This will be save to presets function someday")
    }
    console.log(leds);
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
                {leds.map((item: Array<any>, index: number) => (
                  <LedPoint 
                    key={index} 
                    onPress={() => dispatch({ index: index, color: pickerColor ,type: 'click'})} 
                    top={item[0]} 
                    left={item[1]} 
                    pressed={item[2]}
                    r={item[3].r}
                    g={item[3].g}
                    b={item[3].b} />
                ))}
          </ImageZoom>
        <TouchableOpacity onPress={() => dispatch({type: 'reset'})} style={[styles.appButtonContainer, styles.reset]}>
          <Text style={styles.appButtonText}>{"Reset"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({type: 'undo'})} style={[styles.appButtonContainer, styles.undo]}>
          <Text style={styles.appButtonText}>{`Undo`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={[styles.appButtonContainer, styles.save]}>
          <Text style={styles.appButtonText}>{"Save"}</Text>
        </TouchableOpacity>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ColorPicker
                        onColorSelected={color => {setPickerColor(color), setModalVisible(!modalVisible)}}
                        style={{width: '100%', height: '100%'}}
                        oldColor={pickerColor}
                    />
                </View>
            </View>
        </Modal>
      
      <TouchableOpacity
        style={[styles.button, styles.buttonColor]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Pick color</Text>
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
        backgroundColor: "#fb4934",
        paddingVertical: 10,
        paddingHorizontal: 0,
        margin: 0,
        padding: 10,
        elevation: 2
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
        padding: 10,
        color: "white",
        fontWeight: "bold",
        alignSelf: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10,
        width:'100%',
        height: '90%',
        backgroundColor: "black",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonColor: {
        position: 'absolute',
        top: '0%',
        width: 80,
        height: 40,
        borderRadius: 0,
        elevation: 0,
        paddingVertical: 10,
        paddingHorizontal: 0,
        margin: 0,
        right: '40%',
        backgroundColor: "#fb4934",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
  
  