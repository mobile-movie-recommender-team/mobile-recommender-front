import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, TextInput, Text, TouchableOpacity, View } from 'react-native';
import { useGetAllMoviesQuery } from '../services/api/api';
import styles from '../components/styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelect from 'react-native-multiple-select';

interface BottomNavProps {
  navigation: StackNavigationProp<any, any>;
}

const HomeScreen = () => {
  const [title, setTitle] = useState('')
  const [searchedMovies, setSearchedMovies] = useState([])
  const [isFilter, setIsFilter] = useState(false)
  const [dateFrom, setDateFrom] = useState(new Date());
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [dateTo, setDateTo] = useState(new Date());
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [showDateTo, setShowDateTo] = useState(false)
  const { data } = useGetAllMoviesQuery()
  const movies = data?.result

  const navigation = useNavigation<BottomNavProps>()

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<FlatList>(null)

  const currentData = movies?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(movies?.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollToOffset({ animated: true, offset: 0 })
  };

  const formateDate = (releaseDate: any) => {
    return new Date(releaseDate).getFullYear();
  }

  const handleChangeTextInput = (text: string) => {
    setTitle(text)
  }

  useEffect(() => {
    if (title.trim() === '') {
      setSearchedMovies([])
    } else {
      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(title.toLowerCase())
      )
      setSearchedMovies(filteredMovies)
    }
  }, [title])

  const displayedMovies = title.trim() ? searchedMovies : currentData
  const isSearching = title.trim().length > 0

  const handleFilter = () => {
    setIsFilter(!isFilter)
  }

  const genres = [
    { id: '1', name: 'Action' },
    { id: '2', name: 'Comedy' },
    { id: '3', name: 'Drama' },
    { id: '4', name: 'Thriller' },
    { id: '5', name: 'Horror' }
  ];

  const countries = [
    { id: '1', name: 'USA' },
    { id: '2', name: 'France' },
    { id: '3', name: 'UK' },
  ];

  const onSelectedGenresChange = (selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };

  const onSelectedCountriesChange = (selectedCountries) => {
    setSelectedCountries(selectedCountries);
  };

  return (
    <View style={styles.main}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput onChangeText={handleChangeTextInput} value={title} placeholder='Enter movie title' style={styles.input_title} />
        <TouchableOpacity style={styles.filter_button} onPress={handleFilter}>
          <Image source={require('../static/filter.png')} />
        </TouchableOpacity>
      </View>
      {isFilter && (
        <View>
          <View style={styles.filter_list}>
            <Text>Rating</Text>
            <View style={{ paddingTop: 5, flexDirection: 'row' }}>
              <TextInput style={[styles.input_filter, { marginRight: 10 }]} placeholder='From' />
              <TextInput style={styles.input_filter} placeholder='To' />
            </View>
            <Text>Release Date</Text>
            <View style={{ paddingTop: 5, flexDirection: 'row' }}>
              <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setShowDateFrom(true)}>
                <Text>From Date</Text>
              </TouchableOpacity>
              {showDateFrom && (
                <DateTimePicker value={dateFrom} mode="date" display="default" />
              )}
              <TouchableOpacity onPress={() => setShowDateTo(true)}>
                <Text>To Date</Text>
              </TouchableOpacity>
              {showDateTo && (
                <DateTimePicker value={dateTo} mode="date" display="default" />
              )}
            </View>
            <View style={{ width: 200 }}>
              <MultiSelect
                items={genres}
                uniqueKey="id"
                displayKey="name"
                onSelectedItemsChange={onSelectedGenresChange}
                selectedItems={selectedGenres}
                selectText="Pick genres"
                tagTextColor="black"
                selectedItemTextColor="blue"
                selectedItemIconColor="#fff"
                itemTextColor="#000"
                hideTags={true}
                hideDropdown={true}
                hideSubmitButton={true}
              />
            </View>
            <View style={{ width: 200 }}>
              <MultiSelect
                items={countries}
                uniqueKey="id"
                displayKey="name"
                onSelectedItemsChange={onSelectedCountriesChange}
                selectedItems={selectedCountries}
                selectText="Pick countries"
                tagTextColor="black"
                selectedItemTextColor="blue"
                selectedItemIconColor="#fff"
                itemTextColor="#000"
                hideTags={true}
                hideDropdown={true}
                hideSubmitButton={true}
              />
            </View>
            <TouchableOpacity>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList style={{ top: 5.5 }} ref={listRef} data={displayedMovies} renderItem={({ item }) => (
        <View style={styles.films_container}>
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { movieId: item.id })}>
            <Image source={{ uri: item.posterURL }} style={styles.image} resizeMode='stretch' />
          </TouchableOpacity>
          <View style={{ paddingLeft: 15, marginBottom: 10, height: 150 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingBottom: 10 }}>{item.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.name_info}>Year: </Text>
              <Text style={styles.film_info}>{formateDate(item.releaseDate)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.name_info}>Rating: </Text>
              <Text style={styles.film_info}>{item.rating}</Text>
            </View>
          </View>
        </View>
      )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          !isSearching && totalPages > 1 && (
            <View style={styles.paginationContainer}>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <TouchableOpacity style={[styles.pageButton, currentPage === page && styles.activePageButton]} key={page} onPress={() => goToPage(page)}>
                    <Text style={[styles.pageButtonText, currentPage === page && styles.activePageButtonText]}>{page}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )
        }
      />

    </View>
  )
}

export default HomeScreen;