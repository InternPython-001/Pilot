import React, { useState } from 'react';
import {
  ToastAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const router = useRouter();

  const [pilotName, setPilotName] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [trialId, setTrialId] = useState<string>('');
  const [testCase, setTestCase] = useState<string>('');

  const showPicker = () => setShowDatePicker(true);

  const onDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleContinue = async () => {
    const formData = {
      pilotName,
      date: date.toISOString().split('T')[0],
      trialId,
      testCase,
    };

    if (!formData) {
      ToastAndroid.show('Please enter All the fields', ToastAndroid.SHORT);
      return;
    }

    try {
      await AsyncStorage.setItem('pilotInfo', JSON.stringify(formData));
      // console.log('Saved to storage:', formData);
      // Alert.alert('Form Submitted', JSON.stringify(formData, null, 2));

      router.push({
        pathname: "/(components)/selectTestType",
        params: {
          pilotInfo: JSON.stringify(formData),
        },
      });
    } catch (err) {
      ToastAndroid.show('Error saving to AsyncStorage', ToastAndroid.SHORT);
      // Alert.alert('Storage Error', 'Could not save pilot info');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>VAANFLY Pilot Assist</Text>
        </View> */}

        {/* Form */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.title}>Flight Test Entry</Text>
            <Text style={styles.description}>
              Enter the basic flight test information below before proceeding.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Pilot Name"
              value={pilotName}
              onChangeText={setPilotName}
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />

            <TouchableOpacity onPress={showPicker} style={styles.input}>
              <Text style={{ color: '#000' }}>
                {date ? date.toISOString().split('T')[0] : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Trial ID"
              value={trialId}
              onChangeText={setTrialId}
              placeholderTextColor="#888"
              cursorColor={Colors.primary}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Test Case Done or Not"
              value={testCase}
              onChangeText={setTestCase}
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              cursorColor={Colors.primary}
            />

            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: '#F9FAFB',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
    // alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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

})