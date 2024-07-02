import { View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '../../Utils/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AddScreen() {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const SelectVideoFile = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      GenerateVideoThumbnail(result.assets[0].uri);
    }
  };

  // Generate Thumbnail from Video
  const GenerateVideoThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 15000,
      });
      //console.log('Thumbnail: ', uri);
      navigation.navigate('preview-screen', {
        video: videoUri,
        thumbnail: uri,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Image
        source={require('../../../assets/images/google.png')}
        style={{ width: 140, height: 140 }}
      />
      <Text style={{ fontFamily: 'NotoBold', fontSize: 22, marginTop: 20 }}>
        Start Uploading Short Video
      </Text>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 13,
          fontFamily: 'NotoRegular',
        }}
      >
        Let's upload short video and start sharing your creativity
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.BLACK,
          padding: 10,
          paddingHorizontal: 25,
          borderRadius: 99,
          marginTop: 20,
        }}
        onPress={SelectVideoFile}
      >
        <Text style={{ color: Colors.WHITE, fontFamily: 'NotoRegular' }}>
          Select Video File
        </Text>
      </TouchableOpacity>
    </View>
  );
}
