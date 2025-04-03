import { ReactNode } from "react";

export type Movie = {
    id: number
    title: string
    posterURL: string
    releaseDate: string,
    rating: number
};

export type MovieDetail = {
    id: number
    title: string
    description: string
    posterURL: string
    releaseDate: string
    rating: number
    duration: string
    ageRating: string
    director: string
    actors: Array<{'fullName': string}>
    genres: Array<{'name': string}>
}