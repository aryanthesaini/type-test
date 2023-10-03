'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { TagCloud } from '@frank-mayer/react-tag-cloud';
export default function Home() {
  const [word, setWord] = useState('water');

  const [success, setSuccess] = useState('');
  const [correctPresses, setCorrectPresses] = useState(0);
  const [incorrectPresses, setIncorrectPresses] = useState(0);

  useEffect(() => {
    const keyDownHandler = (e) => {
      const key = e.key.toLowerCase();
      if (key >= 'a' && key <= 'z') {
        let checkAlpha = word[0];
        if (word.length == 1 && key == checkAlpha) {
          setCorrectPresses(correctPresses + 1);
          setWord('');
          setSuccess('Good');
          fetchWord();
        } else if (word.length > 0 && key == checkAlpha) {
          setCorrectPresses(correctPresses + 1);
          let curWord = word.slice(1, word.length);
          setWord(curWord);
        } else {
          setIncorrectPresses(incorrectPresses + 1);
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  async function fetchWord() {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?number=10'
    );
    let randomWord = await response.json();
    setSuccess(false);
    setWord(randomWord[0]);
  }

  const options = {
    maxSpeed: 'fast',
  };
  return (
    <div className='h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
      <TagCloud
        options={options}
        className='text-5xl uppercase text-white'
        onClickOptions={{ passive: true }}>
        {[word]}
      </TagCloud>

      <h1 className='text-2xl uppercase text-green-500'>{correctPresses}</h1>
      <h1 className='text-2xl uppercase text-red-500'>{incorrectPresses}</h1>
    </div>
  );
}
