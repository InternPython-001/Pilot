import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type IconName = keyof typeof MaterialIcons.glyphMap;

const categoryList = [
  // { id: 0, icon: "folder-shared" as IconName, title: "Tell Your Friend" },
  { id: 0, icon: "settings" as IconName, title: "Settings" },
];

type DecodedToken = {
  id: number;
  username: string;
  role: string;
  exp: number;
};

export default function ProfileScreen() {
  const [username, setUsername] = useState<string | null>(null);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateAvatarUrl = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const backgroundColor = getRandomColor();
    const imageSize = 130;
    return `https://ui-avatars.com/api/?background=${backgroundColor}&size=${imageSize}&color=FFF&font-size=0.60&name=${firstLetter}`;
  };

  const loadUserFromToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUsername(decoded.username);

        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/(auth)");
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      {/* Profile section */}
      <View style={{ alignItems: "center", gap: 20 }}>
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: generateAvatarUrl(username || "U"),
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 99,
              objectFit: "contain",
            }}
          />
          {/* <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: Colors.primary,
              borderRadius: 99,
              padding: 5,
            }}
          >
            <MaterialIcons name="mode-edit" size={24} color="white" />
          </TouchableOpacity> */}
        </View>
        <Text style={{ fontSize: 18 }}>
          {username || "User"}
        </Text>
      </View>

      {/* Feature list */}
      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "This feature is under development."
              )
            }
            style={styles.listItem}
          >
            <View style={styles.iconTextContainer}>
              <View style={styles.iconBox}>
                <MaterialIcons name={item.icon} size={25} color={Colors.primary} />
              </View>
              <Text style={{ fontSize: 20 }}>
                {item.title}
              </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      />

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 35 }}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconBox}>
            <MaterialIcons name="logout" size={24} color="red" />
          </View>
          <Text style={{ fontSize: 20 }}>Log out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconBox: {
    padding: 9,
    backgroundColor: Colors.iconBg,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
});
