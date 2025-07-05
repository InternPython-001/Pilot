import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ComponentLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: "#FFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="selectTestType" options={{ headerShown: true, headerTitle: "Select Test Type" }} />
        <Stack.Screen name="weatherReport" options={{ headerShown: true, headerTitle: "Weather Report" }} />
        <Stack.Screen name="checklistscreen" options={{ headerShown: true, headerTitle: "Check list" }} />
        <Stack.Screen name="DSchecklistscreen" options={{ headerShown: true, headerTitle: "DS Check list" }} />
        <Stack.Screen name="checklistDetailsScreen" options={{ headerShown: true, headerTitle: "Pilot Report" }} />
        <Stack.Screen name="ImageUploader" options={{ headerShown: true, headerTitle: "Upload Image Before Flying" }} />
        <Stack.Screen name="AfterFlyingImageUploader" options={{ headerShown: true, headerTitle: "Upload Image After Flying" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}