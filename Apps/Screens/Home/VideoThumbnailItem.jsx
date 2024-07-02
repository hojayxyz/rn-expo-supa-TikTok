import { View, Text, Image, TouchableHighlight } from 'react-native';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function VideoThumbnailItem({ video }) {
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      style={{ flex: 1, margin: 5 }}
      onPress={() => {
        navigation.navigate('play-video', {
          selectedVideo: video,
        });
      }}
    >
      <>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            zIndex: 10,
            bottom: 0,
            padding: 5,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Image
              source={{ uri: video?.Users?.profileImage }}
              style={{ width: 20, height: 20, borderRadius: 99 }}
            />
            <Text
              style={{
                color: Colors.WHITE,
                fontFamily: 'NotoRegular',
                fontSize: 12,
              }}
            >
              {video?.Users?.username}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Text
              style={{
                fontFamily: 'NotoRegular',
                fontSize: 12,
                color: Colors.WHITE,
              }}
            >
              36
            </Text>
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
        </View>
        <Image
          source={{ uri: video?.thumbnailUrl }}
          style={{ width: '100%', height: 250, borderRadius: 10 }}
        />
      </>
    </TouchableHighlight>
  );
}
