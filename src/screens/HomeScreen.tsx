import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, TextInput, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useGetAllMoviesQuery } from '../services/api/api';
import styles from '../components/styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelect from 'react-native-multiple-select';

const HomeScreen = () => {
  const [title, setTitle] = useState('')
  const [searchedMovies, setSearchedMovies] = useState([])
  const [isFilter, setIsFilter] = useState(false)
  const [dateFrom, setDateFrom] = useState(new Date());
  const [showDateFrom, setShowDateFrom] = useState(false)
  const [dateTo, setDateTo] = useState(new Date());
  const [selectedGenres, setSelectedGenres] = useState([])
  const [showDateTo, setShowDateTo] = useState(false)
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null)
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null)
  const [ratingFrom, setRatingFrom] = useState('')
  const [ratingTo, setRatingTo] = useState('')
  const [filters, setFilters] = useState<any>({})

  const { data } = useGetAllMoviesQuery(filters)
  const movies = data?.result

  const navigation = useNavigation<StackNavigationProp<any, any>>()

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
      const filteredMovies = movies.filter((movie: any) =>
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

  const onDateFromChange = (event: any, selectedDate: Date | undefined) => {
    setShowDateFrom(false);
    if (selectedDate) {
      setDateFrom(selectedDate)
      setSelectedDateFrom(selectedDate.toISOString().split('T')[0])
    }
  }

  const onDateToChange = (event: any, selectedDate: Date | undefined) => {
    setShowDateTo(false);
    if (selectedDate) {
      setDateTo(selectedDate);
      setSelectedDateTo(selectedDate.toISOString().split('T')[0])
    }
  }

  const onSelectedGenresChange = (selectedGenres: any) => {
    setSelectedGenres(selectedGenres);
  };

  const handleSubmit = () => {
    const newFilters: any = {}
    if (ratingFrom) newFilters.ratingFrom = parseFloat(ratingFrom)
    if (ratingTo) newFilters.ratingTo = parseFloat(ratingTo)

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const dateFromWithoutTime = new Date(dateFrom)
    dateFromWithoutTime.setHours(0, 0, 0, 0)

    const dateToWithoutTime = new Date(dateTo)
    dateToWithoutTime.setHours(0, 0, 0, 0)

    if (dateFromWithoutTime.getTime() !== currentDate.getTime()) {
      newFilters.dateFrom = dateFrom.toISOString().split('T')[0]
    }

    if (dateToWithoutTime.getTime() !== currentDate.getTime()) {
      newFilters.dateTo = dateTo.toISOString().split('T')[0]
    }

    if (selectedGenres.length) {
      newFilters.genres = selectedGenres.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre?.name;
      }).filter(Boolean);
    }

    setFilters(newFilters);
    setIsFilter(false);
  }

  const handleClearFilters = () => {
    setIsFilter(false)
    setTitle('')
    setRatingFrom('')
    setRatingTo('')
    setDateFrom(new Date())
    setDateTo(new Date())
    setSelectedDateFrom(null)
    setSelectedDateTo(null)
    setSelectedGenres([])
    setFilters({})
  }


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
              <TextInput keyboardType='numeric' value={ratingFrom} onChangeText={setRatingFrom} style={[styles.input_filter, { marginRight: 10 }]} placeholder='From' />
              <TextInput keyboardType='numeric' value={ratingTo} onChangeText={setRatingTo} style={styles.input_filter} placeholder='To' />
            </View>
            <Text>Release Date</Text>
            <View style={{ paddingTop: 5, flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.date_buttons, { marginRight: 20 }]} onPress={() => setShowDateFrom(true)}>
                <Text>{selectedDateFrom || "From Date"}</Text>
              </TouchableOpacity>
              {showDateFrom && (
                <DateTimePicker value={dateFrom} mode='date' display='default' onChange={onDateFromChange} />
              )}
              <TouchableOpacity style={styles.date_buttons} onPress={() => setShowDateTo(true)}>
                <Text>{selectedDateTo || "To Date"}</Text>
              </TouchableOpacity>
              {showDateTo && (
                <DateTimePicker value={dateTo} mode='date' display='default' onChange={onDateToChange} />
              )}
            </View>
            <View style={{ width: 200, marginTop: 10 }}>
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
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={[styles.filter_buttons, {backgroundColor: 'cyan'}]} onPress={handleClearFilters}>
                <Text>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filter_buttons, {backgroundColor: 'green', marginLeft: 20}]} onPress={handleSubmit}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
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
          !isSearching && totalPages > 1 ? (
            <View style={[styles.paginationContainer, { paddingBottom: StatusBar.currentHeight }]}>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <TouchableOpacity style={[styles.pageButton, currentPage === page && styles.activePageButton]} key={page} onPress={() => goToPage(page)}>
                    <Text style={[styles.pageButtonText, currentPage === page && styles.activePageButtonText]}>{page}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null
        }
      />

    </View>
  )
}

export default HomeScreen;