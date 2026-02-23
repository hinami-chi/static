let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/websocket/v2");
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
    acc: new CountUp('accdata', 0, 0, 2, .2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
    combo: new CountUp('combodata', 0, 0, 0, .2, { useEasing: true, useGrouping: true, separator: "", decimal: "." }),
    ur: new CountUp('ur', 0, 0, 2, 1, { decimalPlaces: 2, useEasing: true, useGrouping: false, separator: " ", decimal: "." }),
    pp: new CountUp('ppCurent', 0, 0, 0, .2, { useEasing: true, useGrouping: true, separator: " ", decimal: "." }),
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
    if (data.settings.interfaceVisible) {
        wrapper.style.display = 'none';
    } else {
        wrapper.style.display = 'block';

        if (tempState !== data.state.number) {
            tempState = data.state.number;
            if (tempState == 2) {
                wrapper.style.opacity = 1;
            }
            else {
                wrapper.style.opacity = 0;
            }
        }
        if (data.play.healthBar.smooth != "" || data.play.healthBar.smooth != null || data.play.healthBar.smooth != undefined) {
            let step = widthBase / 200;
            scoreColor.style.width = step * data.play.healthBar.smooth + 'px'
        }
        // Dentro de la función socket.onmessage

        if (data.play.score != -1) {
            // Animar el score con efecto tipo casino
            animateScoreToCasino(data.play.score);
        }

        if (data.play.accuracy !== "") {
            let accValue = parseFloat(data.play.accuracy);
            // Animar el accuracy con efecto tipo casino
            animateAccToCasino(accValue);
        }

        if (data.play.combo.current !== "") {
            let currentCombo = data.play.combo.current;

            // Milestone: cada 30 hasta 100, luego cada 50
            let currentMilestone;
            if (currentCombo < 60) {
                currentMilestone = Math.floor(currentCombo / 30) * 30;
            } else {
                currentMilestone = 100 + Math.floor((currentCombo - 100) / 50) * 50;
            }

            if (
                currentCombo >= 30 &&
                currentMilestone > lastComboMilestone &&
                !isOpacityAnimating
            ) {
                lastComboMilestone = currentMilestone;
                triggerOpacityEffect();
            }

            // Resetear el milestone si el combo baja (por ejemplo, por un miss)
            if (currentCombo < lastComboMilestone) {
                if (currentCombo < 100) {
                    lastComboMilestone = Math.floor(currentCombo / 30) * 30;
                } else {
                    lastComboMilestone = 100 + Math.floor((currentCombo - 100) / 50) * 50;
                }
            }

            // Animar el combo con efecto tipo casino
            animateComboToCasino(currentCombo);
        }

        // Animar todos los hits con efecto tipo casino
        if (data.play.hits && data.play.hits["300"] !== undefined && data.play.hits["300"] !== null) {
            animate300sToCasino(data.play.hits["300"]);
        }

        if (data.play.hits && data.play.hits["100"] !== undefined && data.play.hits["100"] !== null) {
            animate100sToCasino(data.play.hits["100"]);
        }

        if (data.play.hits && data.play.hits["50"] !== undefined && data.play.hits["50"] !== null) {
            animate50sToCasino(data.play.hits["50"]);
        }

        if (data.play.hits && data.play.hits.sliderBreaks !== undefined && data.play.hits.sliderBreaks !== null) {
            animateSBToCasino(data.play.hits.sliderBreaks);
        }

        if (data.play.hits && data.play.hits["0"] !== undefined && data.play.hits["0"] !== null) {
            animateMissToCasino(data.play.hits["0"]);
        }

        if (data.play.rank.current !== undefined && data.play.rank.current !== null) {
            let currentRank = data.play.rank.current;
            if (currentRank === "SS") {
                currentRank = "X";
            }
            if (data.play.mods.name.includes("HD") || data.play.mods.name.includes("FL")) {
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

        if (data.play.mods.name !== null) {
            let mods = data.play.mods.name;
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
        if (data.beatmap.artist != '') {
            nowPlayingContainer.textContent = `♫ ${data.beatmap.artist} - ${data.beatmap.title} [${data.beatmap.version}] mapped by ${data.beatmap.mapper}`;
        }

        if (data.play.unstableRate != '') {
            animation.ur.update(data.play.unstableRate)
        } else {
            animation.ur.update(0)
        }
        if (data.play.pp.current != '') {
            // Animar el PP con efecto tipo casino
            animatePPToCasino(data.play.pp.current);
        } else {
            currentPP.innerHTML = "0";
        }

        if (data.play.pp.fc != '') {
            // Animar el PP If FC con efecto tipo casino
            animatePPIfFCToCasino(data.play.pp.fc);
        } else {
            ifFC.innerHTML = "0";
        }

        if (tempState !== data.state.number) {
            tempState = data.state.number;
            if (tempState == 2 || tempState == 7 || tempState == 1) {
                pp.style.bottom = 210 + 'px'
                pp.style.color = 'rgba(199, 199, 199, 0.8);'
            }
            else {
                pp.style.bottom = 100 + 'px'
                pp.style.color = 'rgba(199, 199, 199, 0);'
            }
        }
        if (data.state.number !== tempState) {
            tempState = data.state.number
            if (tempState !== 2) {
                timer.style.opacity = 0;
            } else {
                timer.style.opacity = 1;
            }
        }
        if (data.beatmap && data.beatmap.stats && data.beatmap.stats.bpm) {
            let bpmmin = data.beatmap.stats.bpm.min;
            let bpmmax = data.beatmap.stats.bpm.max;

            if (bpmmin === bpmmax) {
                bpmContainer.textContent = `${bpmmin} BPM`;
            } else {
                bpmContainer.textContent = `${bpmmin} - ${bpmmax} BPM`;
            }
        }

        if (data.beatmap && data.beatmap.stats) {
            let csStatValue = data.beatmap.stats.cs.converted;
            let arStatValue = data.beatmap.stats.ar.converted;
            let starStatValue = data.beatmap.stats.stars.total.toFixed(2);

            csStat.textContent = `CS ${csStatValue}`;
            arStat.textContent = `AR ${arStatValue}`;
            starStat.textContent = `${starStatValue}☆`;
        }
        let opacity = data.play.mods.name.includes("FL") ? 0 : 0.05;

        // No cambiar la opacidad si está en animación
        if (!isOpacityAnimating) {
            bg.style.opacity = opacity;
        }

        if (tempTime !== data.beatmap.time.live || tempTimeMax !== data.beatmap.time.lastObject) {
            tempTime = data.beatmap.time.live;
            if (tempTimeMax !== data.beatmap.time.lastObject) {
                tempTimeMax = data.beatmap.time.lastObject;
            }
            time = (tempTime / tempTimeMax) * 100;
            timeString = time.toString();
            style = "conic-gradient(#999999 " + timeString + "%, rgba(0,0,0,0) 0)";
            timer.style.background = style;
        }

        if (tempImg !== data.directPath.beatmapBackground) {
            tempImg = data.directPath.beatmapBackground
            let bgPath = data.directPath.beatmapBackground.replace(/#/g, '%23').replace(/%/g, '%25')
            bg.setAttribute('src', `http://127.0.0.1:24050/Songs/${bgPath}?a=${Math.random(10000)}`)
        }
        // Función para convertir milisegundos a formato de hora (HH:MM:SS)
        function formatTime(milliseconds) {
            let totalSeconds = Math.floor(milliseconds / 1000); // Convertir a segundos
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let secondsRemaining = totalSeconds % 60;

            return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
        }

        // Dentro de la función socket.onmessage
        if (data.beatmap && data.beatmap.time) {
            let currentTime = data.beatmap.time.live;
            let fullTime = data.beatmap.time.lastObject;

            // Formatear los tiempos
            let currentTimeFormatted = formatTime(currentTime);
            let fullTimeFormatted = formatTime(fullTime);

            // Actualizar los elementos en el HTML de forma segura
            document.getElementById("current-time")?.setAttribute('textContent', currentTimeFormatted);
            if (document.getElementById("current-time")) document.getElementById("current-time").textContent = currentTimeFormatted;

            let fullTimeEl = document.getElementById("full-time");
            if (fullTimeEl) fullTimeEl.textContent = fullTimeFormatted;
        }

    };
}

// Configuración para el efecto de opacidad
const OPACITY_EFFECT_CONFIG = {
    totalDuration: 400, // Duración total en ms (puedes cambiar este valor)
    maxOpacity: 0.15,    // Opacidad máxima durante el efecto
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

(function () {
    const listContainer = document.getElementById('leaderboard-players');
    const template = document.getElementById('leader-template');

    if (!listContainer || !template) {
        console.warn('Leaderboard template o contenedor no encontrados.');
        return;
    }

    function createRowFromTemplate(s, our) {
        const row = template.cloneNode(true);
        row.removeAttribute('id');
        row.classList.remove('template');
        row.style.display = ''; // mostrar

        const posEl = row.querySelector('.player-pos');
        const nameEl = row.querySelector('.player-title');
        const scoreEl = row.querySelector('.player-score');
        const comboEl = row.querySelector('.player-combo');

        if (posEl) posEl.textContent = s.position != null ? `#${s.position}` : '';
        if (nameEl) nameEl.textContent = s.name || s.playerName || '';
        if (scoreEl) scoreEl.textContent = (s.score != null) ? Number(s.score).toLocaleString() : '';

        // Manejar el caso de que combo o maxCombo sean objetos en v2
        const getVal = (v) => (typeof v === 'object' && v !== null) ? (v.max || v.current || 0) : (v || 0);
        const comboVal = getVal(s.maxCombo) || getVal(s.combo);
        const comboText = comboVal > 0 ? `${comboVal}x` : '';

        if (comboEl) comboEl.textContent = comboText;

        const scoreMatch = s.score != null && our && Number(s.score) === Number(our.score);
        if (our && (s.name === our.name || (s.playerName && s.playerName === our.name)) && (scoreMatch || s.position === our.position)) {
            row.classList.add('current');
        }

        return row;
    }

    function renderSlotListUsingTemplate(slots, our) {
        listContainer.innerHTML = '';
        slots.sort((a, b) => (a.position || 0) - (b.position || 0));
        for (const s of slots) {
            listContainer.appendChild(createRowFromTemplate(s, our));
        }
        if (our && !slots.some(x => (x.name === our.name || (x.playerName && x.playerName === our.name)))) {
            listContainer.appendChild(createRowFromTemplate(our, our));
        }
    }

    // registrar listener existente (usa el socket que ya tienes)
    if (typeof socket !== 'undefined' && socket && socket.addEventListener) {
        // añade un listener específico que solo maneja leaderboard
        socket.addEventListener('message', ev => {
            try {
                const parsed = JSON.parse(ev.data);
                const leaderboardDiv = document.getElementById('leaderboard');
                // En v2 leaderboard es un array plano; ourplayer viene de play
                const lb = Array.isArray(parsed?.leaderboard) ? parsed.leaderboard : [];
                const our = parsed?.play ? { name: parsed.play.playerName, position: 0, score: parsed.play.score, combo: parsed.play.combo?.current, maxCombo: parsed.play.combo?.max } : null;
                const isVisible = parsed?.settings?.leaderboard?.visible === true;
                const isPaused = parsed?.game?.paused === true;
                const isBreak = parsed?.beatmap?.isBreak === true;
                const hasLeaderboard = lb.length > 0;

                // El leaderboard se oculta si: está configurado como 'visible' (v2 logic), 
                // si no hay jugadores, si el juego está pausado o si hay un break.
                const shouldHide = isVisible || !hasLeaderboard || isPaused || isBreak;

                // Aplica la animación de fadein/fadeout
                if (leaderboardDiv) {
                    if (shouldHide) {
                        leaderboardDiv.classList.remove('fadein');
                        leaderboardDiv.classList.add('fadeout');
                    } else {
                        leaderboardDiv.classList.remove('fadeout');
                        leaderboardDiv.classList.add('fadein');
                    }
                }

                // Renderiza el contenido solo si debe mostrarse
                if (!shouldHide) {
                    renderSlotListUsingTemplate(lb, our);
                    setTimeout(() => {
                        const cur = document.querySelector('#leaderboard-players .leader-name.current');
                        if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 80);
                }
            } catch (e) {
                console.error('leaderboard template render error', e);
            }
        });
    } else {
        console.warn('socket no definido: leaderboard listener no registrado');
    }
})();
