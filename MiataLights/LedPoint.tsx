import React from 'react'
import {GestureResponderEvent, TouchableOpacity} from 'react-native'

interface Props {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    top: number;
    left: number;
    pressed: number;
}

const LedPoint: React.FC<Props> = ({onPress, top, left, pressed}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={.1} 
    style={[{
        height: 7, 
        width: 7,
        borderRadius: 5,
        backgroundColor: 'rgba(255,0,0,0.3)',
        position: 'absolute',
        top: top,
        left: left
        },
        pressed ? { backgroundColor: 'rgba(255,0,0,1)'} : {}
    ]} />
)

export default LedPoint