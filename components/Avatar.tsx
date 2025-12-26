import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
    uri?: string | null;
    name?: string | null;
    size?: number;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 48, className }) => {
    const initials = useMemo(() => {
        if (!name) return '';
        const words = name.trim().split(/\s+/);
        if (words.length === 0) return '';
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }, [name]);

    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageError(false);
    }, [uri]);

    const hasImage = uri && uri.trim() !== '';

    if (hasImage && !imageError) {
        return (
            <Image
                source={{ uri: uri! }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
                className={className}
                contentFit="cover"
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: '#72C69B', // Primary color
                alignItems: 'center',
                justifyContent: 'center',
            }}
            className={className}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: size * 0.4,
                    fontWeight: 'bold',
                }}
            >
                {initials}
            </Text>
        </View>
    );
};

export default Avatar;
