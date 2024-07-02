import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import { supabase } from '../../Utils/SupabaseConfig';
import { useUser } from '@clerk/clerk-react';

export default function PreviewScreen() {
  const params = useRoute().params;
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const { user } = useUser();

  useEffect(() => {
    console.log('params are', params);
  }, []);

  const publishHandler = async () => {
    console.log('Publishing');
    setUploading(true);
    const tempVideoUrl = await uploadVideo(params?.video);
    console.log('Video URL: ', tempVideoUrl);
    //setVideoUrl(tempVideoUrl);
    const tempThumbnailUrl = await uploadThumbnail(params?.thumbnail);
    //setThumbnailUrl(tempThumbnailUrl);
    console.log('Thumbnail URL: ', tempThumbnailUrl);
    await insertToDB(tempVideoUrl, tempThumbnailUrl);
    setUploading(false);
    navigation.goBack();
  };

  const insertToDB = async (tempVideoUrl, tempThumbnailUrl) => {
    const { data, error } = await supabase
      .from('PostList')
      .insert([
        {
          videoUrl: tempVideoUrl,
          thumbnailUrl: tempThumbnailUrl,
          description: description,
          emailRef: user?.primaryEmailAddress?.emailAddress,
        },
      ])
      .select();
    if (error) {
      console.log('Error while publishing to DB', error);
      return;
    }
    console.log('Successfully published to DB result data is', data);
    return data;
  };

  const uploadVideo = async (file) => {
    const arraybuffer = await fetch(file).then((res) => res.arrayBuffer());
    const fileType = file.split('.').pop();
    const { data, error } = await supabase.storage
      .from('tiktok-clone')
      .upload(`videos/video-${Date.now()}.${fileType}`, arraybuffer);
    // .finally(() => {
    //   // setVideoUrl(
    //   //   'https://tytonmyclbocrovwejog.supabase.co/storage/v1/object/public/' +
    //   //     data.fullPath
    //   // );
    //   // console.log('Set Video URL: ', videoUrl);
    // });
    if (error) {
      // Handle error
      throw error;
    } else {
      // Handle success
      console.log('Video upload success data: ', data);
      return (
        'https://tytonmyclbocrovwejog.supabase.co/storage/v1/object/public/' +
        data.fullPath
      );
    }
  };

  const uploadThumbnail = async (file) => {
    const arraybuffer = await fetch(file).then((res) => res.arrayBuffer());
    const fileType = file.split('.').pop();
    const { data, error } = await supabase.storage
      .from('tiktok-clone')
      .upload(`thumbnails/thumbnail-${Date.now()}.${fileType}`, arraybuffer);
    if (error) {
      // Handle error
      throw error;
    } else {
      // Handle success
      console.log('Thumbnail upload success data: ', data);
      return (
        'https://tytonmyclbocrovwejog.supabase.co/storage/v1/object/public/' +
        data.fullPath
      );
      // console.log('Set Thumbnail URL: ', thumbnailUrl);
    }
  };

  return (
    <KeyboardAvoidingView style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}
          disabled={uploading}
        >
          <Ionicons name="arrow-back-circle" size={44} color="black" />
          <Text style={{ fontFamily: 'NotoRegular', fontSize: 20 }}>Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <Text style={{ fontFamily: 'NotoBold', fontSize: 20 }}>
            Add Details
          </Text>
          <Image
            source={{ uri: params?.thumbnail }}
            style={{ width: 200, height: 300, borderRadius: 15, marginTop: 15 }}
          />
          <TextInput
            numberOfLines={3}
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={{
              borderWidth: 1,
              width: '100%',
              borderRadius: 10,
              marginTop: 25,
              borderColor: Colors.BACKGROUND_TRANSPARENT,
              paddingHorizontal: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.BLACK,
              padding: 10,
              paddingHorizontal: 25,
              borderRadius: 99,
              marginTop: 20,
            }}
            onPress={publishHandler}
            disabled={uploading}
          >
            <Text style={{ color: Colors.WHITE, fontFamily: 'NotoRegular' }}>
              Publish
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
