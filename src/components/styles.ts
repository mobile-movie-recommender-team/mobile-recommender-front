import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        flex: 1,
    },
    header:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 12,
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
        borderBottomWidth: 1,
        backgroundColor: '#f2f2f2'
    },
    input_filter: {
        borderWidth: 1,
        width: 100,
        height: 40,
        borderRadius: 5,
        borderColor: 'blue',
        marginBottom: 10
    },
    backButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
    },
     sessions_button: {
        backgroundColor: '#d9c334',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 10
    },
    session_container: {
        backgroundColor: '#dbdbdb',
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10
    },
    session_keys: {
        color: 'gray', 
        paddingLeft: 5,
    },
    filter_buttons: {
        borderRadius: 5,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        marginTop: 5,
        height: 30
    },
    date_buttons: {
        borderWidth: 0.2,
        padding: 5,
        backgroundColor: '#f0f0f0',
    }
});

export default styles;