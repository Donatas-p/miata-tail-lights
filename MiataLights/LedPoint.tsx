import React from 'react'
import {GestureResponderEvent, TouchableOpacity} from 'react-native'

interface Props {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    top: number;
    left: number;
    pressed: number;
    r: number;
    g: number;
    b: number;
}

const LedPoint: React.FC<Props> = ({onPress, top, left, pressed, r, g, b}) => (
    <TouchableOpacity onPress={onPress} activeOpacity={.1} 
    style={[{
        height: 7, 
        width: 7,
        borderRadius: 5,
        backgroundColor: `rgba(${r},${g},${b},0.25)`,
        position: 'absolute',
        top: top,
        left: left
        },
        pressed ? { backgroundColor: `rgba(${r},${g},${b},1)`} : {}
    ]} />
)

export default LedPoint