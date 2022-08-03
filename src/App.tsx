import "./App.css";
import { useState, useEffect, MouseEvent } from "react";

function App() {
  const [level, setLevel] = useState(0);
  const [title, setTitle] = useState("Press A Key to Start");
  const [seq, setSeq] = useState([] as string[]);
  const [input, setInput] = useState("");
  const [index, setIndex] = useState(0);
  // Initial configuration
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (level !== 0) return;
      setLevel(1);
      return;
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  // Game logic
  /*Changing level*/
  useEffect(() => {
    // If level is 0, do nothing
    if (level === 0) return;
    // Change level title
    setTitle(`Level ${level}`);
    // generate random color sequence
    const colors = ["red", "blue", "green", "yellow"];
    // add a new color to the sequence
    const rndm = Math.floor(Math.random() * colors.length);
    setSeq([...seq, colors[rndm]]);
  }, [level]);
  /* flashing the sequence*/
  useEffect(() => {
    async function flash() {
      if (level === 0) return;
      // show the sequence on screen
      for (const clr of seq) {
        const sqr = document.querySelector(`#${clr}`);
        if (sqr === null) return;
        sqr.classList.add("flashing");
        setTimeout(() => {
          sqr.classList.remove("flashing");
        }, 200);
        // play the sound of the flashed color
        const audio = new Audio(`src/assets/sounds/${clr}.mp3`);
        audio.play();
        await sleep(500);
      }
      // add the event listener to all the buttons
      const handleClick = (e: any) => {
        const target = e.target as HTMLButtonElement;
        // add the class "pressed" to the pressed button
        target.classList.add("pressed");
        const audio = new Audio(`src/assets/sounds/${target.id}.mp3`);
        audio.play();
        setTimeout(() => {
          target.classList.remove("pressed");
        }, 200);
        // add the color to the input sequence
        setInput(target.id);
        return;
      };
      const buttons = document.querySelectorAll(".btn");
      if (buttons === null) return;
      for (const btn of buttons) {
        btn.addEventListener("click", handleClick);
      }
      return () => {
        for (const btn of buttons) {
          btn.removeEventListener("click", handleClick);
        }
      };
    }
    flash();
  }, [seq]);
  /* checking the input sequence*/
  useEffect(() => {
    async function check() {
      if (level === 0) return;
      if (input.length === 0) return;
      if (seq[index] === input) {
        setIndex(index + 1);
        // if the index is the same as the length of the sequence, the player has won
        if (index + 1 >= level) {
          await sleep(750);
          setLevel(level + 1);
          setIndex(0);
          setInput("");
        }
        return;
      }
      const wrongAudio = new Audio("src/assets/sounds/wrong.mp3");
      wrongAudio.play();
      setTitle("Game Over, restarting in 2 seconds");
      // change body background color to red for 1 second
      const body = document.querySelector("body");
      if (body === null) return;
      body.classList.add("game-over");
      setTimeout(() => {
        body.classList.remove("game-over");
      }, 250);
      setTimeout(() => {
        setLevel(0);
        setSeq([]);
        setInput("");
        setIndex(0);
      }, 2000);
    }
    check();
  }, [input]);

  return (
    <>
      <h1 id="level-title">{title}</h1>
      <div className="container">
        <div className="row">
          <div typeof="button" id="green" className="btn green"></div>

          <div typeof="button" id="red" className="btn red"></div>
        </div>

        <div className="row">
          <div typeof="button" id="yellow" className="btn yellow"></div>
          <div typeof="button" id="blue" className="btn blue"></div>
        </div>
      </div>
    </>
  );
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default App;
