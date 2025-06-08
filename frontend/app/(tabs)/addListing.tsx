import {View,Text,StyleSheet} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const addListing = () => {

    return(
        <SafeAreaProvider>
            <SafeAreaView>
                <Text >
                    Add Listing screen
                </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    input: {
        
    }
})
export default addListing;