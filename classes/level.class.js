class Level {
    canvas;
    ctx;
    keyboard;
    length;
    numberChickens;
    numberBottles;
    numberCoins;
    damageBottles;
    collectedCoins;
    statusbar;
    

    constructor(levelData, collectedCoins){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.length = levelData[0];
        this.numberChickens = levelData[1];
        this.numberBottles = levelData[2];
        this.numberCoins = levelData[3];
        this.damageBottles = levelData[4];

        this.collectedCoins = collectedCoins;
        this.statusbar = new this.statusbar(collectedCoins);

    }


    //background erzeugen (length)
    // Chicken erzeugen
    // endboss erzeugen
    // coins bottles
    
}