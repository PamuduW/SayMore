import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

type Category = 'PublicSpeaking' | 'Stuttering';

/**
 * TestHistory component that displays the test history for the selected category.
 * @returns {JSX.Element} The rendered component.
 */
const TestHistory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<null | Category>(
    null
  );
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const theme = useTheme();

    const handleBackPress = () => {
      navigation.goBack();
    };

  /**
   * Fetches the test history for the given category from Firestore.
   * @param {Category} category - The category of the test history to fetch.
   */
  const fetchHistory = async (category: Category) => {
    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        console.log('User not logged in');
        setLoading(false);
        return;
      }
      const userDoc = await firestore()
        .collection('User_Accounts')
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        const data = userDoc.data();
        const categoryKey =
          category === 'PublicSpeaking' ? 'PS_Check' : 'Stuttering_Check';
        const categoryHistory = data?.results
          ? data.results[categoryKey]
          : null;
        setHistoryData(categoryHistory);
      } else {
        console.log('No user document found.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the selection of a category and fetches the corresponding test history.
   * @param {Category} category - The selected category.
   */
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    fetchHistory(category);
  };

  let historyArray: any[] = [];
  if (historyData) {
    historyArray = Object.keys(historyData).map(key => ({
      id: key,
      ...historyData[key],
    }));
    historyArray.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)); // Added radix parameter
  }

  /**
   * Renders a single history item.
   * @param {Object} item - The history item to render.
   * @returns {JSX.Element} The rendered history item.
   */
  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        if (selectedCategory === 'PublicSpeaking') {
          navigation.navigate('TestHistory_PS', { testId: item.id });
        } else {
          navigation.navigate('TestHistory_S', { testId: item.id });
        }
      }}>
      <Text style={theme === 'dark' ? styles.darkHistoryItemText : styles.historyItemText}>Test ID: {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.container}>
    <TouchableOpacity
              style={
                theme === 'dark' ? styles.darkBackButton : styles.lightBackButton
              }
              onPress={handleBackPress}>
              <Text
                style={
                  theme === 'dark'
                    ? styles.darkBackButtonText
                    : styles.lightBackButtonText
                }>
                ←
              </Text>
            </TouchableOpacity>
      {!selectedCategory && (
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={theme === 'dark' ? styles.darkCategoryButton : styles.categoryButton}
            onPress={() => handleCategorySelect('PublicSpeaking')}>
            <Text style={styles.categoryText}>Public Speaking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={theme === 'dark' ? styles.darkCategoryButton : styles.categoryButton}
            onPress={() => handleCategorySelect('Stuttering')}>
            <Text style={styles.categoryText}>Stuttering</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#577BC1"
          style={styles.loading}
        />
      )}

      {selectedCategory && !loading && (
        <>
          {historyArray.length === 0 ? (
            <Text style={styles.noHistoryText}>
              No history found for {selectedCategory} tests.
            </Text>
          ) : (
            <FlatList
              data={historyArray}
              keyExtractor={item => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.listContainer}
            />
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedCategory(null);
              setHistoryData(null);
            }}>
            <Text style={theme === 'dark' ? styles.darkBackButtonText : styles.backButtonText}>Back to Categories</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#577BC1',
  },
  darkContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#214283',
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },darkCategoryButton: {
    backgroundColor: '#3b3b3b',
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
  },
  loading: {
    marginTop: 20,
  },
  noHistoryText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyItemText: {
    fontSize: 16,
  },
  darkHistoryItemText: {
    fontSize: 16,
    color: '#fff',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#214283',
    fontSize: 16,
  },
  darkBackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
    lightBackButton: {
      width: 48,
      height: 48,
      backgroundColor: '#F0F8FF',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    darkBackButton: {
      width: 48,
      height: 48,
      backgroundColor: '#2C2C2C',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    lightBackButtonText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#2C3E50',
      lineHeight: 28,
    },
    darkBackButtonText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFF',
      lineHeight: 28,
    },
});

export default TestHistory;
