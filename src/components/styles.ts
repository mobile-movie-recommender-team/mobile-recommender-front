import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        flex: 1
    },
    image: {
        width: 100,
        height: 150,
    },
    films_container: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingLeft: 10,
    },
    film_info: {
        marginBottom: 5,
        flexWrap: 'wrap',
        lineHeight: 25
    },
    name_info: {
        marginBottom: 5,
        flexWrap: 'wrap',
        lineHeight: 25,
        color: '#5c5a5a'
    },
    pageButtonText: {
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 20,
        paddingBottom: 15,

    },
    pageButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d1d7e0',
        height: 40,
        marginRight: 10,
        width: 40,

    },
    activePageButton: {
        backgroundColor: 'black',
    },
    activePageButtonText: {
        color: '#fff'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 25,
        paddingLeft: 10,
        paddingTop: 7,
    },
    line: {
        backgroundColor: 'black',
        fontSize: 0.5,
        marginTop: 10
    },
    filter_button: {
        top: 13,
        position: 'absolute',
        right: 15
        
    },
    input_title: {
        borderWidth: 1,
        borderRadius: 10,
        width: '85%',
        top: 5,
        left: 7,
    },
    filter_list: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 5,
        borderWidth: 1,
    },
    input_filter: {
        borderWidth: 1,
        width: 100,
        height: 40,
        borderRadius: 5,
        borderColor: 'blue',
    },

});

export default styles;