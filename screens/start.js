import React,{useState,useEffect} from 'react';
import {StyleSheet,View,Text,TouchableWithoutFeedback,Keyboard,Alert,Button,Dimensions,ScrollView, KeyboardAvoidingView} from 'react-native';
import Card from '../component/card.js';
import Input from '../component/input.js';
import NumberContainer from '../component/numberContainer.js';
import MainButton from '../component/mainButton.js';
import Colors from '../constants/colors';

const Start=({onStartGame})=>{
    const [enterValue,setEnterValue]=useState('')
    const [confirmed,setConfirmed]=useState(true)
    const [holdValue,setHoldValue]=useState()

    const [buttonWidth, setButtonWidth]=useState(Dimensions.get('window').width/4)
    

    useEffect(()=>{
        const updateLayout=()=>{
            setButtonWidth(Dimensions.get('window').width/4)
        }
        Dimensions.addEventListener('change',updateLayout)
        return ()=>Dimensions.addEventListener('change',updateLayout).remove()
    })

    const numberInputHandler=(e)=>{
        /* replace all not 0-9 globally with an empty string */
        setEnterValue(e.replace(/[^0-9]/g,''))
    }
    const resetInputHandler=()=>{
        setEnterValue("")
        setConfirmed(false)
    }
    const confirmInputHandler=()=>{
        /* isNaN()检查是否为数字 is not a number */
        if(isNaN(parseInt(enterValue)) || parseInt(enterValue)<=0 ||parseInt(enterValue)>99){
            Alert.alert(
                'Invalid number!',
                'Number has to be a number berween 1-99.',
                [{text:'Okay',style:'destructive', onPress:resetInputHandler}])
            return 
        }
        setConfirmed(true)
        /* convert the text to a number */
        setHoldValue(parseInt(enterValue))
        setEnterValue('')
        Keyboard.dismiss()
    }
    
    let confirmedOutput;
    if(confirmed){
        confirmedOutput=(
            <Card style={styles.summaryContainer}>
                <Text>You selected</Text>
                <NumberContainer>{holdValue}</NumberContainer>
                <MainButton onPress={()=>onStartGame(holdValue)}>START GAME</MainButton>
            </Card>
        )
    }

    return (
        <ScrollView>
        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-80}>
        <TouchableWithoutFeedback onPress={()=>{
            Keyboard.dismiss();
        }}>
        <View style={styles.screen}>
            <Text style={styles.title}>Start A New Game</Text>
            <Card style={styles.inputContainer}>
                <Text>Select a Number</Text>
                <Input 
                    value={enterValue} 
                    onChangeText={numberInputHandler}
                    style={styles.input} 
                    autoCorrect={false} 
                    blurOnSubmit 
                    autoCapitalize="none" 
                    keyboardType="number-pad" 
                    maxLength={2}
                />
                <View style={styles.buttonContainer}>
                    <View style={{width:buttonWidth}}><Button title="Reset" onPress={resetInputHandler} color={Colors.accent}/></View>
                    <View style={{width:buttonWidth}}><Button title="Confirm" onPress={confirmInputHandler} color={Colors.primary}/></View>  
                </View>  
            </Card>
            {confirmedOutput}
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles=StyleSheet.create({
    screen:{
        flex:1,
        padding:10,
        alignItems:"center",
        justifyContent:"flex-start"
    },
    title:{
        fontSize:20,
        marginVertical:10,
    },
    inputContainer:{
        width:"80%",
        maxWidth:"95%",
        minWidth:300,
        alignItems:"center",
    },
    buttonContainer:{
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between",
        paddingHorizontal:15,
    },
    /* button:{
        /* find how many px validable on the width */
        /* only runs once when the app start 所以当屏幕转动的时候会不对劲 */
     /*    width:Dimensions.get('window').width/4
    }, */ 
    input:{
        width:50,
        textAlign:"center",
    },
    summaryContainer:{
        marginTop:20,
        alignItems:'center',

    }
})
export default Start;