import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import { NavigationContainer, NavigationHelpersContext, NavigationRouteContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SingleState } from '../SingleState/SingleState';

export const Presets = ({ navigation }) => {

    const [dataKeys, setDataKeys] = useState(['']);

    useEffect(() => {
        const asyncKeys = AsyncStorage.getAllKeys().then((res) => {
            setDataKeys(res);
        })
    }, []);
    


    const getData = async (name: string) => {
        try {
            const value = await AsyncStorage.getItem(name);
            if(value !== null) {
               return value;
            }
          } catch(e) {
            console.error(e);
          }
    }

    let renderItem = (styles : StyleProp<ViewStyle> , name:string) => {
        return (
          <TouchableOpacity
            style={styles}
            onPress={() => navigate(name)}
          >
            <View>
              <Text style={styles}>{name}</Text>
            </View>
          </TouchableOpacity>
        );
    }
    
    let navigate = async (item : string) => {
        let storedData = await getData(item)
        if (typeof storedData !== 'undefined') {
            storedData = JSON.parse(storedData)
            navigation.navigate(storedData[0], { data: storedData[1], savedName: item })
        } else {
            return false;
        }
    }


  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#282828' }}>
        <FlatList
            data={dataKeys}
            renderItem={({item}) => renderItem(styles.item,item)}
            keyExtractor={(item) => item}
        />
      <Text style={styles.textWhite}>Presets should be shown here</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    textWhite: {
        color: 'white'
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      color: 'red'
    },
});
