import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Movie = {
  id: string;
  title: string;
  posterURL: string;
  releaseDate: string;
  rating: number;
};

type RootStackParamList = {
  Recommendations: undefined;
  Detail: { movieId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Recommendations'>;

const PAGE_SIZE = 10;

export default function RecommendationsScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<FlatList>(null);
  const navigation = useNavigation<NavigationProp>();

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('Token not found');
        return;
      }

      const response = await fetch(
        `http://192.168.1.2:8080/api/v1/recommendations?pageSize=${PAGE_SIZE}&pageNumber=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const text = await response.text();

      if (text) {
        const data = JSON.parse(text);
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const goToPage = (page: number) => {
    setPage(page);
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
    style={styles.films_container}
    onPress={() => navigation.navigate('Detail', { movieId: item.id })}
  >
    <Image source={{ uri: item.posterURL }} style={styles.image} resizeMode="stretch" />
    <View style={{ paddingLeft: 15, marginBottom: 10, height: 150 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 10 }}>{item.title}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.name_info}>Year: </Text>
        <Text style={styles.film_info}>{new Date(item.releaseDate).getFullYear()}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.name_info}>Rating: </Text>
        <Text style={styles.film_info}>{item.rating.toFixed(1)}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          ref={listRef}
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            movies.length === PAGE_SIZE ? (
              <View style={styles.paginationContainer}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[styles.pageButton, page === pageNum && styles.activePageButton]}
                      onPress={() => goToPage(pageNum)}
                    >
                      <Text
                        style={[
                          styles.pageButtonText,
                          page === pageNum && styles.activePageButtonText,
                        ]}
                      >
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
    paddingTop: 40,
  },
  films_container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 14,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  name_info: {
    fontWeight: '600',
    color: '#333',
  },
  film_info: {
    color: '#555',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  activePageButton: {
    backgroundColor: '#1E90FF',
  },
  pageButtonText: {
    color: '#000',
  },
  activePageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
