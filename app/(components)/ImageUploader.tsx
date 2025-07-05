import useApi from '@/constants/env';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const ImageUploader: React.FC = () => {
    const { API_URL } = useApi();
    const params = useLocalSearchParams();
    const router = useRouter();
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [image, setImage] = useState<string | null>(null);
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

        try {
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1] || 'jpg';
            const imageName = `before_flying_${Date.now()}.${fileType}`;
            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(image);
                const blob = await response.blob();

                const webFile = new File([blob], imageName, {
                    type: `image/${fileType}`,
                });

                formData.append('file', webFile);
            } else {
                formData.append('file', {
                    uri: image,
                    name: imageName,
                    type: `image/${fileType}`,
                } as any);
            }

            setUploading(true);
            setModalVisible(true);

            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await uploadRes.json();

            if (uploadRes.ok && data.imageUrl) {
                const uploadedImageUrl = data.imageUrl;
                setProgress(1);
                ToastAndroid.show('Image uploaded successfully', ToastAndroid.SHORT);
                setUploadSuccess(true);

                setTimeout(() => {
                    const pilotInfo = params?.pilotInfo ? JSON.parse(params.pilotInfo as string) : {};
                    const testType = pilotInfo?.testType || '';
                    const isOpenAir = testType === 'OPEN AIR';

                    // Prepare the route & params
                    const targetPath = isOpenAir ? '/(components)/checklistscreen' : '/(components)/DSchecklistscreen' as const;

                    const nextParams: any = {
                        pilotInfo: params.pilotInfo,
                        username: params.username,
                        beforeFlyingImage: uploadedImageUrl,
                    };

                    if (isOpenAir) {
                        nextParams.weatherReport = params.weatherReport;
                    }

                    router.push({
                        pathname: targetPath as any,
                        params: nextParams,
                    });
                }, 1500);
            } else {
                console.error('Upload failed:', data.message || 'No imageUrl returned');
                ToastAndroid.show(`Upload failed: ${data.message || 'Server error'}`, ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            ToastAndroid.show('Image upload failed. Check connection.', ToastAndroid.LONG);
        } finally {
            setTimeout(() => {
                setUploading(false);
                setModalVisible(false);
                setProgress(0);
            }, 1500);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload Image</Text>

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
            {/* Footer */}
            <Text style={styles.footer}>Powered by VAANFLY</Text>
        </View>
    );
};

export default ImageUploader;

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
    footer: {
        textAlign: 'center',
        color: '#888',
        paddingVertical: 20,
        fontSize: 12,
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
        height: 250,
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
