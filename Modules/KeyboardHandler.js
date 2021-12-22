
let textBox = document.getElementById('message');
let keyboardObj = {
    leftKeyHold: false,
    rightKeyHold: false,
    upKeyHold: false,
    downKeyHold: false
}

document.addEventListener('keydown', (event) => {
    //console.log(`key=${event.key == ArrowDown},code=${event.code}`);
    switch(event.key) {
        case "ArrowLeft":
            keyboardObj.leftKeyHold = true;
            break;
    
        case "ArrowRight":
            keyboardObj.rightKeyHold = true;
            break;
            
        case "ArrowUp":
            keyboardObj.upKeyHold = true;
            break;
        
        case "ArrowDown":
            keyboardObj.downKeyHold = true;
            break;
    }
    updateTextBox();

});

document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case "ArrowLeft":
            keyboardObj.leftKeyHold = false;
            break;
    
        case "ArrowRight":
            keyboardObj.rightKeyHold = false;
            break;
            
        case "ArrowUp":
            keyboardObj.upKeyHold = false;
            break;
        
        case "ArrowDown":
            keyboardObj.downKeyHold = false;
            break;
    }
    updateTextBox();
});


function updateTextBox() {

    var str = "";
    if(keyboardObj.leftKeyHold)
        str += "left ";
    if(keyboardObj.upKeyHold)
        str += "up ";
    if(keyboardObj.rightKeyHold)
        str += "right ";
    if(keyboardObj.downKeyHold)
        str += "down";
        
    textBox.value = str;

}