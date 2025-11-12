let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let ur = document.getElementById('ur')
let scoreColor = document.getElementById('sbColor')
let score = document.getElementById('score');
let wrapper = document.getElementById('wrapper');
let widthBase = scoreColor.offsetWidth;
let currentPP = document.getElementById("ppCurent");
let ifFC = document.getElementById("ppIfFc");
let pp = document.getElementById("pp");
let ppContainer = document.getElementById("ppCurent");
let bpmContainer = document.getElementById("bpmdata");
let csStat = document.getElementById("csStat");
let arStat = document.getElementById("arStat");
let starStat = document.getElementById("starStat");
let mapContainer = document.getElementById("mapdata");
let mapContainer2 = document.getElementById("mapdata2");
let comboContainer = document.getElementById("combodata");
let accContainer = document.getElementById("accdata");
let timer = document.getElementById('timer');
let rank = document.getElementById('rank');
let bg = document.getElementById("bg");
let modsContainer = document.getElementById("mods");
let nowPlayingContainer = document.getElementById("nowPlaying");

// Variables para el efecto de opacidad del combo
let lastComboMilestone = 0;
let isOpacityAnimating = false;

// Variables para animación de combo tipo casino
let targetCombo = 0;
let currentDisplayCombo = 0;
let comboAnimationId = null;

// Variables para animación de accuracy tipo casino
let targetAcc = 0;
let currentDisplayAcc = 0;
let accAnimationId = null;

// Variables para animación de score tipo casino
let targetScore = 0;
let currentDisplayScore = 0;
let scoreAnimationId = null;

// Variables para animación de PP tipo casino
let targetPP = 0;
let currentDisplayPP = 0;
let ppAnimationId = null;

// Variables para animación de PP If FC tipo casino
let targetPPIfFC = 0;
let currentDisplayPPIfFC = 0;
let ppIfFCAnimationId = null;

// Variables para animación de hits tipo casino
let target300s = 0;
let currentDisplay300s = 0;
let hits300AnimationId = null;

let target100s = 0;
let currentDisplay100s = 0;
let hits100AnimationId = null;

let target50s = 0;
let currentDisplay50s = 0;
let hits50AnimationId = null;

let targetSB = 0;
let currentDisplaySB = 0;
let hitsSBAnimationId = null;

let targetMiss = 0;
let currentDisplayMiss = 0;
let hitsMissAnimationId = null;

//score.innerHTML = '0'.padStart(8,"0")

socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};


let animation = {
    acc:  new CountUp('accdata', 0, 0, 2, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
    combo:  new CountUp('combodata', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: "", decimal: "." }),
    ur: new CountUp('ur', 0, 0, 2, 1, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
    pp: new CountUp('ppCurent', 0, 0, 0, .2, {useEasing: true, useGrouping: true,   separator: " ", decimal: "." }),
}

let tempState;
let tempTime;
let tempTimeMax;
let tempImg;

let modImages = {
    "HR": "selection-mod-hardrock.png",
    "HD": "selection-mod-flashlight.png",
    "DT": "selection-mod-doubletime.png",
    "FL": "selection-mod-relax.png",
    "HT": "selection-mod-halftime.png",
    "EZ": "selection-mod-easy.png",
    "NF": "selection-mod-nofail.png",
    "SD": "selection-mod-suddendeath.png",
    "RX": "selection-mod-autopilot.png",
    "PF": "selection-mod-perfect.png",
    "SO": "selection-mod-spunout.png"
    // Agrega aquí más nombres de archivos de imágenes para otros mods si es necesario
};

socket.onmessage = event => {  
    let data = JSON.parse(event.data);
    if (data.settings.showInterface) {
        wrapper.style.display = 'none';
      } else {
        wrapper.style.display = 'block';

    if(tempState !== data.menu.state){
        tempState = data.menu.state;
        if(tempState == 2 ){
            wrapper.style.opacity = 1;
        }
        else{
            wrapper.style.opacity = 0;
        }
    }
    if(data.gameplay.hp.smooth != "" || data.gameplay.hp.smooth != null || data.gameplay.hp.smooth != undefined){
        let step = widthBase/200;
        scoreColor.style.width = step * data.gameplay.hp.smooth +'px'
    }
    // Dentro de la función socket.onmessage

    if (data.gameplay.score != -1) {
        // Animar el score con efecto tipo casino
        animateScoreToCasino(data.gameplay.score);
    }

    if (data.gameplay.accuracy !== "") {
        let accValue = parseFloat(data.gameplay.accuracy);
        // Animar el accuracy con efecto tipo casino
        animateAccToCasino(accValue);
    }
    
    if (data.gameplay.combo.current !== "") {
        let currentCombo = data.gameplay.combo.current;
        
        // Verificar si el combo es múltiplo de 50 y no hemos animado para este milestone
        let currentMilestone = Math.floor(currentCombo / 50) * 50;
        if (currentCombo >= 50 && currentMilestone > lastComboMilestone && !isOpacityAnimating) {
            lastComboMilestone = currentMilestone;
            triggerOpacityEffect();
        }
        
        // Resetear el milestone si el combo baja (por ejemplo, por un miss)
        if (currentCombo < lastComboMilestone) {
            lastComboMilestone = Math.floor(currentCombo / 50) * 50;
        }
        
        // Animar el combo con efecto tipo casino
        animateComboToCasino(currentCombo);
    }

    // Animar todos los hits con efecto tipo casino
    if (data.gameplay.hits && data.gameplay.hits["300"] !== undefined && data.gameplay.hits["300"] !== null) {
        animate300sToCasino(data.gameplay.hits["300"]);
    }

    if (data.gameplay.hits && data.gameplay.hits["100"] !== undefined && data.gameplay.hits["100"] !== null) {
        animate100sToCasino(data.gameplay.hits["100"]);
    }
    
    if (data.gameplay.hits && data.gameplay.hits["50"] !== undefined && data.gameplay.hits["50"] !== null) {
        animate50sToCasino(data.gameplay.hits["50"]);
    }
    
    if (data.gameplay.hits && data.gameplay.hits.sliderBreaks !== undefined && data.gameplay.hits.sliderBreaks !== null) {
        animateSBToCasino(data.gameplay.hits.sliderBreaks);
    }
    
    if (data.gameplay.hits && data.gameplay.hits["0"] !== undefined && data.gameplay.hits["0"] !== null) {
        animateMissToCasino(data.gameplay.hits["0"]);
    }

    if (data.gameplay.hits.grade.current !== undefined && data.gameplay.hits.grade.current !== null) {
        let currentRank = data.gameplay.hits.grade.current;
        if (currentRank === "SS") {
            currentRank = "X";
        }
        if (data.menu.mods.str.includes("HD") || data.menu.mods.str.includes("FL")){
            if (currentRank === "S") {
                currentRank = "SH";
            }
            if (currentRank === "X") {
                currentRank = "XH";
            }
        }
        let rankImage = document.createElement("img");
        rankImage.src = `skin/ranking-${currentRank}.png`;
        rankImage.alt = currentRank;
        rankImage.classList.add("rank-image");
        rank.innerHTML = "";
        rank.appendChild(rankImage);
    }

    if (data.menu.mods.str !== null) {
        let mods = data.menu.mods.str;
        let modImageContainer = document.createElement("div"); // Crear un contenedor para las imágenes de los mods
        
        // Lista de modificadores posibles con su correspondiente ruta de imagen
        let modMap = {
            "HD": "skin/selection-mod-hidden.png",
            "HR": "skin/selection-mod-hardrock.png",
            "DT": "skin/selection-mod-doubletime.png",
            "NC": "skin/selection-mod-nightcore.png",
            "FL": "skin/selection-mod-flashlight.png",
            "HT": "skin/selection-mod-halftime.png",
            "EZ": "skin/selection-mod-easy.png",
            "NF": "skin/selection-mod-nofail.png",
            "SD": "skin/selection-mod-suddendeath.png",
            "RX": "skin/selection-mod-relax.png",
            "AP": "skin/selection-mod-relax2.png",
            "PF": "skin/selection-mod-perfect.png",
            "SO": "skin/selection-mod-spunout.png",
            "AT": "skin/selection-mod-autoplay.png",
        };
        
        // Iterar sobre cada modificador en modMap
        for (let mod in modMap) {
            if (mods.includes(mod)) { // Verificar si mods contiene el modificador actual
                let modImage = document.createElement("img"); // Crear un elemento img para el modificador actual
                modImage.src = modMap[mod]; // Establecer la ruta de la imagen del modificador
                modImage.classList.add("mod-image"); // Agregar la clase para el tamaño de la imagen
                modImageContainer.appendChild(modImage); // Agregar la imagen del modificador al contenedor
            }
        }
    
        // Limpiar el contenido existente del contenedor de mods antes de añadir las nuevas imágenes
        modsContainer.innerHTML = "";
    
        // Añadir el contenedor de imágenes de modificador al contenedor de mods
        modsContainer.appendChild(modImageContainer);
    }
    // mostrar metadata del mapa en formato {artist} - {title} [{version}] en el contenedor nowPlaying
    if (data.menu.bm.metadata.artist != '') {
        nowPlayingContainer.textContent = `♫ ${data.menu.bm.metadata.artist} - ${data.menu.bm.metadata.title} [${data.menu.bm.metadata.difficulty}] mapped by ${data.menu.bm.metadata.mapper}`;
    }

    if (data.gameplay.hits.unstableRate != '') {
        animation.ur.update(data.gameplay.hits.unstableRate)
    } else {
        animation.ur.update(0)
    }
    if(data.gameplay.pp.current != ''){
        // Animar el PP con efecto tipo casino
        animatePPToCasino(data.gameplay.pp.current);
    }else{
        currentPP.innerHTML = "0";
    }

    if(data.gameplay.pp.fc != ''){
        // Animar el PP If FC con efecto tipo casino
        animatePPIfFCToCasino(data.gameplay.pp.fc);
    }else{
        ifFC.innerHTML = "0";
    }
    
    if(tempState !== data.menu.state){
        tempState = data.menu.state;
        if(tempState == 2 || tempState == 7 || tempState == 1){
            pp.style.bottom = 210+'px'
            pp.style.color = 'rgba(199, 199, 199, 0.8);'
        }
        else{
            pp.style.bottom = 100+'px'
            pp.style.color = 'rgba(199, 199, 199, 0);'
        }
    }
        if (data.menu.state !== tempState) {
        tempState = data.menu.state
        if (tempState !== 2) {
            timer.style.opacity = 0;
        } else {
            timer.style.opacity = 1;
        }
    }
    if (data.menu && data.menu.bm && data.menu.bm.stats && data.menu.bm.stats.BPM) {
        let bpmmin = data.menu.bm.stats.BPM.min;
        let bpmmax = data.menu.bm.stats.BPM.max;
    
        if (bpmmin === bpmmax) {
            bpmContainer.textContent = `${bpmmin} BPM`;
        } else {
            bpmContainer.textContent = `${bpmmin} - ${bpmmax} BPM`;
        }
    }

    if (data.menu && data.menu.bm && data.menu.bm.stats) {
        let csStatValue = data.menu.bm.stats.CS;
        let arStatValue = data.menu.bm.stats.AR;
        let starStatValue = data.menu.bm.stats.fullSR.toFixed(2);
    
        csStat.textContent = `CS ${csStatValue}`;
        arStat.textContent = `AR ${arStatValue}`;
        starStat.textContent = `${starStatValue}☆`;
    }
    let opacity = data.menu.mods.str.includes("FL") ? 0 : 0.05;
    
    // No cambiar la opacidad si está en animación
    if (!isOpacityAnimating) {
        bg.style.opacity = opacity;
    }

    if(tempTime !== data.menu.bm.time.current || tempTimeMax !== data.menu.bm.time.full) {
        tempTime = data.menu.bm.time.current;
        if(tempTimeMax !== data.menu.bm.time.full) {
            tempTimeMax = data.menu.bm.time.full;
        }
        time = (tempTime / tempTimeMax) * 100;
        timeString = time.toString();
        style = "conic-gradient(#999999 " + timeString + "%, rgba(0,0,0,0) 0)";
        timer.style.background = style;
    }

    if(tempImg !== data.menu.bm.path.full){
        tempImg = data.menu.bm.path.full
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g,'%23').replace(/%/g,'%25')
        bg.setAttribute('src',`http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}`)
    }
    // Función para convertir milisegundos a formato de hora (HH:MM:SS)
    function formatTime(milliseconds) {
        let totalSeconds = Math.floor(milliseconds / 1000); // Convertir a segundos
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let secondsRemaining = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
    }

    // Dentro de la función socket.onmessage
    if (data.menu && data.menu.bm && data.menu.bm.time) {
        let currentTime = data.menu.bm.time.current;
        let fullTime = data.menu.bm.time.full;

        // Formatear los tiempos
        let currentTimeFormatted = formatTime(currentTime);
        let fullTimeFormatted = formatTime(fullTime);

        // Actualizar los elementos en el HTML
        document.getElementById("current-time").textContent = currentTimeFormatted;
        document.getElementById("full-time").textContent = fullTimeFormatted;
    }

    };
}

// Configuración para el efecto de opacidad
const OPACITY_EFFECT_CONFIG = {
    totalDuration: 400, // Duración total en ms (puedes cambiar este valor)
    maxOpacity: 0.1,    // Opacidad máxima durante el efecto
    normalOpacity: 0.05 // Opacidad normal
};

// Función para el efecto de opacidad cada 50 de combo
function triggerOpacityEffect() {
    isOpacityAnimating = true;
    
    // Calcular tiempos con desvanecimiento más lento
    const transitionTime = OPACITY_EFFECT_CONFIG.totalDuration * 0.5; // 30% para subir
    const holdTime = OPACITY_EFFECT_CONFIG.totalDuration * 0.1;       // 10% mantener
    const fadeOutTime = OPACITY_EFFECT_CONFIG.totalDuration * 1.5;    // 60% para bajar (más lento)
    
    // Transición suave para aumentar opacidad
    bg.style.transition = `opacity ${transitionTime}ms ease`;
    bg.style.opacity = OPACITY_EFFECT_CONFIG.maxOpacity;
    
    // Después del tiempo de subida + mantener, iniciar bajada lenta
    setTimeout(() => {
        // Transición más lenta para volver a la opacidad normal
        bg.style.transition = `opacity ${fadeOutTime}ms ease-out`;
        let normalOpacity = bg.dataset.flMod === 'true' ? 0 : OPACITY_EFFECT_CONFIG.normalOpacity;
        bg.style.opacity = normalOpacity;
        
        // Resetear después de que termine la transición de bajada
        setTimeout(() => {
            isOpacityAnimating = false;
            bg.style.transition = '';
        }, fadeOutTime);
    }, transitionTime + holdTime);
}

// Función para animar el combo como casino
function animateComboToCasino(newCombo) {
    if (comboAnimationId) {
        cancelAnimationFrame(comboAnimationId);
    }
    
    targetCombo = newCombo;
    
    function animateStep() {
        const diff = targetCombo - currentDisplayCombo;
        if (Math.abs(diff) < 0.1) {
            currentDisplayCombo = targetCombo;
            updateComboDisplay(Math.floor(currentDisplayCombo));
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayCombo += diff * 0.1; // Ajusta la velocidad aquí
        updateComboDisplay(Math.floor(currentDisplayCombo));
        
        comboAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para actualizar la visualización del combo
function updateComboDisplay(combo) {
    let comboString = combo.toString();
    let comboDigits = comboString.split("");
    
    comboContainer.innerHTML = "";
    comboContainer.style.display = "flex";
    comboContainer.style.justifyContent = "flex-start";
    comboContainer.style.alignItems = "center";
    comboContainer.style.gap = "5px"; // Agregar esta línea
    
    // Crear dígitos de izquierda a derecha usando las clases existentes
    comboDigits.forEach((digit, index) => {
        let digitBox = document.createElement("div");
        digitBox.classList.add("combo-digit-box"); // Usar clase CSS existente
        
        let digitElement = document.createElement("span");
        digitElement.textContent = digit;
        digitElement.classList.add("combo-digit"); // Usar clase CSS existente
        
        digitBox.appendChild(digitElement);
        comboContainer.appendChild(digitBox);
    });
    
    // Agregar el símbolo X al final
    let xBox = document.createElement("div");
    xBox.classList.add("combo-x-box");
    
    let xImg = document.createElement("img");
    xImg.src = "skin/score-x.png";
    xImg.alt = "x";
    
    xBox.appendChild(xImg);
    comboContainer.appendChild(xBox);
}

// Función para animar el accuracy como casino
function animateAccToCasino(newAcc) {
    if (accAnimationId) {
        cancelAnimationFrame(accAnimationId);
    }
    
    targetAcc = newAcc;
    
    function animateStep() {
        const diff = targetAcc - currentDisplayAcc;
        if (Math.abs(diff) < 0.01) {
            currentDisplayAcc = targetAcc;
            updateAccDisplay(currentDisplayAcc);
            accAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayAcc += diff * 0.1; // Ajusta la velocidad aquí
        updateAccDisplay(currentDisplayAcc);
        
        accAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para actualizar la visualización del accuracy
function updateAccDisplay(accValue) {
    let roundedAcc = accValue.toFixed(2);
    let accDigits = roundedAcc.toString().split("");
    
    accContainer.innerHTML = "";
    accContainer.style.display = "flex";
    accContainer.style.justifyContent = "flex-start";
    accContainer.style.alignItems = "center";
    accContainer.style.gap = "3px";
    
    accDigits.forEach((digit, index) => {
        let digitElement = document.createElement("span");
        digitElement.textContent = digit;
        digitElement.classList.add("acc-digit");
        accContainer.appendChild(digitElement);
    });
    
    // Añadir el % al final del accContainer
    let percentElement = document.createElement("span");
    percentElement.textContent = "%";
    percentElement.classList.add("acc-percent");
    accContainer.appendChild(percentElement);
}

// Función para animar el score como casino
function animateScoreToCasino(newScore) {
    if (scoreAnimationId) {
        cancelAnimationFrame(scoreAnimationId);
    }
    
    targetScore = newScore;
    
    function animateStep() {
        const diff = targetScore - currentDisplayScore;
        if (Math.abs(diff) < 1) {
            currentDisplayScore = targetScore;
            updateScoreDisplay(Math.floor(currentDisplayScore));
            scoreAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayScore += diff * 0.1; // Ajusta la velocidad aquí
        updateScoreDisplay(Math.floor(currentDisplayScore));
        
        scoreAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para actualizar la visualización del score
function updateScoreDisplay(scoreValue) {
    let scoreString = scoreValue.toString().padStart(8, "0");
    let scoreDigits = scoreString.split("");
    
    let scoreContainer = document.createElement("div");
    scoreContainer.classList.add("score-container");
    scoreContainer.style.display = "flex";
    scoreContainer.style.justifyContent = "flex-start";
    scoreContainer.style.alignItems = "center";
    scoreContainer.style.gap = "3px";
    
    scoreDigits.forEach((digit, index) => {
        let digitBox = document.createElement("div");
        digitBox.classList.add("score-digit-box");
        
        let digitElement = document.createElement("span");
        digitElement.textContent = digit;
        digitElement.classList.add("score-digit");
        
        digitBox.appendChild(digitElement);
        scoreContainer.appendChild(digitBox);
    });
    
    score.innerHTML = '';
    score.appendChild(scoreContainer);
}

// Función para animar el PP como casino
function animatePPToCasino(newPP) {
    if (ppAnimationId) {
        cancelAnimationFrame(ppAnimationId);
    }
    
    targetPP = newPP;
    
    function animateStep() {
        const diff = targetPP - currentDisplayPP;
        if (Math.abs(diff) < 0.1) {
            currentDisplayPP = targetPP;
            updatePPDisplay(Math.floor(currentDisplayPP));
            ppAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayPP += diff * 0.1; // Ajusta la velocidad aquí
        updatePPDisplay(Math.floor(currentDisplayPP));
        
        ppAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para actualizar la visualización del PP
function updatePPDisplay(ppValue) {
    let ppString = ppValue.toString();
    let ppDigits = ppString.split("");
    
    let ppContainer = document.createElement("div");
    ppContainer.classList.add("pp-container");
    ppContainer.style.display = "flex";
    ppContainer.style.justifyContent = "flex-start";
    ppContainer.style.alignItems = "center";
    ppContainer.style.gap = "2px";
    
    ppDigits.forEach((digit, index) => {
        let digitBox = document.createElement("div");
        digitBox.classList.add("pp-digit-box");
        
        let digitElement = document.createElement("span");
        digitElement.textContent = digit;
        digitElement.classList.add("pp-digit");
        
        digitBox.appendChild(digitElement);
        ppContainer.appendChild(digitBox);
    });
    
    
    currentPP.innerHTML = '';
    currentPP.appendChild(ppContainer);
}

// Función para animar el PP If FC como casino
function animatePPIfFCToCasino(newPP) {
    if (ppIfFCAnimationId) {
        cancelAnimationFrame(ppIfFCAnimationId);
    }
    
    targetPPIfFC = newPP;
    
    function animateStep() {
        const diff = targetPPIfFC - currentDisplayPPIfFC;
        if (Math.abs(diff) < 0.1) {
            currentDisplayPPIfFC = targetPPIfFC;
            updatePPIfFCDisplay(Math.floor(currentDisplayPPIfFC));
            ppIfFCAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayPPIfFC += diff * 0.1; // Ajusta la velocidad aquí
        updatePPIfFCDisplay(Math.floor(currentDisplayPPIfFC));
        
        ppIfFCAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para actualizar la visualización del PP If FC
function updatePPIfFCDisplay(ppValue) {
    let ppString = ppValue.toString();
    let ppDigits = ppString.split("");
    
    let ppContainer = document.createElement("div");
    ppContainer.classList.add("pp-iffc-container");
    ppContainer.style.display = "flex";
    ppContainer.style.justifyContent = "flex-start";
    ppContainer.style.alignItems = "center";
    ppContainer.style.gap = "2px";
    
    ppDigits.forEach((digit, index) => {
        let digitBox = document.createElement("div");
        digitBox.classList.add("pp-iffc-digit-box");
        
        let digitElement = document.createElement("span");
        digitElement.textContent = digit;
        digitElement.classList.add("pp-iffc-digit");
        
        digitBox.appendChild(digitElement);
        ppContainer.appendChild(digitBox);
    });
    
    ifFC.innerHTML = '';
    ifFC.appendChild(ppContainer);
}

// Función para animar los 300s como casino
function animate300sToCasino(new300s) {
    if (hits300AnimationId) {
        cancelAnimationFrame(hits300AnimationId);
    }
    
    target300s = new300s;
    
    function animateStep() {
        const diff = target300s - currentDisplay300s;
        if (Math.abs(diff) < 0.1) {
            currentDisplay300s = target300s;
            update300sDisplay(Math.floor(currentDisplay300s));
            hits300AnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplay300s += diff * 0.1;
        update300sDisplay(Math.floor(currentDisplay300s));
        
        hits300AnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para animar los 100s como casino
function animate100sToCasino(new100s) {
    if (hits100AnimationId) {
        cancelAnimationFrame(hits100AnimationId);
    }
    
    target100s = new100s;
    
    function animateStep() {
        const diff = target100s - currentDisplay100s;
        if (Math.abs(diff) < 0.1) {
            currentDisplay100s = target100s;
            update100sDisplay(Math.floor(currentDisplay100s));
            hits100AnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplay100s += diff * 0.1;
        update100sDisplay(Math.floor(currentDisplay100s));
        
        hits100AnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para animar los 50s como casino
function animate50sToCasino(new50s) {
    if (hits50AnimationId) {
        cancelAnimationFrame(hits50AnimationId);
    }
    
    target50s = new50s;
    
    function animateStep() {
        const diff = target50s - currentDisplay50s;
        if (Math.abs(diff) < 0.1) {
            currentDisplay50s = target50s;
            update50sDisplay(Math.floor(currentDisplay50s));
            hits50AnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplay50s += diff * 0.1;
        update50sDisplay(Math.floor(currentDisplay50s));
        
        hits50AnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para animar los slider breaks como casino
function animateSBToCasino(newSB) {
    if (hitsSBAnimationId) {
        cancelAnimationFrame(hitsSBAnimationId);
    }
    
    targetSB = newSB;
    
    function animateStep() {
        const diff = targetSB - currentDisplaySB;
        if (Math.abs(diff) < 0.1) {
            currentDisplaySB = targetSB;
            updateSBDisplay(Math.floor(currentDisplaySB));
            hitsSBAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplaySB += diff * 0.1;
        updateSBDisplay(Math.floor(currentDisplaySB));
        
        hitsSBAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Función para animar los misses como casino
function animateMissToCasino(newMiss) {
    if (hitsMissAnimationId) {
        cancelAnimationFrame(hitsMissAnimationId);
    }
    
    targetMiss = newMiss;
    
    function animateStep() {
        const diff = targetMiss - currentDisplayMiss;
        if (Math.abs(diff) < 0.1) {
            currentDisplayMiss = targetMiss;
            updateMissDisplay(Math.floor(currentDisplayMiss));
            hitsMissAnimationId = null;
            return;
        }
        
        // Animación lenta tipo casino
        currentDisplayMiss += diff * 0.1;
        updateMissDisplay(Math.floor(currentDisplayMiss));
        
        hitsMissAnimationId = requestAnimationFrame(animateStep);
    }
    
    animateStep();
}

// Funciones para actualizar la visualización de los hits con espaciado
function update300sDisplay(hits300Value) {
    let hits300Container = document.querySelector('#hits300 .hit-count');
    if (hits300Container) {
        // Aplicar el mismo formato con espaciado que el score/PP
        hits300Container.textContent = hits300Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

function update100sDisplay(hits100Value) {
    let hits100Container = document.querySelector('#hits100 .hit-count');
    if (hits100Container) {
        hits100Container.textContent = hits100Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

function update50sDisplay(hits50Value) {
    let hits50Container = document.querySelector('#hits50 .hit-count');
    if (hits50Container) {
        hits50Container.textContent = hits50Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

function updateSBDisplay(sbValue) {
    let hitsSBContainer = document.querySelector('#hitsSB .hit-count');
    if (hitsSBContainer) {
        hitsSBContainer.textContent = sbValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

function updateMissDisplay(missValue) {
    let hitsMissContainer = document.querySelector('#hitsMiss .hit-count');
    if (hitsMissContainer) {
        hitsMissContainer.textContent = missValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}
