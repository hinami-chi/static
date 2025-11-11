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
        
        // Actualizar el contenido del score con el nuevo valor
        //score.textContent = scoreValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // Añadir separadores de miles
        
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
