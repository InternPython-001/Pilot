import { Colors } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ChecklistItem = {
  id: number;
  task: string;
  checked?: boolean;
};

export default function DSchecklistscreen() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loadChecklist = () => {
      const jsonData = require('@/assets/ds_checklist.json');
      const items = jsonData.map((item: ChecklistItem) => ({
        ...item,
        checked: false,
      }));
      setChecklist(items);
    };

    loadChecklist();
  }, []);

  const toggleCheck = (index: number) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    setChecklist(updated);
  };

  const showDescription = (description: string) => {
    Alert.alert('Checklist Info', description);
  };

  const handleNext = () => {
    const checkedItems = checklist
    .filter((item) => item.checked)
    .map((item) => item.task);

    router.push({
      pathname: '/(components)/AfterFlyingImageUploader',
      params: {
        pilotInfo: params.pilotInfo,
        username: params.username,
        beforeFlyingImage: params.beforeFlyingImage,
        dsChecklist: JSON.stringify(checkedItems),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dynamic Stand Checklist</Text>
      {checklist.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => toggleCheck(index)}
            onLongPress={() => showDescription(item.task)}
          >
            <Text style={styles.label}>{item.task}</Text>
          </TouchableOpacity>
          <Checkbox
            value={item.checked}
            onValueChange={() => toggleCheck(index)}
            color={item.checked ? Colors.primary : undefined}
            style={styles.checkbox}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View>
        <Text style={{ textAlign: 'center', color: '#ddd' }}>Powered by VAANFLY</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    marginBottom: 90,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
