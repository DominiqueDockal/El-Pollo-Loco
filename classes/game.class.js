class Game {
    collectedCoins = 0;
    currentLevel;
    level1Data = [3, 2, 15, 15, 30]; // Einfach - Viele Ressourcen, wenige Gegner
    level2Data = [5, 4, 12, 12, 15]; // Mittel - Ausgewogene Verteilung  
    level3Data = [7, 6, 8, 8, 10];   // Schwer - Wenige Ressourcen, viele Gegner

    constructor(){
        this.initializeLevel(level1Data);   
    }

    initializeLevel(levelData){
        this.currentLevel = new level(levelData, this.collectedCoins);
    }
    
}


