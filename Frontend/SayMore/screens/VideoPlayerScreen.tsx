import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, Image } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  VideoPlayer: {
    video: {
      videoId: string;
      title: string;
      summary?: string;
      thumbnail: string;
      summaryImage?: string;
    };
    lessonTitle: string;
  };
};

type VideoPlayerRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;
type VideoPlayerNavigationProp = StackNavigationProp<RootStackParamList, 'VideoPlayer'>;

interface VideoPlayerScreenProps {
  route: VideoPlayerRouteProp;
  navigation: VideoPlayerNavigationProp;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ route, navigation }) => {
  const { video, lessonTitle } = route.params;
  const { width, height } = Dimensions.get('window');
  const playerHeight = height / 2;
  const playerWidth = width * 0.95;
  const playerMarginHorizontal = width * 0.05;

  const combinedTitle = `${lessonTitle} - ${video.title}`;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.lessonHeader}>{combinedTitle}</Text>

      <View style={{ ...styles.videoContainer, width: playerWidth, marginHorizontal: playerMarginHorizontal }}>
        <YoutubeIframe
          height={playerHeight}
          width={playerWidth}
          videoId={video.videoId}
        />
      </View>

      {video.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          {video.summaryImage && (
            <Image source={{ uri: video.summaryImage }} style={styles.summaryImage} />
          )}
          <Text style={styles.summaryText}>{video.summary}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  lessonHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    padding: 20,
    textAlign: 'center',
  },
  videoHeader: {
    fontSize: 18,
    color: '#003366',
    padding: 10,
    textAlign: 'center',
  },
  videoContainer: {
    alignSelf: 'center',
  },
  summaryContainer: {
    padding: 10,
    marginTop: -215,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center'
  },
  summaryText: {
    fontSize: 18,
    color: '#003366',
  },
  summaryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  }
});

export default VideoPlayerScreen;