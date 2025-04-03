import { SafeAreaView, Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import styles from '../components/styles'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';

interface HeaderProps {
    navigation: StackNavigationProp<any, any>;
  }

const Header = () => {
    const navigation = useNavigation<HeaderProps>()
    const route = useRoute()

    const getHeaderText = () => {
        switch (route.name) {
            case 'Detail':
                return ''
            default:
                return 'Movies'
        }
    }

    return (
        <SafeAreaView>
            <View style={{ flexDirection: 'row' }}>
                {route.name === 'Detail' && (
                    <TouchableOpacity style={{ paddingRight: 100, top: 12 }} onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../static/back.png')} />
                    </TouchableOpacity>
                )}
                <Text style={styles.text}>{getHeaderText()}</Text>
            </View>
            <Text style={styles.line}></Text>
        </SafeAreaView>

    )
}

export default Header