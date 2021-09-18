import React, { useState, useReducer, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, NativeModules, NativeEventEmitter, StatusBar, ScrollView, Button, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const Connection = ({route, navigation}) => {
    
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
  
  
    const startScan = () => {
      if (!isScanning) {
        BleManager.scan([], 3, true).then((results) => {
          console.log('Scanning...');
          setIsScanning(true);
        }).catch(err => {
          console.error(err);
        });
      }    
    }
  
    const enableBluetooth = () => {
        BleManager.enableBluetooth()
            .then(() => {
                // Success code
                console.log("The bluetooth is already enabled or the user confirm");
            })
            .catch((error) => {
                // Failure code
                console.log("The user refuse to enable bluetooth");
            }); 
    }

    const handleStopScan = () => {
      console.log('Scan is stopped');
      setIsScanning(false);
    }
  
    const handleDisconnectedPeripheral = (data) => {
      let peripheral = peripherals.get(data.peripheral);
      if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
      console.log('Disconnected from ' + data.peripheral);
    }
  
    const handleUpdateValueForCharacteristic = (data) => {
      console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }
  
    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then((results) => {
        if (results.length == 0) {
          console.log('No connected peripherals')
        }
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
      });
    }
  
    const handleDiscoverPeripheral = (peripheral) => {
      console.log('Got ble peripheral', peripheral);
      if (!peripheral.name) {
        peripheral.name = 'NO NAME';
      }
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  
    const testPeripheral = (peripheral) => {
      if (peripheral){
        if (peripheral.connected){
          BleManager.disconnect(peripheral.id);
        }else{
          BleManager.connect(peripheral.id).then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);
  
  
            setTimeout(() => {
  
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                console.log('Retrieved peripheral services', peripheralData);
  
                BleManager.readRSSI(peripheral.id).then((rssi) => {
                  console.log('Retrieved actual RSSI value', rssi);
                  let p = peripherals.get(peripheral.id);
                  if (p) {
                    p.rssi = rssi;
                    peripherals.set(peripheral.id, p);
                    setList(Array.from(peripherals.values()));
                  }                
                });                                          
              });
  
              // Test using bleno's pizza example
              // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
              /*
              BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                console.log(peripheralInfo);
                var service = '13333333-3333-3333-3333-333333333337';
                var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
                var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
                setTimeout(() => {
                  BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                    console.log('Started notification on ' + peripheral.id);
                    setTimeout(() => {
                      BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                        console.log('Writed NORMAL crust');
                        BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                          console.log('Writed 351 temperature, the pizza should be BAKED');
                          
                          //var PizzaBakeResult = {
                          //  HALF_BAKED: 0,
                          //  BAKED:      1,
                          //  CRISPY:     2,
                          //  BURNT:      3,
                          //  ON_FIRE:    4
                          //};
                        });
                      });
                    }, 500);
                  }).catch((error) => {
                    console.log('Notification error', error);
                  });
                }, 200);
              });*/
  
              
  
            }, 900);
          }).catch((error) => {
            console.log('Connection error', error);
          });
        }
      }
  
    }
  
    useEffect(() => {
      BleManager.start({showAlert: false});
  
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
  
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
        });
      }  
      
      return (() => {
        console.log('unmount');
        bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
      })
    }, []);
  
    const renderItem = (item) => {
      const color = item.connected ? 'green' : '#fff';
      return (
        <TouchableHighlight onPress={() => testPeripheral(item) }>
          <View style={[styles.row, {backgroundColor: color}]}>
            <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
            <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
            <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              
                <View style={{margin: 10}}>
                    <Button 
                    title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                    onPress={() => startScan() } 
                    />            
                </View>

                <View style={{margin: 10}}>
                    <Button 
                    title={'Enable Bluetooth'}
                    onPress={() => enableBluetooth() } 
                    />            
                </View>
  
              <View style={{margin: 10}}>
                <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected() } />
              </View>
  
              {(list.length == 0) &&
                <View style={{flex:1, margin: 20}}>
                  <Text style={{textAlign: 'center'}}>No peripherals</Text>
                </View>
              }
            
            </View>              
          </ScrollView>
          <FlatList
              data={list}
              renderItem={({ item }) => renderItem(item) }
              keyExtractor={item => item.id}
            />              
        </SafeAreaView>
      </>
    );
  };
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
    saveModal: {
        bottom: '5%',
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
    
    saveModalView: {
        margin: 0,
        width: 300,
        height: 200,
        backgroundColor: "gray",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });
  
  