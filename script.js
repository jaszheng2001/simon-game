/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//Global Variables and Constants
const easyBtn = document.getElementById("easyBtn");
const medBtn = document.getElementById("medBtn");
const hardBtn = document.getElementById("hardBtn");
const stopBtn = document.getElementById("stopBtn")
let pattern = [];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let guessCounter = 0;
const volume = 0.5;
let clueHoldTime = 300; //how long the clues plays for in ms
let cluePauseTime = 400; //how long to pause in between clues
let nextClueWaitTime = 600; //how long to wait before starting playback of the clue sequence

// Game Start and Stop Control
function startGame(difficulty) {
  //initialize game variables
  let arrLen = 0;
  progress = 0;
  guessCounter = 0;
  gamePlaying = true;
  pattern = [];
  clueHoldTime = 300;
  cluePauseTime = 400;
  nextClueWaitTime = 600;
  
  //Customize game setting based on difficulty
  switch (difficulty){
    case "easy":
      arrLen = 8;
      break;
    case "medium":
      arrLen = 12;
      clueHoldTime -= 50;
      cluePauseTime -= 100;
      nextClueWaitTime -= 100;
      break;
    case "hard":
      arrLen = 16;
      clueHoldTime -= 100;
      cluePauseTime -= 200;
      nextClueWaitTime -= 200;
  }
  //Randomize the pattern 
  for (let i = 0; i < arrLen; i++){
    pattern.push(Math.ceil(Math.random() * 4))
  }
  // swap the Start and Stop buttons
  easyBtn.classList.add("hidden");
  medBtn.classList.add("hidden");
  hardBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  //Initialize game variable
  gamePlaying = false;
  easyBtn.classList.remove("hidden");
  medBtn.classList.remove("hidden");
  hardBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

// Button Lighting Controls 
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost!");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  if(!gamePlaying){
    return;
  }
  // Game Logic
  if (btn != pattern[guessCounter]) loseGame();
  else {
    if (guessCounter == progress){
      if (progress == pattern.length - 1) winGame();
      else{
        guessCounter = 0
        progress++;
        playClueSequence();
      }
    } else{
      guessCounter++;
    }
  }
}

