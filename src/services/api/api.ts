import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Movie, MovieDetail } from './types'

export const movieApi = createApi({
    reducerPath: 'movieApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.5:8080/' }),
    endpoints: (builder) => ({
        getAllMovies: builder.query<Movie[], void>({
            query: () => 'film/all',
        }),
        getOneMovie: builder.query<MovieDetail, number>({
            query: (id) => `film/${id}`,
        })
    }),
})

export const { useGetAllMoviesQuery, useGetOneMovieQuery } = movieApi