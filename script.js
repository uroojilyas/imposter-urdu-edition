// Game Categories with Urdu words
const categories = {
    fruits: {
        name: 'پھل',
        words: ['آم', 'کیلا', 'سیب', 'انگور', 'سنترہ', 'امرود', 'خربوزہ', 'تربوز', 'آڑو', 'ناشپاتی', 'آلوچہ', 'انار', 'کینو', 'لیچی', 'پپیتا']
    },
    animals: {
        name: 'جانور',
        words: ['شیر', 'بلی', 'کتا', 'ہاتھی', 'گھوڑا', 'اونٹ', 'بھیڑیا', 'لومڑی', 'ہرن', 'خرگوش', 'بندر', 'زرافہ', 'دریائی گھوڑا', 'چیتا', 'ریچھ']
    },
    professions: {
        name: 'پیشے',
        words: ['ڈاکٹر', 'استاد', 'پولیس', 'شیف', 'انجینئر', 'پائلٹ', 'وکیل', 'فنکار', 'کسان', 'دکاندار', 'ڈرائیور', 'فوٹوگرافر', 'صحافی', 'مکینک', 'درزی']
    },
    cities: {
        name: 'شہر',
        words: ['کراچی', 'لاہور', 'اسلام آباد', 'پشاور', 'کوئٹہ', 'ملتان', 'فیصل آباد', 'راولپنڈی', 'حیدرآباد', 'سکھر', 'گوجرانوالہ', 'بہاولپور', 'سیالکوٹ', 'مری', 'سوات']
    },
    vehicles: {
        name: 'گاڑیاں',
        words: ['کار', 'بس', 'ٹرین', 'موٹر سائیکل', 'سائیکل', 'رکشہ', 'ٹرک', 'ہوائی جہاز', 'کشتی', 'ہیلی کاپٹر', 'ٹینک', 'ٹریکٹر', 'اسکوٹر', 'وان', 'راکٹ']
    },
    sports: {
        name: 'کھیل',
        words: ['کرکٹ', 'فٹ بال', 'ہاکی', 'بیڈمنٹن', 'ٹینس', 'کبڈی', 'والی بال', 'باکسنگ', 'تیراکی', 'کشتی', 'کیرم', 'شطرنج', 'لوڈو', 'باسکٹ بال', 'گولف']
    }
};

// Game State
let players = [];
let gameData = {
    secretWord: '',
    category: '',
    imposters: [],
    normalPlayers: [],
    impostersCount: 1,
    currentPlayerIndex: 0
};

// Add Player
function addPlayer() {
    const input = document.getElementById('playerNameInput');
    const playerName = input.value.trim();

    if (playerName === '') {
        alert('براہ کرم کھلاڑی کا نام درج کریں');
        return;
    }

    if (players.includes(playerName)) {
        alert('یہ کھلاڑی پہلے سے موجود ہے');
        return;
    }

    players.push(playerName);
    input.value = '';
    updatePlayersList();
}

// Update Players List Display
function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    
    if (players.length === 0) {
        playersList.innerHTML = '<p class="info-text">ابھی تک کوئی کھلاڑی شامل نہیں ہوا</p>';
        return;
    }

    let html = '';
    players.forEach((player, index) => {
        html += `
            <div class="player-item">
                <span>${index + 1}. ${player}</span>
                <button class="remove-btn" onclick="removePlayer(${index})">ہٹائیں</button>
            </div>
        `;
    });

    playersList.innerHTML = html;
}

// Remove Player
function removePlayer(index) {
    players.splice(index, 1);
    updatePlayersList();
}

// Start Game
function startGame() {
    // Validation
    if (players.length < 3) {
        alert('کم از کم 3 کھلاڑی درکار ہیں');
        return;
    }

    const impostersCount = parseInt(document.getElementById('impostersCount').value);
    
    if (impostersCount >= players.length) {
        alert('امپوسٹرز کی تعداد کل کھلاڑیوں سے کم ہونی چاہیے');
        return;
    }

    // Get all selected categories
    const selectedCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    
    if (selectedCheckboxes.length === 0) {
        alert('براہ کرم کم از کم ایک زمرہ منتخب کریں');
        return;
    }

    // Combine all words from selected categories
    let allWords = [];
    let categoryNames = [];
    
    selectedCheckboxes.forEach(checkbox => {
        const categoryKey = checkbox.value;
        const category = categories[categoryKey];
        allWords = allWords.concat(category.words);
        categoryNames.push(category.name);
    });

    // Select random word from combined pool
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    
    // Create category display text
    const categoryDisplay = categoryNames.join('، ');

    // Assign roles
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const imposters = shuffledPlayers.slice(0, impostersCount);
    const normalPlayers = shuffledPlayers.slice(impostersCount);

    // Update game data
    gameData = {
        secretWord: randomWord,
        category: categoryDisplay,
        imposters: imposters,
        normalPlayers: normalPlayers,
        impostersCount: impostersCount,
        currentPlayerIndex: 0
    };

    // Switch to reveal screen
    switchScreen('revealScreen');
    showCurrentPlayer();
}

// Switch between screens
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Show current player name
function showCurrentPlayer() {
    const currentPlayer = players[gameData.currentPlayerIndex];
    document.getElementById('currentPlayerName').textContent = `کھلاڑی: ${currentPlayer}`;
    
    // Reset reveal state
    document.getElementById('revealBtn').classList.remove('hidden');
    document.getElementById('roleDisplay').classList.add('hidden');
    document.getElementById('nextPlayerBtn').classList.add('hidden');
    document.getElementById('finishRevealBtn').classList.add('hidden');
    
    // Show instruction
    document.querySelector('.instruction').classList.remove('hidden');
}

// Reveal role
function revealRole() {
    const currentPlayer = players[gameData.currentPlayerIndex];
    const roleDisplay = document.getElementById('roleDisplay');
    const roleContent = document.getElementById('roleContent');
    
    // Check if player is imposter
    const isImposter = gameData.imposters.includes(currentPlayer);
    
    if (isImposter) {
        roleDisplay.className = 'role-display role-imposter';
        roleContent.innerHTML = `
            <div class="imposter-text">آپ امپوسٹر ہیں 😈</div>
        `;
    } else {
        roleDisplay.className = 'role-display role-normal';
        roleContent.innerHTML = `
            خفیہ لفظ:
            <span class="secret-word">${gameData.secretWord}</span>
        `;
    }
    
    // Hide reveal button and instruction
    document.getElementById('revealBtn').classList.add('hidden');
    document.querySelector('.instruction').classList.add('hidden');
    
    // Show role display
    roleDisplay.classList.remove('hidden');
    
    // Show appropriate next button
    if (gameData.currentPlayerIndex < players.length - 1) {
        document.getElementById('nextPlayerBtn').classList.remove('hidden');
    } else {
        document.getElementById('finishRevealBtn').classList.remove('hidden');
    }
}

// Next player
function nextPlayer() {
    gameData.currentPlayerIndex++;
    showCurrentPlayer();
}

// Finish reveal and start game
function finishReveal() {
    // Update game screen info
    document.getElementById('totalPlayersDisplay').textContent = players.length;
    document.getElementById('impostersDisplay').textContent = gameData.impostersCount;
    document.getElementById('categoryDisplay').textContent = gameData.category;
    
    // Switch to game screen
    switchScreen('gameScreen');
}

// Reset game
function resetGame() {
    if (confirm('کیا آپ واقعی نیا گیم شروع کرنا چاہتے ہیں؟')) {
        players = [];
        gameData = {
            secretWord: '',
            category: '',
            imposters: [],
            normalPlayers: [],
            impostersCount: 1,
            currentPlayerIndex: 0
        };
        
        updatePlayersList();
        switchScreen('setupScreen');
    }
}

// Allow Enter key to add player
document.addEventListener('DOMContentLoaded', function() {
    const playerInput = document.getElementById('playerNameInput');
    playerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addPlayer();
        }
    });
});