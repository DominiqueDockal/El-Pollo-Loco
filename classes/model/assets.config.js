const ASSETS = {
    background: [
        { 
            src: 'images/background/background_1.png',
            width: 1920,
            height: 1080
        },
        { 
            src: 'images/background/background_2.png',
            width: 1920,
            height: 1080
        }
    ],

    bottle_ground: [
        { 
            src: 'images/bottle/bottle_ground_1.png',
            width: 400,
            height: 400
        },
        { 
            src: 'images/bottle/bottle_ground_2.png',
            width: 400,
            height: 400
        }
    ],

    statusbar_coin: [
        { 
            src: 'images/statusbar/statusbar_coin/0.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_coin/20.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_coin/40.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_coin/60.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_coin/80.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_coin/100.png',
            width: 595,
            height: 158
        }
        
    ],
    statusbar_health: [
        { 
            src: 'images/statusbar/statusbar_health/0.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_health/20.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_health/40.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_health/60.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_health/80.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_health/100.png',
            width: 595,
            height: 158
        }
        
    ],
    statusbar_bottle: [
        { 
            src: 'images/statusbar/statusbar_bottle/0.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_bottle/20.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_bottle/40.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_bottle/60.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_bottle/80.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_bottle/100.png',
            width: 595,
            height: 158
        }
        
    ],
    statusbar_endboss: [
        { 
            src: 'images/statusbar/statusbar_endboss/0.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_endboss/20.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_endboss/40.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_endboss/60.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_endboss/80.png',
            width: 595,
            height: 158
        },
        { 
            src: 'images/statusbar/statusbar_endboss/100.png',
            width: 595,
            height: 158
        }
        
    ],

    clouds: [
        { 
            src: 'images/clouds/1_level1.png',
            width: 1920,
            height: 1080
        },
        { 
            src: 'images/clouds/2_level1.png',
            width: 1920,
            height: 1080
        },
        { 
            src: 'images/clouds/1_level2.png',
            width: 1920,
            height: 1080
        },
        { 
            src: 'images/clouds/2_level2.png',
            width: 1920,
            height: 1080
        }
    ],

    coin: [
        { 
            src: 'images/coin/coin_1.png',
            width: 300,
            height: 301
        },
        { 
            src: 'images/coin/coin_2.png',
            width: 300,
            height: 301
        }
    ],
    chicken_walk: [
        { 
            src: 'images/chicken/walk_1.png',
            width: 248,
            height: 243
        },
        { 
            src: 'images/chicken/walk_2.png',
            width: 248,
            height: 243
        },
        { 
            src: 'images/chicken/walk_3.png',
            width: 248,
            height: 243
        }
    ],
    chicken_dead: [
        { 
            src: 'images/chicken/dead.png',
            width: 248,
            height: 243
        }
    ],
    chicken_small_walk: [
        { 
            src: 'images/chickensmall/walk_1.png',
            width: 248,
            height: 243
        },
        { 
            src: 'images/chickensmall/walk_2.png',
            width: 248,
            height: 243
        },
        { 
            src: 'images/chickensmall/walk_3.png',
            width: 248,
            height: 243
        }
    ],
    chicken_small_dead: [
        { 
            src: 'images/chickensmall/dead.png',
            width: 248,
            height: 243
        }
    ],


};

const ALL_IMAGES = [
    ...ASSETS.background.map(bg => bg.src), 
    ...ASSETS.statusbar_coin.map(bg => bg.src), 
    ...ASSETS.statusbar_health.map(bg => bg.src), 
    ...ASSETS.statusbar_bottle.map(bg => bg.src),
    ...ASSETS.bottle_ground.map(bg => bg.src),
    ...ASSETS.clouds.map(bg => bg.src),
    ...ASSETS.coin.map(bg => bg.src),
    ...ASSETS.chicken_walk.map(bg => bg.src),
    ...ASSETS.chicken_dead.map(bg => bg.src),
    ...ASSETS.chicken_small_walk.map(bg => bg.src),
    ...ASSETS.chicken_small_dead.map(bg => bg.src)
];

const ALL_IMAGE_DATA = [
    ...ASSETS.background, 
    ...ASSETS.statusbar_coin, 
    ...ASSETS.statusbar_health, 
    ...ASSETS.statusbar_bottle,
    ...ASSETS.bottle_ground,
    ...ASSETS.clouds,
    ...ASSETS.coin,
    ...ASSETS.chicken_walk,
    ...ASSETS.chicken_dead,
    ...ASSETS.chicken_small_walk,
    ...ASSETS.chicken_small_dead
];

window.ASSETS = ASSETS;
window.ALL_IMAGES = ALL_IMAGES;
window.ALL_IMAGE_DATA = ALL_IMAGE_DATA;
