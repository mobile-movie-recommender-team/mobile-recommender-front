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

const PAGE_SIZE = 6;

export default function RecommendationsScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
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
        `http://192.168.0.102:8080/api/v1/recommendations?pageSize=${PAGE_SIZE}&pageNumber=${page}`,
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
        setHasNextPage(data.length === PAGE_SIZE);
      } else {
        setMovies([]);
        setHasNextPage(false);
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

  const goToPage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
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

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {page > 2 && (
        <TouchableOpacity style={styles.pageButton} onPress={() => goToPage(1)}>
          <Text style={styles.pageButtonText}>1</Text>
        </TouchableOpacity>
      )}

      {page > 2 && <Text style={styles.pageButtonText}>...</Text>}

      {page > 1 && (
        <TouchableOpacity style={styles.pageButton} onPress={() => goToPage(page - 1)}>
          <Text style={styles.pageButtonText}>{page - 1}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.pageButton, styles.activePageButton]} onPress={() => goToPage(page)}>
        <Text style={styles.activePageButtonText}>{page}</Text>
      </TouchableOpacity>

      {hasNextPage && (
        <>
          <TouchableOpacity style={styles.pageButton} onPress={() => goToPage(page + 1)}>
            <Text style={styles.pageButtonText}>{page + 1}</Text>
          </TouchableOpacity>
          <Text style={styles.pageButtonText}>...</Text>
        </>
      )}
    </View>
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
          ListFooterComponent={renderPagination}
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
    alignItems: 'center',
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
  },
  activePageButton: {
    backgroundColor: 'black',
  },
  pageButtonText: {
    color: '#000',
  },
  activePageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
