import React from 'react'
import {TouchableOpacity} from 'react-native'


const LedPoint = ({onPress, top, left, pressed}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={.1} 
    style={[{
        height: 10, 
        width: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,0,0,0.3)',
        position: 'absolute',
        top,
        left
        },
        pressed ? { backgroundColor: 'rgba(255,0,0,1)'} : {}
    ]} />
)

export default LedPoint