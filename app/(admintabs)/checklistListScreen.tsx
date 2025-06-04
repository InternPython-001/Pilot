import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

interface PilotInfo {
    date?: string;
    pilotName?: string; // add pilot name
    // add more pilot info fields if needed
}

interface ChecklistEntry {
    pilotInfo?: PilotInfo;
    weatherReport?: object;
    checklist?: any[];
}

type ChecklistData = Record<string, ChecklistEntry[]>;

export default function ChecklistListScreen() {
    const [checklists, setChecklists] = useState<ChecklistData>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllChecklists = async () => {
            try {
                const response = await fetch("https://appsail-50027943202.development.catalystappsail.in/api/checklist/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch checklist data");
                }
                const data: ChecklistData = await response.json();
                setChecklists(data);
            } catch (err) {
                console.error("Error fetching checklist data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllChecklists();
    }, []);

    const renderItem = ({
        item,
    }: {
        item: [string, ChecklistEntry[]]; // tuple: [username, entries]
    }) => {
        const [username, entries] = item;
        return (
            <View style={styles.userSection}>
                <Text style={styles.username}>Daily report</Text>
                {entries
                    .slice()
                    .sort((a, b) => {
                        const dateA = new Date(a.pilotInfo?.date || "").getTime();
                        const dateB = new Date(b.pilotInfo?.date || "").getTime();
                        return dateB - dateA; // Descending
                    })
                    .map((entry: ChecklistEntry, index: number) => {
                        const pilotName = entry.pilotInfo?.pilotName || "Unknown Pilot";
                        const date = entry.pilotInfo?.date || `Entry ${entries.length - index}`;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.entryCard}
                                onPress={() =>
                                    router.push({
                                        pathname: "/(components)/ChecklistDetailsScreen",
                                        params: { username, index: index.toString() },
                                    })
                                }
                                activeOpacity={0.8}
                            >
                                <View style={styles.entryHeader}>
                                    <Text style={styles.pilotName}>{pilotName}</Text>
                                    <Text style={styles.entryDate}>{date}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
            </View>
        );
    };

    if (loading)
        return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />;

    return (
        <FlatList
            data={Object.entries(checklists)}
            keyExtractor={([username]) => username}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    userSection: {
        marginBottom: 24,
    },
    username: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },
    entryCard: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // Elevation for Android
        elevation: 4,
    },
    entryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pilotName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    entryDate: {
        fontSize: 14,
        color: "#666",
    },
});