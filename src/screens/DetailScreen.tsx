import React from 'react';
import { Image, Text, View, ScrollView } from 'react-native';
import { useGetOneMovieQuery } from '../services/api/api';
import styles from '../components/styles';
import { useRoute } from '@react-navigation/native';

const DetailScreen = () => {
    const route = useRoute()
    const { movieId } = route.params;
    const { data } = useGetOneMovieQuery(movieId)
    const movie = data?.result
    console.log(movie?.actors)
    console.log(movie?.genres)

    const formateDate = (dateString: string) => {
        const date = new Date(dateString)
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
        return formattedDate
    }

    return (
        <ScrollView>
            <View style={styles.films_container}>
                <Image source={{ uri: movie?.posterURL }} style={styles.image} resizeMode='stretch' />
                <View style={{ paddingLeft: 20, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 10 }}>{movie?.title}</Text>
                    <Text style={[styles.name_info, { marginBottom: 1 }]}>Description: </Text>
                    <Text style={[styles.film_info, { width: 250, marginBottom: 30 }]}>{movie?.description}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.name_info}>Release Date: </Text>
                        <Text style={styles.film_info}>{formateDate(movie?.releaseDate)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.name_info, { paddingRight: 3 }]}>Director:</Text>
                        {movie?.director ? (
                            <Text style={styles.film_info}>{movie?.director}</Text>
                        ) : (
                            <Text style={styles.film_info}>Unknown</Text>
                        )}
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
        </ScrollView>
    )
}

export default DetailScreen;