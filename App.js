import React,{useState} from 'react';
import { StyleSheet,View,SafeAreaView } from 'react-native';
import Header from './component/header.js';
import Start from './screens/start.js';
import Game from './screens/game.js';
import GameOver from './screens/gameOver.js';


export default function App() {
  const [userNumber,setUserNumber]=useState()
  const [guessRounds,setGuessRounds]=useState(0)

  
  const startGameHandler=(holdValue)=>{
    setUserNumber(holdValue)
  }
  const gameOverHandler=(numOfRounds)=>{
    setGuessRounds(numOfRounds)
  }
  /* 检查下面content的部分，设置让if()中的条件都不满足 */
  const configureNewGameHandler=()=>{
    setGuessRounds(0);
    setUserNumber(null);
  }


  let content=<Start onStartGame={startGameHandler}/>
  if(userNumber&& guessRounds<=0){
    content= (
            <Game 
                userChoice={userNumber} 
                onGameOver={gameOverHandler}
            />)
  }else if(guessRounds>0){
    content=(
            <GameOver 
              userNumber={userNumber} 
              guessRounds={guessRounds} 
              onRestart={configureNewGameHandler}
            />)
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Let Computer to Guess Number"/>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex:1
  }
});
