class Game {
    collectedCoins = 0;
    currentLevel;
    currentLevelNumber = 0;
    level1Data = [3, 2, 15, 15, 30]; // Einfach - Viele Ressourcen, wenige Gegner
    level2Data = [5, 4, 12, 12, 15]; // Mittel - Ausgewogene Verteilung  
    level3Data = [7, 6, 8, 8, 10];   // Schwer - Wenige Ressourcen, viele Gegner
    allLevels =[this.level1Data,this.level2Data, this.level3Data];

    constructor(){
        this.initializeLevel();   
    }

    // für erweiterbare Logik
    initializeLevel(){
        this.currentLevel = new level(this.allLevels[this.currentLevelNumber], this.collectedCoins);
    }
    
}


