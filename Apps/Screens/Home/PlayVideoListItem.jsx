import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRef, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function PlayVideoListItem({ video, index, activeIndex }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const BottomTabHeight = useBottomTabBarHeight();
  const ScreenHeight = Dimensions.get('window').height;

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          bottom: 20,
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'flex-end',
        }}
      >
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Image
              source={{ uri: video?.Users?.profileImage }}
              style={{ width: 30, height: 30, borderRadius: 99 }}
            />
            <Text
              style={{
                fontFamily: 'NotoRegular',
                color: Colors.WHITE,
                fontSize: 16,
              }}
            >
              {video?.Users?.name}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'NotoRegular',
              color: Colors.WHITE,
              fontSize: 16,
              marginTop: 7,
            }}
          >
            {video?.description}
          </Text>
        </View>
        <View style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <Ionicons name="heart-outline" size={40} color={Colors.WHITE} />
          <Ionicons name="chatbubble-outline" size={35} color={Colors.WHITE} />
          <Ionicons name="paper-plane-outline" size={35} color={Colors.WHITE} />
        </View>
      </View>
      <Video
        ref={videoRef}
        style={[styles.video, { height: ScreenHeight }]}
        source={{
          uri: video?.videoUrl,
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={index === activeIndex}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
  },
});
