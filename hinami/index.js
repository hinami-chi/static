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
let urbar = document.getElementById('urbar');
//score.innerHTML = '0'.padStart(8,"0")
let tempState;
let tempTime;
let tempTimeMax;
let tempImg;
let prevH300;
let prevH100;
let prevH50;
let prevH0;
let tick = [];
for (var t = 0; t < 30; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}

let bar = document.getElementById("bar");
let center = document.getElementById("center");
let arrow = document.getElementById("arrow");

let early = document.getElementById("early");
let late = document.getElementById("late");

let h300g = document.getElementById("h300g");
let h300 = document.getElementById("h300");

let tH300g;
let tH300;


let state;
let cur_ur;
let cur_combo;

let tempHitErrorArrayLength;
let OD = 0;
let tickPos;
let fullPos;
let tempAvg;
let tempSmooth;

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
        let scoreValue = data.gameplay.score.toString().padStart(8, "0");
        //let previousScore = score.textContent.replace(/,/g, ''); // Obtener el valor anterior del score
        
        // Crear un contenedor flex para los dígitos del score
        let scoreContainer = document.createElement("div");
        scoreContainer.classList.add("score-container"); // Agregar una clase para el contenedor
        
        // Establecer el estilo flex para el contenedor principal del score
        scoreContainer.style.display = "flex";
        scoreContainer.style.justifyContent = "flex-start"; // Alinear los dígitos de izquierda a derecha
        
        // Iterar sobre cada dígito en el scoreValue y crear un contenedor para cada dígito
        scoreValue.split("").forEach((digit, index) => {
            // Crear un nuevo contenedor para el dígito
            let digitContainer = document.createElement("div");
            digitContainer.classList.add("score-digit"); // Agregar una clase para el estilo del contenedor
            digitContainer.style.marginRight = "2px"; // Agregar margen derecho de 5px
            // Crear un elemento span para el dígito y establecer su texto como el dígito actual
            let digitElement = document.createElement("span");
            digitElement.textContent = digit;
            
            // Agregar el elemento del dígito al contenedor del dígito
            digitContainer.appendChild(digitElement);
            
            // Agregar el contenedor del dígito al contenedor de score principal
            scoreContainer.appendChild(digitContainer);
        });
        
        // Reemplazar el contenido anterior del contenedor de score con el nuevo contenedor de dígitos
        score.innerHTML = '';
        score.appendChild(scoreContainer);
    }

    if (data.gameplay.accuracy !== "") {
        let accValue = parseFloat(data.gameplay.accuracy);
        let roundedAcc = accValue.toFixed(2);
    
        let accDigits = roundedAcc.toString().split("");
        accContainer.innerHTML = ""; // Elimina el contenido existente antes de agregar las nuevas imágenes

        // Establecer el estilo flex para el contenedor principal del acc
        accContainer.style.display = "flex";
        accContainer.style.justifyContent = "flex-start"; // Alinear los dígitos de izquierda a derecha
        
        accDigits.forEach((digit, index) => {
            // Crear un nuevo contenedor para el dígito
            let digitContainer = document.createElement("div");
            digitContainer.classList.add("acc-digit"); // Agregar una clase para el estilo del contenedor
            digitContainer.style.marginRight = "2px"; // Agregar margen derecho de 5px
            // Crear un elemento span para el dígito y establecer su texto como el dígito actual
            let digitElement = document.createElement("span");
            digitElement.textContent = digit;
            
            // Agregar el elemento del dígito al contenedor del dígito
            digitContainer.appendChild(digitElement);
            
            // Agregar el contenedor del dígito al contenedor de acc principal
            accContainer.appendChild(digitContainer);
        });
        
        acc.innerHTML = '';
        // Añadir el % al final del accContainer
        let percentElement = document.createElement("span");
        percentElement.textContent = "%";
        accContainer.appendChild(percentElement);
        acc.appendChild(accContainer);
    }
    
    if (data.gameplay.combo.current !== "") {
        let comboDigits = data.gameplay.combo.current.toString().split("");
        comboContainer.innerHTML = ""; // Elimina el contenido existente antes de agregar las nuevas imágenes
        comboContainer.style.display = "flex";
        comboContainer.style.justifyContent = "flex-start"; // Alinear los dígitos de izquierda a derecha
        
        comboDigits.forEach(digit => {
            let digitContainer = document.createElement("div");
            digitContainer.classList.add("combo-digit"); // Agregar una clase para el estilo del contenedor
            digitContainer.style.marginRight = "2px"; // Agregar margen derecho de 5px
            // Crear un elemento span para el dígito y establecer su texto como el dígito actual
            let digitElement = document.createElement("span");
            digitElement.textContent = digit;
            
            // Agregar el elemento del dígito al contenedor del dígito
            digitContainer.appendChild(digitElement);
            
            // Agregar el contenedor del dígito al contenedor de combo principal
            comboContainer.appendChild(digitContainer);
        });
    // Reemplazar el símbolo "%" con la imagen "score-percent.png"
    let percentImage = document.createElement("img");
    percentImage.src = "skin/score-x.png";
    percentImage.alt = "percent";
    comboContainer.appendChild(percentImage);
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
        animation.pp.update(data.gameplay.pp.current)
    }else{
        currentPP.innerHTML = 0
    }
    if(data.gameplay.pp.fc != ''){
        ifFC.innerHTML = Math.round(data.gameplay.pp.fc)
    }else if (tempState == 1){
        ifFC.innerHTML = data.menu.pp[100]
    }else {
        ifFC.innerHTML = 0
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
    
    // Aplicar la opacidad al elemento de la imagen
    bg.style.opacity = opacity;

    if(tempImg !== data.menu.bm.path.full){
        tempImg = data.menu.bm.path.full
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g,'%23').replace(/%/g,'%25')
        bg.setAttribute('src',`http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}`)
    }
    /*
    // Función para convertir milisegundos a formato de hora (HH:MM:SS)
    function formatTime(milliseconds) {
        let totalSeconds = Math.floor(milliseconds / 1000); // Convertir a segundos
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let secondsRemaining = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
    }
    
    */

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

    let play = data.gameplay;
    if (state !== data.menu.state) {
        state = data.menu.state;
        if (state !== 2) {
            for (var y = 0; y < 30; y++) {
                tick[y].style.transform = "translateX(0)";
                tick[y].style.opacity = 0;
            }
            tickPos = 0;
            tempAvg = 0;
            arrow.style.transform = "translateX(0)";  
            bar.style.opacity = 0;
            early.style.opacity = 0;
            late.style.opacity = 0;
            h300g.style.opacity = 0;
            h300.style.opacity = 0;
        } else {
            bar.style.opacity = 1;
            early.style.opacity = 1;
            late.style.opacity = 1;
            h300g.style.opacity = 1;
            h300.style.opacity = 1;
            
            setTimeout(function(){
                early.style.opacity = 0;
                late.style.opacity = 0;
            }, 1200);
        }
    }
    if (tH300g !== play.hits.geki){
        tH300g = play.hits.geki;
        h300g.innerHTML = tH300g;
    }
    if (tH300 !== play.hits[300]){
        tH300 = play.hits[300];
        h300.innerHTML = tH300;
    }
    if (data.gameplay.hits.unstableRate == 0) {
        for (var y = 0; y < 30; y++) {
            tick[y].style.transform = "translateX(0)";
            tick[y].style.opacity = 0;
        }
        arrow.style.transform = "translateX(0)";
    }
    if (cur_ur !== data.gameplay.hits.unstableRate) {
        cur_ur = data.gameplay.hits.unstableRate;
        tempAvg = 0;      
    }

    //source reference -> TryZCustomOverlay(made by FukutoTojido)
    if (cur_combo !== data.gameplay.combo.current) {
        OD = data.menu.bm.stats.memoryOD;
        cur_combo = data.gameplay.combo.current;
        tempSmooth = smooth(data.gameplay.hits.hitErrorArray, 4);
        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.90 + tempSmooth[a] * 0.1;
            }
            fullPos = (-10 * OD + 199.5);
            tickPos = data.gameplay.hits.hitErrorArray[tempHitErrorArrayLength - 1] / fullPos * 145;
            arrow.style.transform = `translateX(${(tempAvg / fullPos) * 150}px)`;
            if((tempAvg / fullPos) * 150 > 2.5){
                arrow.style.borderColor = "#FF4040 transparent transparent transparent"
            }
            else if((tempAvg / fullPos) * 150 < -2.5){
        
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
        arrow.style.borderColor = "#1985FF transparent transparent transparent"
            }
            else{
                arrow.style.borderColor = "white transparent transparent transparent"
            }

            for (var c = 0; c < 30; c++) {
        
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
        if ((tempHitErrorArrayLength % 30) == ((c + 1) % 30)) {
                    tick[c].style.opacity = 1;
                    tick[c].style.transform = `translateX(${tickPos}px) translateY(0px)`;
            
                    var s = document.querySelectorAll("[id^=tick]")[c].style;
                    s.opacity = 1;
                    /*
                    console.log("prevH50: " + prevH50 + " H50: " + data.gameplay.leaderboard.ourplayer.h50)
                    console.log("prevH100: " + prevH100 + " H100: " + data.gameplay.leaderboard.ourplayer.h100)
                    console.log("prevH300: " + prevH300 + " H300: " + data.gameplay.leaderboard.ourplayer.h300)
                    */
                    // Verificar y asignar color basado en cambios en h300 y h100
                    if (data.gameplay.leaderboard.ourplayer.h300 !== prevH300) {
                        //s.backgroundColor = "rgb(100,255,255)"; // Cyan for h300 increment
                    } else if (data.gameplay.leaderboard.ourplayer.h100 !== prevH100) {
                        //s.backgroundColor = "rgb(100,255,100)"; // Green for h100 increment
                    } else if (data.gameplay.leaderboard.ourplayer.h50 !== prevH50) {
                        //s.backgroundColor = "rgb(255,200,130)"; // Orange for h50 increment
                    }

                    (function fadeAndMove(s, tickPos) {
                        var yOffset = -20;
                        var speed = 5; // Increased speed for faster movement
                        var opacityDecrement = 0.02; // Slightly higher decrement for faster fading
                        var interval = 15; // Smaller interval for smoother and quicker updates
            
                        (function animate() {
                            if ((s.opacity -= opacityDecrement) < 0) {
                                s.opacity = 0;
                            } else {
                                yOffset -= speed;
                                s.transform = `translateX(${tickPos}px) translateY(${yOffset}px)`;
                                setTimeout(animate, interval);
                            }
                        })();
                    })(s, tickPos);
                    
                    // Actualizar los valores previos después de asignar color
                    prevH300 = data.gameplay.leaderboard.ourplayer.h300;
                    prevH100 = data.gameplay.leaderboard.ourplayer.h100;
                    prevH50 = data.gameplay.leaderboard.ourplayer.h50;
                    prevH0 = data.gameplay.leaderboard.ourplayer.h0;
                }
            }
            
            
        }
    }
    };
}
