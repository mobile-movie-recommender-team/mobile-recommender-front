import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import styles from '../components/styles';

export type RootStackParamList = {
    Session: { sessions: any[] }
}
type SessionRouteProp = RouteProp<RootStackParamList, 'Session'>

const SessionScreen = () => {
    const route = useRoute<SessionRouteProp>();
    const sessions = route.params?.sessions;

    return (
        <View style={{ left: 10 }}>
            {sessions?.length !== 0 ? (
                <FlatList style={{ width: '95%' }} data={sessions} renderItem={({ item }) => (
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>{item.day.startsWith('Today') ? item.day.replace('Today', '') : item.day}</Text>
                        <FlatList data={item.cinemas} renderItem={({ item: cinema }) => (
                            <View style={styles.session_container}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.session_keys}>Cinema: </Text>
                                    <Text>{cinema.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.session_keys}>Address: </Text>
                                    <Text style={{ color: 'blue', flexWrap: 'wrap', width: '85%' }}>{cinema.address}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.session_keys}>Sessions: </Text>
                                    <FlatList data={cinema.showtimesDTOs?.[0]?.time} renderItem={({ item: time }) => (
                                        <Text style={{ marginRight: 10 }}>{time}</Text>
                                    )}
                                        horizontal
                                        keyExtractor={(time) => time}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                                    <Text style={styles.session_keys}>Type: </Text>
                                    <Text>{cinema.showtimesDTOs?.[0]?.type}</Text>
                                </View>
                            </View>
                        )}
                            keyExtractor={(cinema) => cinema.name}
                        />
                    </View>
                )}
                    keyExtractor={(item, index) => `${item.day}-${index}`}
                />
            ) : (
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>No sessions</Text>
                </View>
            )}
        </View>
    )
}

export default SessionScreen;
