import useApi from '@/constants/env';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import * as Progress from 'react-native-progress';

const AfterFlyingImageUploader: React.FC = () => {
    const { API_URL } = useApi();
    const params = useLocalSearchParams();
    const router = useRouter();
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const pilotInfo = JSON.parse(Array.isArray(params.pilotInfo) ? params.pilotInfo[0] : params.pilotInfo || '{}');
    const weatherReport = JSON.parse(Array.isArray(params.weatherReport) ? params.weatherReport[0] : params.weatherReport || '{}');
    const guidelines = JSON.parse(Array.isArray(params.guidelines) ? params.guidelines[0] : params.guidelines || '[]');
    const dschecklist = JSON.parse(Array.isArray(params.dsChecklist) ? params.dsChecklist[0] : params.dsChecklist || '[]');

    const username = Array.isArray(params.username) ? params.username[0] : params.username;
    const beforeFlyingImage = Array.isArray(params.beforeFlyingImage) ? params.beforeFlyingImage[0] : params.beforeFlyingImage;

    const [image, setImage] = useState<string | null>(null);
    const [afterFlyingImageName, setAfterFlyingImageName] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return;

        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const imageName = `after_flying_${Date.now()}.${fileType}`;

        const formData = new FormData();
        if (Platform.OS === 'web') {
            // Convert URI to blob for web
            const response = await fetch(image);
            const blob = await response.blob();

            const webFile = new File([blob], imageName, {
                type: `image/${fileType}`,
            });

            formData.append('file', webFile);
        } else {
            // Use native file object
            formData.append('file', {
                uri: image,
                name: imageName,
                type: `image/${fileType}`,
            } as any);
        }

        setUploading(true);
        setModalVisible(true);

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setAfterFlyingImageName(data.imageUrl);
                ToastAndroid.show('Image uploaded successfully', ToastAndroid.SHORT);
                setUploadSuccess(true);
                console.log('Image uploaded successfully');
            } else {
                console.log(`Upload failed: ${data.message}`);
                ToastAndroid.show(`Upload failed: ${data.message}`, ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            ToastAndroid.show('Upload failed', ToastAndroid.LONG);
        } finally {
            setTimeout(() => {
                setUploading(false);
                setModalVisible(false);
                setProgress(0);
            }, 1500);
        }
    };

    const handleFinalSubmit = async () => {
        if (!afterFlyingImageName) {
            ToastAndroid.show('Please upload an after flying image first', ToastAndroid.SHORT);
            return;
        }

        const payload = {
            username,
            pilotInfo,
            weatherReport,
            checklist: {
                beforeFlyingImage,
                afterFlyingImage: afterFlyingImageName,
                guidelines,
                dschecklist,
            },
        };

        try {
            const response = await fetch(`${API_URL}/api/checklist/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                ToastAndroid.show('Checklist saved successfully!', ToastAndroid.LONG);

                if (data.downloadURL) {
                    await WebBrowser.openBrowserAsync(data.downloadURL); // Open PDF in browser or viewer
                }
                // ✅ Navigate after download starts
                router.push('/(tabs)');
            } else {
                ToastAndroid.show(`Failed: ${data.message || 'Unknown error'}`, ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            ToastAndroid.show('Submission failed. Check network.', ToastAndroid.LONG);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload After-Flying Image</Text>

            <View style={styles.card}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}
                {!uploadSuccess && (
                    <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                        <Text style={styles.buttonText}>Choose Image</Text>
                    </TouchableOpacity>
                )}

                {image && !uploadSuccess && (
                    <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                        <Text style={styles.buttonText}>Upload</Text>
                    </TouchableOpacity>
                )}

                {afterFlyingImageName && (
                    <TouchableOpacity style={styles.submitButton} onPress={handleFinalSubmit}>
                        <Text style={styles.buttonText}>Submit Checklist</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Uploading...</Text>
                        <Progress.Bar
                            progress={progress}
                            width={200}
                            color="#1E90FF"
                            borderRadius={6}
                            animated
                        />
                        <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AfterFlyingImageUploader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f6ff',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    placeholder: {
        height: 350,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#cce0f9',
        backgroundColor: '#f8faff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    placeholderText: {
        color: '#a0bcd9',
        fontSize: 16,
    },
    preview: {
        height: 350,
        borderRadius: 12,
        width: '100%',
        marginBottom: 15,
    },
    pickButton: {
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    uploadButton: {
        backgroundColor: '#005EB8',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#00B894',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: '#333',
    },
    progressLabel: {
        marginTop: 10,
        fontSize: 14,
        color: '#555',
    },
});