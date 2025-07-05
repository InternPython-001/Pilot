import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "@/constants/env";

export default function index() {
  const { API_URL } = useApi();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setIsChecked(true);
        }
      } catch (error) {
        console.error('Failed to load credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const onSubmit = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please enter username and password', ToastAndroid.SHORT);
      return;
    }
    setSubmitting(true);
    try {
      // Save or clear remembered credentials
      if (isChecked) {
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
      }

      // Send login request to backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', result.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));

        // ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        if (result.user.role === 'user') {
          router.replace('/(tabs)');
        } else if (result.user.role === 'admin') {
          router.replace('/(admintabs)/checklistListScreen');
        }
      } else {
        // ToastAndroid.show(result.message || 'Login failed', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.error('Login error:', err);
      // ToastAndroid.show('Network error', ToastAndroid.SHORT);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: Colors.black,
            }}
          >
            Welcome to VAANFLY Pilot Assist
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Username
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor={Colors.black}
              value={email}
              onChangeText={setEmail}
              style={{
                width: "100%",
              }}
              cursorColor={Colors.primary}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Password
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: Colors.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={Colors.black}
              secureTextEntry={!isPasswordShown}
              style={{
                width: "100%",
                color: "#000"
              }}
              value={password}
              onChangeText={setPassword}
              cursorColor={Colors.primary}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={Colors.black} />
              ) : (
                <Ionicons name="eye" size={24} color={Colors.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? Colors.primary : undefined}
          />

          <Text>Remember Me</Text>
        </View>
        <View
          style={{
            paddingTop: 10 * 6,
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={[styles.button,]}
            onPress={onSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{submitting ? 'Login...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={{ textAlign: "center", color: '#ddd', position: 'relative', bottom: 0 }}>Powered by VAANFLY</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10 * 1.5,
    paddingHorizontal: 10 * 2,
    width: "100%",
    borderRadius: 10,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: Colors.iconBg,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  }
});