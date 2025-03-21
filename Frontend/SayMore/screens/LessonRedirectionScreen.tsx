import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const LessonRedirectionScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handlePress = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={
          theme === 'dark' ? ['#1C1C1C', '#3A3A3A'] : ['#577BC1', '#577BC1']
        }
        style={styles.container}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[
              styles.redirectionButton,
              theme === 'dark'
                ? styles.darkRedirectionButton
                : styles.lightRedirectionButton,
            ]}
            onPress={() => handlePress('LessonRedirectionPS')}>
            <Text
              style={
                theme === 'dark'
                  ? styles.darkRedirectionText
                  : styles.lightRedirectionText
              }>
              Public Speaking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.redirectionButton,
              theme === 'dark'
                ? styles.darkRedirectionButton
                : styles.lightRedirectionButton,
            ]}
            onPress={() => handlePress('CommunicationAndStageFrightScreen')}>
            <Text
              style={
                theme === 'dark'
                  ? styles.darkRedirectionText
                  : styles.lightRedirectionText
              }>
              Communication Tips & Managing Stage Fright
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
                      style={[
                        styles.redirectionButton,
                        theme === 'dark'
                          ? styles.darkRedirectionButton
                          : styles.lightRedirectionButton,
                      ]}
                      onPress={() => handlePress('ClarityScreen')}>
                      <Text
                        style={
                          theme === 'dark'
                            ? styles.darkRedirectionText
                            : styles.lightRedirectionText
                        }>
                        Clarity
                      </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('PerfectingYourPitchScreen')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Perfecting Your Pitch
                       </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('SpeakingWithEnergyScreen')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Speaking With Energy
                       </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('LessonRedirectionStuttering')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Stuttering
                       </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('PerfectingYourPitchScreen')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Perfecting Your Pitch
                       </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('SpeakingWithEnergyScreen')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Speaking With Energy
                       </Text>
           </TouchableOpacity>

           <TouchableOpacity
                       style={[
                         styles.redirectionButton,
                         theme === 'dark'
                           ? styles.darkRedirectionButton
                           : styles.lightRedirectionButton,
                       ]}
                       onPress={() => handlePress('LessonRedirectionStuttering')}>
                       <Text
                         style={
                           theme === 'dark'
                             ? styles.darkRedirectionText
                             : styles.lightRedirectionText
                         }>
                         Stuttering
                       </Text>
           </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  redirectionButton: {
    width: '100%',
    height: 100,
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  darkRedirectionButton: {
    backgroundColor: '#4a4a4a',
  },
  lightRedirectionButton: {
    backgroundColor: '#E6F7FF',
  },
  darkRedirectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  lightRedirectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
});

export default LessonRedirectionScreen;