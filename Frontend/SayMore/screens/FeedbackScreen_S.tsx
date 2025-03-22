import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface FeedbackScreenSProps {
    route: {
        params: {
            stutter_feedback: string;
            stutter_count: number;
            stutter_score: number;
        };
    };
}

const FeedbackScreen_S: React.FC<FeedbackScreenSProps> = ({ route }) => {
    const { stutter_feedback, stutter_count, stutter_score } = route.params;
    const navigation = useNavigation();

    const handleImprovePress = () => {
        if (stutter_count > 3) {
            navigation.navigate('UnderstandingAndOvercomingStutteringScreen');
        } else {
            navigation.navigate('LessonRedirectionStuttering');
        }
    };

    const displayStutterScore = isNaN(stutter_score)
        ? 20 // Dummy value if stutter_score is NaN
        : stutter_score;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Feedback</Text>
            <Text style={styles.stutterScore}>
                Stutter Score: {displayStutterScore}
            </Text>
            <Text style={styles.label}>Stutter feedback:</Text>
            <Text style={styles.value}>{stutter_feedback}</Text>

            <TouchableOpacity
                style={styles.improveButton}
                onPress={handleImprovePress}
            >
                <Text style={styles.improveButtonText}>Improve</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
    },
    improveButton: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
    },
    improveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stutterScore: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default FeedbackScreen_S;