import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const selectTestType = () => {
    const router = useRouter();
    const { pilotInfo } = useLocalSearchParams();
    const parsedPilotInfo = pilotInfo ? JSON.parse(pilotInfo as string) : {};

    const handleTestTypeSelect = (testType: string) => {
        const targetPath =
            testType === 'OPEN AIR'
                ? '/(components)/weatherReport'
                : '/(components)/ImageUploader';

        router.push({
            pathname: targetPath,
            params: {
                pilotInfo: JSON.stringify({
                    ...parsedPilotInfo,
                    testType,
                }),
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* Open Air Button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleTestTypeSelect('OPEN AIR')}>
                <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.gradientBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.buttonContent}>
                        <MaterialIcons name="outdoor-grill" size={40} color="white" />
                        <Text style={styles.buttonText}>OPEN AIR</Text>
                        <Text style={styles.subText}>Open-air piloting & safety guidelines</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* Dynamic Stand Button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleTestTypeSelect('DYNAMIC STAND')}>
                <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.gradientBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.buttonContent}>
                        <MaterialIcons name="dynamic-feed" size={40} color="white" />
                        <Text style={styles.buttonText}>DYNAMIC STAND</Text>
                        <Text style={styles.subText}>Indoor calibration & stability tests</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    buttonContainer: {
        width: width - 40,
        height: 180,
        borderRadius: 20,
        marginVertical: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        overflow: 'hidden',
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonContent: {
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: '800',
        marginTop: 15,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 8,
        opacity: 0.9,
    },
});

export default selectTestType;