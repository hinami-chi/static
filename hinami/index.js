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
let comboContainer = document.getElementById("combodata");
let accContainer = document.getElementById("accdata");
let timer = document.getElementById('timer');
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
}

let tempState;
let tempTime;
let tempTimeMax;

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
    if (data.gameplay.score != -1) {
        let scoreValue = data.gameplay.score.toString().padStart(8, "0");
      
        // Obtener la referencia al elemento <img> del puntaje
        let scoreContainer = document.getElementById("score");
        scoreContainer.innerHTML = ""; // Limpiar contenido existente
      
        // Generar y agregar imágenes para cada dígito
        for (let i = 0; i < scoreValue.length; i++) {
          let digit = scoreValue[i];
      
          // Crear un nuevo elemento <img> para el dígito
          let digitImage = document.createElement("img");
          digitImage.setAttribute("src", `skin/score-${digit}.png`);
      
          // Agregar el elemento al contenedor del puntaje
          scoreContainer.appendChild(digitImage);
        }
    }
    if (data.gameplay.accuracy !== "") {
        let accValue = parseFloat(data.gameplay.accuracy);
        let roundedAcc = accValue.toFixed(2);
    
        let accDigits = roundedAcc.toString().split("");
        accContainer.innerHTML = ""; // Elimina el contenido existente antes de agregar las nuevas imágenes
    
        accDigits.forEach((digit, index) => {
        if (digit === ".") {
            let dotImage = document.createElement("img");
            dotImage.src = "skin/score-dot.png";
            dotImage.alt = "dot";
            accContainer.appendChild(dotImage);
        } else {
            let digitImage = document.createElement("img");
            digitImage.src = `skin/score-${digit}.png`;
            digitImage.alt = digit;
            accContainer.appendChild(digitImage);
        }
        });
    // Reemplazar el símbolo "%" con la imagen "score-percent.png"
    let percentImage = document.createElement("img");
    percentImage.src = "skin/score-percent.png";
    percentImage.alt = "percent";
    accContainer.appendChild(percentImage);
    }
  
    if (data.gameplay.combo.current !== "") {
        let comboDigits = data.gameplay.combo.current.toString().split("");
        comboContainer.innerHTML = ""; // Elimina el contenido existente antes de agregar las nuevas imágenes
      
        comboDigits.forEach(digit => {
          let digitImage = document.createElement("img");
          digitImage.src = `skin/score-${digit}.png`;
          digitImage.alt = digit;
          comboContainer.appendChild(digitImage);
        });
    // Reemplazar el símbolo "%" con la imagen "score-percent.png"
    let percentImage = document.createElement("img");
    percentImage.src = "skin/score-x.png";
    percentImage.alt = "percent";
    comboContainer.appendChild(percentImage);
    }
    if (data.gameplay.hits.unstableRate != '') {
        animation.ur.update(data.gameplay.hits.unstableRate)
    } else {
        animation.ur.update(0)
    }
    if(data.gameplay.pp.current != ''){
        currentPP.innerHTML = Math.round(data.gameplay.pp.current)
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
    };
}
