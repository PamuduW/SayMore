import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const PointsCategoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handlePress = (title: string) => {
    if (title === 'Lessons Points') {
      navigation.navigate('TotalPointsScreen');
    } else if (title === 'Quizzes & Challenges Points') {
      navigation.navigate('QuizPointHistoryScreen');
    }
  };

  return (
    <LinearGradient
      colors={
        theme === 'dark' ? ['#000000', '#222222'] : ['#577BC1', '#3B5998']
      }
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme === 'dark' ? '#000' : '#577BC1'}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Row with Back Button */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              theme === 'dark' ? styles.backButtonDark : styles.backButtonLight,
            ]}>
            <Text
              style={[
                styles.backButtonText,
                theme === 'dark' && styles.backButtonTextDark,
              ]}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, styles.headerTitleColor]}>
            Points Categories
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Spacer to push title down */}
        <View style={styles.spacer} />

        {/* Title container moved down */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Choose a Category</Text>
          <Text style={styles.subtitleText}>
            View your points history by category
          </Text>
        </View>

        {/* Middle Content */}
        <View style={styles.contentWrapper}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              theme === 'dark'
                ? styles.optionButtonDark
                : styles.optionButtonLight,
            ]}
            onPress={() => handlePress('Lessons Points')}>
            <View style={styles.optionContent}>
              <View
                style={[
                  styles.iconContainer,
                  theme === 'dark'
                    ? styles.iconContainerDark
                    : styles.iconContainerLight,
                ]}>
                <Text
                  style={[
                    styles.iconText,
                    theme === 'dark'
                      ? styles.iconTextDark
                      : styles.iconTextLight,
                  ]}>
                  📚
                </Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text
                  style={[
                    styles.optionText,
                    theme === 'dark'
                      ? styles.optionTextDark
                      : styles.optionTextLight,
                  ]}>
                  Lessons Points
                </Text>
                <Text
                  style={[
                    styles.optionSubText,
                    theme === 'dark'
                      ? styles.optionSubTextDark
                      : styles.optionSubTextLight,
                  ]}>
                  View points earned from completing lessons
                </Text>
              </View>
              <Text
                style={[
                  styles.arrowText,
                  theme === 'dark'
                    ? styles.arrowTextDark
                    : styles.arrowTextLight,
                ]}>
                →
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              theme === 'dark'
                ? styles.optionButtonDark
                : styles.optionButtonLight,
            ]}
            onPress={() => handlePress('Quizzes & Challenges Points')}>
            <View style={styles.optionContent}>
              <View
                style={[
                  styles.iconContainer,
                  theme === 'dark'
                    ? styles.iconContainerDark
                    : styles.iconContainerLight,
                ]}>
                <Text
                  style={[
                    styles.iconText,
                    theme === 'dark'
                      ? styles.iconTextDark
                      : styles.iconTextLight,
                  ]}>
                  🏆
                </Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text
                  style={[
                    styles.optionText,
                    theme === 'dark'
                      ? styles.optionTextDark
                      : styles.optionTextLight,
                  ]}>
                  Quizzes & Challenges
                </Text>
                <Text
                  style={[
                    styles.optionSubText,
                    theme === 'dark'
                      ? styles.optionSubTextDark
                      : styles.optionSubTextLight,
                  ]}>
                  View points earned from activities
                </Text>
              </View>
              <Text
                style={[
                  styles.arrowText,
                  theme === 'dark'
                    ? styles.arrowTextDark
                    : styles.arrowTextLight,
                ]}>
                →
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              theme === 'dark' ? styles.footerTextDark : styles.footerTextLight,
            ]}>
            Points help you track your progress in SayMore
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    width: '100%',
  },

  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  headerTitleColor: {
    color: '#FFFFFF',
  },

  headerSpacer: {
    width: 48,
  },

  // Add spacer to push title down
  spacer: {
    height: 30,
  },

  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  subtitleText: {
    fontSize: 16,
    color: '#D0D3E6',
    textAlign: 'center',
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  backButtonLight: {
    backgroundColor: '#E6F7FF',
  },
  backButtonDark: {
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    paddingBottom: 2,
    lineHeight: 32,
  },
  backButtonTextDark: {
    color: '#000000',
  },

  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  optionButton: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  optionButtonDark: {
    backgroundColor: '#333333',
  },
  optionButtonLight: {
    backgroundColor: '#FFFFFF',
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  iconContainerDark: {
    backgroundColor: '#222222',
  },
  iconContainerLight: {
    backgroundColor: '#E6F7FF',
  },

  iconText: {
    fontSize: 24,
  },

  iconTextDark: {
    color: '#FFFFFF',
  },
  iconTextLight: {
    color: '#3B5998',
  },

  optionTextContainer: {
    flex: 1,
  },

  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  optionTextDark: {
    color: '#FFFFFF',
  },
  optionTextLight: {
    color: '#2A2D57',
  },

  optionSubText: {
    fontSize: 14,
  },

  optionSubTextDark: {
    color: '#AAAAAA',
  },
  optionSubTextLight: {
    color: '#666666',
  },

  arrowText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  arrowTextDark: {
    color: '#FFFFFF',
  },
  arrowTextLight: {
    color: '#3B5998',
  },

  footer: {
    padding: 20,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },

  footerTextDark: {
    color: '#AAAAAA',
  },
  footerTextLight: {
    color: '#D0D3E6',
  },
});

export default PointsCategoryScreen;
