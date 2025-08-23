const COLORS = [
  "#00fc54af", // салатово-зелений
  "#0000FF", // синій
  "#00BFFF", // голубий
  "#FFFF00", // жовтий
  "#800080", // фіолетовий
  "#ffa60090", // оранжевий
  "#FF6347", // червоний (рідкісний бонусний)
];

const getRandomColor = () => {
  const rareChance = Math.random();
  if (rareChance < 0.05) return COLORS[6];
  return COLORS[Math.floor(Math.random() * 6)];
};

// генерація випадкових фігур
export const generateShapes = (count = 3) => {
  const templates = [
    [
      [1, 1],
      [1, 1],
    ], // квадрат 2x2
    [[1, 1, 1]], // лінія горизонт
    [[1], [1], [1]], // лінія вертик
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // Z-подібна
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ], // L-подібна
  ];
  const shapes = [];
  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const shape = template.map(row =>
      row.map(cell => (cell ? getRandomColor() : null))
    );
    shapes.push(shape);
  }
  return shapes;
};

// перевірка повних рядків і стовпців
export const checkFullLines = board => {
  const size = board.length;
  const fullRows = [];
  const fullCols = [];

  for (let r = 0; r < size; r++) {
    if (board[r].every(cell => cell !== null)) fullRows.push(r);
  }
  for (let c = 0; c < size; c++) {
    if (board.every(row => row[c] !== null)) fullCols.push(c);
  }
  return { fullRows, fullCols };
};

// очищення
export const clearLines = (board, fullRows, fullCols) => {
  const newBoard = board.map(row => [...row]);
  fullRows.forEach(r => newBoard[r].fill(null));
  fullCols.forEach(c => newBoard.forEach(row => (row[c] = null)));
  return newBoard;
};
