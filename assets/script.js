"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = ["#5468e7", "#e94c2b"];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme);
}

// Set random theme.
setTheme();

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Default values.
let grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let iconPositions = [{ x: 70, y: 110 }, { x: 210, y: 110 }, { x: 350, y: 110 }, { x: 70, y: 250 }, { x: 210, y: 250 }, { x: 350, y: 250 }, { x: 70, y: 390 }, { x: 210, y: 390 }, { x: 350, y: 390 }];
let combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let lines = [[20, 70, 400, 70], [20, 210, 400, 210], [20, 350, 400, 350], [70, 20, 70, 400], [210, 20, 210, 400], [350, 20, 350, 400], [20, 20, 400, 400], [400, 20, 20, 400]];
let userInput = 1;
let pause = false;
let playerZ = { human: true, score: 0 };
let playerX = { human: true, score: 0 };


// Switch player choose between human and computer.
function switchPlayer() {
    grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    showGrid();
    if (playerX.human) {
        // Player x to human.
        playerX.human = false;
        document.getElementById("switchButton_ID").innerText = "Play with human";
        return;
    }
    playerX.human = true;
    document.getElementById("switchButton_ID").innerText = "Play with computer";
}

// Reset game function.
function resetGame() {
    userInput = 1;
    // Show score on board.
    document.getElementById("playerZScore_ID").innerText = playerZ.score;
    document.getElementById("playerXScore_ID").innerText = playerX.score;
    pause = true;
    setTimeout(function () {
        // Show grid after 1 second.
        grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        showGrid();
        pause = false;
    }, 1000);
}

// Show grid function shows grid on canvas.
function showGrid() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 9; i++) {
        if (grid[i] == -1) {
            // Show cross icon.
            ctx.font = `300 100px "Font Awesome 5 Pro"`;
            ctx.fillStyle = colorTheme;
            ctx.textAlign = 'center';
            ctx.fillText("\uf00d", iconPositions[i].x, iconPositions[i].y);
        } else if (grid[i] == 1) {
            // Show zero icon.
            ctx.font = `300 90px "Font Awesome 5 Pro"`;
            ctx.fillStyle = colorTheme;
            ctx.textAlign = 'center';
            ctx.fillText("\uf111", iconPositions[i].x, iconPositions[i].y);
        }
    }
}

// Add user input function.
function addUserInput(x, y) {
    let r = 1;
    let c = 1;
    if (pause) { 
        return; }
    for (let i = 0; i < 9; i++) {
        if (x > ((r * 140) - 140) && x < r * 140 && y > ((c * 140) - 140) && y < c * 140) {
            if (grid[i] == 0) {
                grid[i] = userInput;
                if (checkGrid(userInput)) {
                    return;
                }
                if (playerX.human == false) {
                    makeMove();
                    checkGrid(-1);
                } else {
                    userInput *= -1;
                }
                return;
            }
        }
        r++;
        if ((i + 1) % 3 == 0) {
            c++;
            r = 1;
        }
    }
}

// Analyze grid checks if someone won or not.
function checkGrid(player) {
    showGrid();
    let count = 1;
    for (let c = 0; c < 8; c++) {
        count = 1;
        for (let i = 0; i < 2; i++) {
            if (grid[combinations[c][i]] != 0) {
                if (grid[combinations[c][i]] == grid[combinations[c][i + 1]]) {
                    count += 1;
                }
            }
        }
        if (count == 3) {
            showLine(c);
            // Won.
            if (player == 1) {
                playerZ.score++;
            } else {
                playerX.score++;
            }
            resetGame();
            return true;
        } else {
            count = 1;
        }
    }
    if (grid.includes(0) == false) {
        resetGame();
        return true;
    }
    return false;
}

// Make move function makes computer move.
function makeMove() {
    let priority = [-1, -1, -1];
    let count = 0;
    for (let c = 0; c < 8; c++) {
        count = 0;
        for (let i = 0; i < 3; i++) {
            if (grid[combinations[c][i]] == -1) {
                count += 1;
            } else if (grid[combinations[c][i]] == 1) {
                count -= 1;
            }
        }
        if (count == 2) {
            priority[0] = c;
            break;
        }
        if (count == -2) {
            priority[1] = c;
        }
        if (count == 1) {
            priority[2] = c;
        }
    }
    if (priority[0] != -1) {
        for (let c = 0; c < 3; c++) {
            if (grid[combinations[priority[0]][c]] == 0) {
                grid[combinations[priority[0]][c]] = -1;
                return;
            }
        }
    } else if (priority[1] != -1) {
        for (let c = 0; c < 3; c++) {
            if (grid[combinations[priority[1]][c]] == 0) {
                grid[combinations[priority[1]][c]] = -1;
                return;
            }
        }
    } else if (priority[2] != -1) {
        for (let c = 0; c < 3; c++) {
            if (grid[combinations[priority[2]][c]] == 0) {
                grid[combinations[priority[2]][c]] = -1;
                return;
            }
        }
    } else {
        if (grid.includes(-1) == false) {
            grid[Math.floor(Math.random() * 9)] = -1;
        } else {
            for (let g = 0; g < 9; g++) {
                if (grid[g] == 0) {
                    grid[g] = -1;
                    return;
                }
            }
        }
    }
}

// Show line function.
function showLine(index) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(lines[index][0], lines[index][1]);
    ctx.lineTo(lines[index][2], lines[index][3]);
    ctx.strokeStyle = "#666";
    ctx.stroke();
}

// Add input function.
canvas.addEventListener("mousedown", function (e) {
    addUserInput(e.offsetX, e.offsetY);
});


