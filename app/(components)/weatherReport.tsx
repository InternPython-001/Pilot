import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import {
  ToastAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

const WEATHER_API_KEY = '2820de08909b4771b8960833251106';

export default function weatherReport() {
  const router = useRouter();
  const { pilotInfo,  } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [temperature, setTemperature] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [humidity, setHumidity] = useState('');
  const [wind, setWind] = useState('');
  const [parsedPilotInfo, setParsedPilotInfo] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      if (pilotInfo) {
        const parsed = JSON.parse(pilotInfo as string);
        setParsedPilotInfo(parsed);
        await AsyncStorage.setItem('pilotInfo', JSON.stringify(parsed));
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      fetchWeatherData(latitude, longitude);
    };

    init();
  }, [pilotInfo]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`
      );
      const json = await response.json();
      const data = json.current;

      setTemperature(data.temp_c.toString());
      setHumidity(data.humidity.toString());
      setWind(data.wind_kph.toString());
      setPrecipitation(data.precip_mm.toString());
    } catch (error) {
      ToastAndroid.show('Failed to fetch weather', ToastAndroid.SHORT);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    const weatherData = {
      temperature,
      precipitation,
      humidity,
      wind,
    };

    if (!weatherData) {
      ToastAndroid.show('Please enter All the fields', ToastAndroid.SHORT);
      return;
    }

    try {
      await AsyncStorage.setItem('weatherReport', JSON.stringify(weatherData));
      console.log('Weather data saved:', weatherData);

      const allData = {
        pilotInfo: parsedPilotInfo,
        weatherReport: weatherData,
        username: parsedPilotInfo?.pilotName || 'anonymous',
      };

      router.push({
        pathname: '/(components)/ImageUploader',
        params: {
          pilotInfo: JSON.stringify(allData.pilotInfo),
          weatherReport: JSON.stringify(allData.weatherReport),
          username: allData.username,
          testType: allData.pilotInfo?.testType ?? '',
        },
      });

      // ToastAndroid.show('Data Submitted', ToastAndroid.SHORT);
    } catch (err) {
      ToastAndroid.show('Failed to save weather data', ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.title}>Weather Report</Text>
            <Text style={styles.description}>
              Enter the environmental conditions observed during the test.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Temperature (°C)"
              value={temperature}
              onChangeText={setTemperature}
              keyboardType="numeric"
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />

            <TextInput
              style={styles.input}
              placeholder="Precipitation (mm)"
              value={precipitation}
              onChangeText={setPrecipitation}
              keyboardType="numeric"
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />

            <TextInput
              style={styles.input}
              placeholder="Humidity (%)"
              value={humidity}
              onChangeText={setHumidity}
              keyboardType="numeric"
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />

            <TextInput
              style={styles.input}
              placeholder="Wind (km/h)"
              value={wind}
              onChangeText={setWind}
              keyboardType="numeric"
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />
            {isLoading && (
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: '#555' }}>Fetching weather data...</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.6 }]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Footer */}
          <Text style={styles.footer}>Powered by VAANFLY</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 20,
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})