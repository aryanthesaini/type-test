'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { TagCloud } from '@frank-mayer/react-tag-cloud';
let i = 0;
export default function Home() {
  const [word, setWord] = useState(null);

  const [success, setSuccess] = useState('');
  const [correctPresses, setCorrectPresses] = useState(0);
  const [incorrectPresses, setIncorrectPresses] = useState(0);
  const [curWord, setCurWord] = useState('');
  const [accuracy, setAccuracy] = useState(0.0);

  useEffect(() => {
    const keyDownHandler = (e) => {
      const key = e.key.toLowerCase();

      if (key >= 'a' && key <= 'z') {
        // console.log(curWord);
        let checkAlpha = curWord[0];

        if (curWord.length > 0 && key == checkAlpha) {
          setCorrectPresses(correctPresses + 1);

          word[i] = curWord.slice(1, curWord.length);
          if (curWord.length == 1 && key == checkAlpha) {
            i++;
            if (i == 20) {
              fetchWord();
              i = 0;
            }
          }
          setCurWord(word[i]);
        } else if (curWord.length > 0 && key != checkAlpha) {
          setIncorrectPresses(incorrectPresses + 1);
        }

        setAccuracy(
          (correctPresses / (correctPresses + incorrectPresses)) * 100
        );
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  useEffect(() => {
    fetchWord();
  }, []);

  async function fetchWord() {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?number=20'
    );
    let randomWord = await response.json();

    setWord(randomWord);
    setCurWord(randomWord[0]);
  }

  const options = {
    maxSpeed: 'medium',
  };
  return (
    <>
      {' '}
      {word && (
        <div className='h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
          <TagCloud
            options={options}
            className='text-sm uppercase text-gray-500'
            onClickOptions={{ passive: true }}>
            {word}
          </TagCloud>

          <div className='flex items-center justify-center space-x-7'>
            <h1 className='text-5xl font-bold uppercase text-blue-600'>
              {curWord}
            </h1>
          </div>
          <div className='flex items-center justify-center space-x-7'>
            <p>Correct keys pressed</p>
            <h1 className='text-2xl uppercase text-green-500'>
              {correctPresses}
            </h1>
          </div>
          <div className='flex items-center justify-center space-x-7'>
            <p>Incorrect keys pressed</p>

            <h1 className='text-2xl uppercase text-red-500'>
              {incorrectPresses}
            </h1>
          </div>

          <div className='flex items-center justify-center space-x-7'>
            <p>Accuracy: </p>

            <h1 className='text-2xl uppercase text-gray-300'>
              {accuracy.toFixed(2)}%
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
