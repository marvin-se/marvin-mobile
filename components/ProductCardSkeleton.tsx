import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const ProductCardSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className='w-[48%] mb-4'>
            <View className='relative'>
                <Animated.View
                    style={[{ width: '100%', height: 200, borderRadius: 16, backgroundColor: '#E5E7EB' }, animatedStyle]}
                />
                <View className='absolute top-3 right-3 bg-white/90 p-2 rounded-full'>
                    <Animated.View
                        style={[{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#D1D5DB' }, animatedStyle]}
                    />
                </View>
            </View>

            <View className="p-3">
                <Animated.View
                    style={[{ height: 20, width: '80%', backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 8 }, animatedStyle]}
                />
                <Animated.View
                    style={[{ height: 24, width: '40%', backgroundColor: '#E5E7EB', borderRadius: 4 }, animatedStyle]}
                />
            </View>
        </View>
    );
};

export default ProductCardSkeleton;
