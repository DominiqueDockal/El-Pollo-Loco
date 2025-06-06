class View {
    constructor() {
        if (new.target === View) throw new Error("View is an abstract class and cannot be instantiated directly");
    }
    
    render(gameObjects) {
        throw new Error("render() must be implemented in the subclass");
    }
    
    clear() {
        throw new Error("clear() must be implemented in the subclass");
    }
}

