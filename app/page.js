'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { TagCloud } from '@frank-mayer/react-tag-cloud';
let i = 0;
let level = 1;
let numberOfWords = 2;
export default function Home() {
  const [word, setWord] = useState(null);

  const [correctPresses, setCorrectPresses] = useState(0);
  const [incorrectPresses, setIncorrectPresses] = useState(0);
  const [curWord, setCurWord] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [accuracy, setAccuracy] = useState(0.0);
  const [pressedKey, setPressedKey] = useState('');
  const [validClass, setValidClass] = useState('text-blue-600');

  useEffect(() => {
    const keyDownHandler = (e) => {
      const key = e.key.toLowerCase();

      if (key >= 'a' && key <= 'z') {
        setPressedKey(key);
        let checkAlpha = curWord[0];

        if (curWord.length > 0 && key == checkAlpha) {
          setCorrectPresses(correctPresses + 1);

          word[i] = curWord.slice(1, curWord.length);
          setValidClass('text-green-500');
          if (curWord.length == 1 && key == checkAlpha) {
            i++;
            setValidClass('text-blue-600');
            if (i == numberOfWords) {
              level++;
              numberOfWords += 3;
              fetchWord();
              i = 0;
            }
          }

          setCurWord(word[i]);
          setNextWord(word[i + 1]);
        } else if (curWord.length > 0 && key != checkAlpha) {
          setIncorrectPresses(incorrectPresses + 1);
          setValidClass('text-red-500');
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
      `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`
    );
    let randomWord = await response.json();

    setWord(randomWord);
    setCurWord(randomWord[0]);
    setNextWord(randomWord[1]);
  }

  const options = {
    maxSpeed: 'fast',
  };

  return (
    <>
      {' '}
      {word && (
        <div className='h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
          <h1 className='text-2xl uppercase'>Level {level}</h1>
          <TagCloud
            options={options}
            className='text-sm uppercase text-gray-500 -z-20'
            onClickOptions={{ passive: true }}>
            {word}
          </TagCloud>
          <div className='flex items-center justify-center space-x-7'>
            {/* <h1 className='text-5xl font-bold uppercase text-blue-600'>
              {curWord.split('').map((character) => (
                <div key={Math.random()} className={`inline ${validClass}`}>
                  {character}
                </div>
              ))}
            </h1> */}

            <h1 className={`text-5xl font-bold uppercase  ${validClass}`}>
              {curWord}
            </h1>
          </div>
          {nextWord && (
            <h1 className={`text-[15px] font-thin uppercase text-gray-500 `}>
              {' '}
              next - {nextWord}
            </h1>
          )}

          {/* <div className='flex items-center justify-center space-x-7'>
            <h2>
              You pressed:{' '}
              <span className='text-xl font-semibold uppercase text-blue-400'>
                {pressedKey}
              </span>
            </h2>
          </div> */}
          <div className='flex items-center justify-center space-x-10'>
            <div className='px-10 py-10'>
              <p>Correct keys pressed</p>
              <h1 className=' uppercase text-green-500'>{correctPresses}</h1>
            </div>
            <div className='px-10 py-10'>
              <p>Incorrect keys pressed</p>

              <h1 className=' uppercase text-red-500'>{incorrectPresses}</h1>
            </div>
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
