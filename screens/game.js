import React,{useState,useRef,useEffect} from 'react';
import {StyleSheet,View,Text,Alert,ScrollView,FlatList,Dimensions} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import NumberContainer from '../component/numberContainer.js';
import Card from '../component/card.js';
import MainButton from '../component/mainButton.js';
import { AntDesign } from '@expo/vector-icons'; 

const generateRandom=(min,max,exclude)=>{
    min=Math.ceil(min)
    max=Math.floor(max)
    const randomNumber=Math.floor(Math.random()*(max-min))+min
    if(randomNumber==exclude){
        return generateRandom(min,max,exclude);
    }else{
        return randomNumber;
    }
}

const renderList=(listLength,itemData)=>(
    <View style={styles.listItem}>
        <Text>#{listLength-itemData.index}</Text>
        <Text>{itemData.item}</Text>
    </View>
)


const Game=({userChoice,onGameOver})=>{

    const initialGuess=generateRandom(1,100,userChoice)
    const [currentGuess, setCurrentGuess]=useState(initialGuess);
    const [pastGuesses,setPastGuesses]=useState([initialGuess.toString()]);

    const [availableDeviceWidth,setAvailableDeviceWidth]=useState(Dimensions.get('window').width)
    const [availableDeviceHeight,setAvailableDeviceHeight]=useState(Dimensions.get('window').height)

    useEffect(()=>{
        const updateLayout=()=>{
            setAvailableDeviceWidth(Dimensions.get('window').width)
            setAvailableDeviceHeight(Dimensions.get('window').height)
        }
        Dimensions.addEventListener('change',updateLayout)
        return ()=>Dimensions.addEventListener('change',updateLayout).remove()
    })

    /* 重新渲染的时候不影响储存在useRef中的值 */
    const currentLow= useRef(1);
    const currentHigh= useRef(100);

    /* do after render */
    useEffect(()=>{
        if(currentGuess==userChoice){
            onGameOver(pastGuesses.length)
        }
    },[currentGuess,userChoice,onGameOver])

    const nextGuessHandler=(direction)=>{
        if((direction=='lower' && currentGuess<userChoice)||(direction=='greater' && currentGuess>userChoice)){
            Alert.alert("Don\'t lie !","You know that this is wrong...",[{text:'Sorry!',style:'cancel'}]);
            return;
        }
        if(direction=='lower'){
            currentHigh.current=currentGuess;
        }else{
            currentLow.current=currentGuess+1;
        }
        const nextNumber= generateRandom(currentLow.current,currentHigh.current,currentGuess);
        setCurrentGuess(nextNumber)
        setPastGuesses(pastGuesses=>[nextNumber.toString(), ...pastGuesses])
    }

    let listContainerStyle=styles.listContainer;
    if(availableDeviceWidth<350){
        listContainerStyle=styles.listContainerBig
    }

    if(availableDeviceHeight<500){
        return (
        <View style={styles.screen}>
            <Text>Computer's Guess</Text>
            <View style={styles.controls}>
                <MainButton onPress={nextGuessHandler.bind(this,'lower')}>
                    <AntDesign name="minus" size={24} color="black" />
                </MainButton>
                <NumberContainer>{currentGuess}</NumberContainer>
                <MainButton onPress={nextGuessHandler.bind(this,'greater')}>
                    <AntDesign name="plus" size={24} color="black" />
                </MainButton>
            </View>
            <View style={styles.listContainerStyle}>
                {/* <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess,index)=>renderList(guess,pastGuesses.length-index))}
                </ScrollView> */}
                <FlatList 
                    keyExtractor={item=>item}
                    data={pastGuesses} 
                    renderItem={renderList.bind(this,pastGuesses.length)}
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
        )
    }else{
        return (
            <View style={styles.screen}>
            <Text>Computer's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <View style={styles.controls}>
                <MainButton onPress={nextGuessHandler.bind(this,'lower')}>
                    <AntDesign name="minus" size={24} color="black" />
                </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this,'greater')}>
                    <AntDesign name="plus" size={24} color="black" />
                </MainButton>
            </View>
            <View style={styles.listContainerStyle}>
                <FlatList 
                    keyExtractor={item=>item}
                    data={pastGuesses} 
                    renderItem={renderList.bind(this,pastGuesses.length)}
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
        )
    }

}
const styles=StyleSheet.create({
    screen:{
        flex:1,
        padding:10,
        paddingBottom:130,
        alignItems:'center',
    },
    buttonContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:Dimensions.get('window').height> 600? 20:10,
        width:400,
        maxWidth:"90%"
    },
    controls:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:'center',
        width:"80%"
    },
    listContainer:{
        flex:1,
        width:'60%',
        marginBottom: 50,
    },
    listContainerBig:{
        flex:1,
        width:'80%',
    },
    list:{
        flexGrow:1,
        justifyContent:'flex-end',
    },
    listItem:{
        borderColor:'#ccc',
        borderWidth:1,
        padding:15,
        marginVertical:10,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-around',
        width:'100%',

    },
})
export default Game;