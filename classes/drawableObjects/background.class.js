class BackgroundObject extends DrawableObject {

    IMAGES_BACKGROUND_1 = [
        `img/5_background/layers/air.png`,
        `img/5_background/layers/3_third_layer/1.png`,
        `img/5_background/layers/2_second_layer/1.png`,
        `img/5_background/layers/1_first_layer/1.png`
    ]

    IMAGES_BACKGROUND_2 = [
        `img/5_background/layers/air.png`,
        `img/5_background/layers/3_third_layer/2.png`,
        `img/5_background/layers/2_second_layer/2.png`,
        `img/5_background/layers/1_first_layer/2.png`
    ]

    constructor(){
        super().loadImages(this.IMAGES_BACKGROUND_1);
        this.width = 720;
        this.height = 480;
    }

}