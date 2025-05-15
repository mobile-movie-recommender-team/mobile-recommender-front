import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Movie, MovieDetail } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const movieApi = createApi({
    reducerPath: 'movieApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.0.102:8080/api/v1/' }),
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query: (filters) => {
                const params = new URLSearchParams()
                if (filters.ratingFrom) {params.append('FromRating', filters.ratingFrom);}
                if (filters.ratingTo) {params.append('ToRating', filters.ratingTo);}
                if (filters.dateFrom) {params.append('FromReleaseDate', filters.dateFrom);}
                if (filters.dateTo) {params.append('ToReleaseDate', filters.dateTo);}
                if (filters.genres?.length) {
                    filters.genres.forEach(genre => params.append('Genres', genre));
                }

                return `film/all?${params.toString()}`;
            },
        }),
        getOneMovie: builder.query<MovieDetail, number>({
            query: (id) => `film/${id}`,
        }),
        getSessions: builder.query<[], string>({
            async queryFn(movieTitle, _queryApi, _extraOptions, baseQuery) {
                const token = await AsyncStorage.getItem('accessToken');
                const result = await baseQuery({
                    url: `sessions/nearby?MovieTitle=${movieTitle}`,
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!result.data) {
                    return { error: result.error };
                }
                return { data: result.data };
            },
        }),
    }),
});

export const { useGetAllMoviesQuery, useGetOneMovieQuery, useGetSessionsQuery } = movieApi;
