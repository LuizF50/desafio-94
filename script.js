document.addEventListener('DOMContentLoaded', function () {
    // Inicializa a animação do botão
    initButtonAnimation();

    // Adiciona o evento de clique ao botão
    document.getElementById('solve-button').addEventListener('click', solveMaze);
});

function initButtonAnimation() {
    // Seleciona todos os botões com efeito bubble
    const buttons = document.querySelectorAll('.button--bubble');

    buttons.forEach(button => {
        const circlesTopLeft = button.parentNode.querySelectorAll('.circle.top-left');
        const circlesBottomRight = button.parentNode.querySelectorAll('.circle.bottom-right');

        // Configura a animação quando o mouse passa sobre o botão
        button.addEventListener('mouseover', function () {
            // Animação para os círculos no canto superior esquerdo
            circlesTopLeft.forEach((circle, index) => {
                const animation = {
                    x: -25 - (index * 5),
                    y: -25 - (index * 5),
                    scale: index === 1 ? 0.8 : 0.2,
                    opacity: 0,
                    duration: 1,
                    delay: index * 0.1
                };
                TweenMax.to(circle, animation.duration, animation);
            });

            // Animação para os círculos no canto inferior direito
            circlesBottomRight.forEach((circle, index) => {
                const animation = {
                    x: 25 + (index * 5),
                    y: 25 + (index * 5),
                    scale: index === 1 ? 0.8 : 0.2,
                    opacity: 0,
                    duration: 1,
                    delay: index * 0.1
                };
                TweenMax.to(circle, animation.duration, animation);
            });

            // Animação do botão de efeito
            const effectButton = button.parentNode.querySelector('.effect-button');
            TweenMax.to(effectButton, 0.8, { scaleY: 1.1 });
            TweenMax.to(effectButton, 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4), delay: 1.2 });
        });
    });
}

function solveMaze() {
    // Obtém a entrada do usuário
    const mazeInput = document.getElementById('maze-input').value;
    const resultDiv = document.getElementById('result');

    try {
        // Converte a entrada para uma matriz (array 2D)
        const maze = JSON.parse(mazeInput.replace(/'/g, '"'));

        // Valida o labirinto
        if (!isValidMaze(maze)) {
            resultDiv.textContent = 'Labirinto inválido! Certifique-se de que há exatamente um "S" e um "E".';
            return;
        }

        // Encontra o caminho mais curto
        const path = findShortestPath(maze);

        // Exibe o resultado
        if (path.length === 0) {
            resultDiv.textContent = 'Não foi possível encontrar um caminho para sair do labirinto!';
        } else {
            resultDiv.textContent = path.map(coord => `(${coord[0]}, ${coord[1]})`).join(' → ');
        }
    } catch (error) {
        resultDiv.textContent = 'Erro ao processar o labirinto. Certifique-se de que o formato está correto.';
        console.error(error);
    }
}

function isValidMaze(maze) {
    // Verifica se o labirinto é uma matriz válida
    if (!Array.isArray(maze)) return false;

    let startCount = 0;
    let endCount = 0;

    for (let row of maze) {
        if (!Array.isArray(row)) return false;

        for (let cell of row) {
            if (cell === 'S') startCount++;
            if (cell === 'E') endCount++;
        }
    }

    return startCount === 1 && endCount === 1;
}

function findShortestPath(maze) {
    // Encontra a posição inicial 'S' e final 'E'
    let start, end;

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'S') start = [i, j];
            if (maze[i][j] === 'E') end = [i, j];
        }
    }

    // Se não encontrar início ou fim, retorna caminho vazio
    if (!start || !end) return [];

    // BFS (Breadth-First Search) para encontrar o caminho mais curto
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start[0]},${start[1]}`);

    // Direções possíveis: cima, baixo, esquerda, direita
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
        const path = queue.shift();
        const [x, y] = path[path.length - 1];

        // Se chegamos ao fim, retorna o caminho
        if (x === end[0] && y === end[1]) {
            return path;
        }

        // Explora todas as direções possíveis
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            // Verifica se a nova posição é válida
            if (
                newX >= 0 && newX < maze.length &&
                newY >= 0 && newY < maze[0].length &&
                maze[newX][newY] !== '#' &&
                !visited.has(`${newX},${newY}`)
            ) {
                visited.add(`${newX},${newY}`);
                const newPath = [...path, [newX, newY]];
                queue.push(newPath);
            }
        }
    }

    // Se não encontrou caminho, retorna array vazio
    return [];
}