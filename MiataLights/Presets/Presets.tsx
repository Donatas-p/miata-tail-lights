import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
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
    

    let renderItem = (styles, name:string) => {
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
    
    let navigate = (item : string) => {
        navigation.navigate(SingleState, { storageKey: item })
        console.log(item);
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
