import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


export const Presets = () => {

    const [dataKeys, setDataKeys] = useState(['']);

    useEffect(() => {
        const asyncKeys = AsyncStorage.getAllKeys().then((res) => {
            setDataKeys(res);
        })
    }, []);
    

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#282828' }}>
        <FlatList
        data={dataKeys}
        renderItem={({item}) => (<Text style={styles.item}>{item}</Text>)}
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