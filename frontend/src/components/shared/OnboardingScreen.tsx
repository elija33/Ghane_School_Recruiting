import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View, ViewToken } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';
import styles from './style/OnboardingScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'school-outline',
    title: 'Find Teaching Jobs in Ghana',
    description:
      'Browse hundreds of verified teaching positions across Ghana. Apply directly from your phone with a single tap.',
    color: '#1B4F72',
  },
  {
    id: '2',
    icon: 'shield-checkmark-outline',
    title: 'Verified & Trusted',
    description:
      'All teacher profiles go through background checks and credential verification before being shown to schools.',
    color: '#1A5276',
  },
  {
    id: '3',
    icon: 'business-outline',
    title: 'Schools Find the Best Teachers',
    description:
      'Schools subscribe to access pre-verified teacher profiles, post jobs, and manage applications effortlessly.',
    color: '#154360',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const goToNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.color, width }]}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={100} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={goToNext}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          buttonColor="#F39C12"
          textColor="#FFFFFF"
        >
          {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>

        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

