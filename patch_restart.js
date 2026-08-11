import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('const [gameKey, setGameKey]')) {
  code = code.replace(
    "const [gameState, setGameState] = useState<GameState>('START');",
    "const [gameState, setGameState] = useState<GameState>('START');\n  const [gameKey, setGameKey] = useState<number>(0);"
  );

  code = code.replace(
    "setGameState('PLAYING');",
    "setGameState('PLAYING');\n    setGameKey(k => k + 1);"
  );

  code = code.replace(
    "<HelixGame",
    "<HelixGame key={gameKey}"
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log('patched restart');
