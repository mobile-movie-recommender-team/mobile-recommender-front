import React, { useState, useEffect } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useGetOneMovieQuery, useGetSessionsQuery } from '../services/api/api';
import styles from '../components/styles';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
        
const DetailScreen = () => {
    const navigation = useNavigation<StackNavigationProp<any, any>>();
    const route = useRoute();
    const [isFavorite, setIsFavorite] = useState(false);
    const { movieId } = route.params;
    const { data } = useGetOneMovieQuery(movieId);
    const movie = data?.result;

    const [shouldFetchSessions, setShouldFetchSessions] = useState(false)
    const { data: sessions } = useGetSessionsQuery(movie?.title, {
        skip: !shouldFetchSessions,
    })

    const handleViewSessions = () => {
        setShouldFetchSessions(true)
    }

    useEffect(() => {
        if (sessions) {
            navigation.navigate('Session', { sessions });
        }
    }, [sessions]);

    const formateDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        return formattedDate;
    };

    const checkIfFavorite = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await axios.get('http://192.168.0.102:8080/api/v1/favorites/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const favoriteIds = response.data.map((fav: any) => fav.id);
            setIsFavorite(favoriteIds.includes(movieId));
        } catch (error) {
            console.error('Error checking favorites:', error);
        }
    };

    useEffect(() => {
        if (movieId) {
            checkIfFavorite();
        }
    }, [movieId]);

    const toggleFavorite = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        try {
            if (isFavorite) {
                await axios.delete(`http://192.168.0.102:8080/api/v1/favorites/remove/${movieId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(false);
            } else {
                await axios.post(`http://192.168.0.102:8080/api/v1/favorites/add/${movieId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <ScrollView>
            <View style={styles.films_info_container}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: movie?.posterURL }} style={styles.image} resizeMode='stretch' />

                        <TouchableOpacity
                            style={{
                                backgroundColor: isFavorite ? '#25ab20' : 'gold',
                                paddingVertical: 10,
                                paddingHorizontal: 12,
                                alignItems: 'center',
                                marginTop: 10,
                                borderRadius: 8,
                                width: 150
                            }}
                            onPress={toggleFavorite}
                        >
                            <Text style={{ fontWeight: 'bold', color: '#000' }}>
                                {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleViewSessions} style={styles.sessions_button}>
                            <Text>View sessions</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingLeft: 20, flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 10 }}>{movie?.title}</Text>
                        <Text style={[styles.name_info, { marginBottom: 1 }]}>Description: </Text>
                        <Text style={[styles.film_info, { marginBottom: 30 }]}>{movie?.description}</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name_info}>Release Date: </Text>
                            <Text style={styles.film_info}>{formateDate(movie?.releaseDate)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.name_info, { paddingRight: 3 }]}>Director:</Text>
                            <Text style={styles.film_info}>{movie?.director ?? 'Unknown'}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name_info}>Duration: </Text>
                            <Text style={styles.film_info}>{movie?.duration} min.</Text>
                        </View>

                        {movie?.ageRating && (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.name_info}>Age rating: </Text>
                                <Text style={styles.film_info}>{movie?.ageRating}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name_info}>Rating: </Text>
                            <Text style={styles.film_info}>{movie?.rating}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name_info}>Genre: </Text>
                            <View>
                                {movie?.genres.map((genre, index) => (
                                    <Text key={index} style={[styles.film_info, { marginBottom: 1 }]}>
                                        {genre?.name}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.name_info}>Actors: </Text>
                            <Text style={[styles.film_info, { width: 200 }]}>
                                {movie?.actors?.slice(0, 20).map(actor => actor.fullName).join(', ')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default DetailScreen;
