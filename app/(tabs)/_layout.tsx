import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: "#FFF",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.text,
                // headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    headerShown: true,
                    headerTitle: "VAANFLY Pilot Assist",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
        </Tabs>
    );
}