class Endboss extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'endboss_alert', 3);
        this.scale = 0.8;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isHurt = false;
        this.isDead = false;
        this.currentAssetType = 'endboss_alert';
        this.canHit = true;
        this.lastHitTime = 0;
        this.hitCooldown = 500;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.deathTime = null;
        this.endbossBar = null;
        this.character = null;
        this.isAttacking = false;
        this.isWalking = false;
        super.setDimensions(this.scale);
        this.startX = this.x;
        this.hasEngaged = false; 
        this.isReturning = false;
        this.nextAttackSoundTime = 0;
    }

    setEndbossBar(endbossBar) {
        this.endbossBar = endbossBar;
    }

    setCharacter(character){
        this.character = character;
    }

    setCurrentImage() {
        super.setImageByIndex(this.currentImageIndex, this.currentAssetType);
    }

    hurt(damage) {
        const now = Date.now();
        if (now - this.lastHitTime < this.hitCooldown) return;
        this.isHurt = true;
        this.health = Math.max(0, this.health - damage);
        this.lastHitTime = now;
        if (!this.isDead) {
            this.assetManager.playSound('endboss_hurt');
        }
        if (this.endbossBar) {
            const percent = (this.health / this.maxHealth) * 100;
            const step = Math.floor(percent / 20) * 20;
            this.endbossBar.setValue(step);
            if (step === 0) {
                this.isDead = true;
                this.deathTime = now;
                this.assetManager.stopSound('endboss_hurt');
                this.assetManager.playSound('endboss_dead');
            }
        }
    }

    animate() {
        this.handleState();
        let frameCount;
        let assetType;
        if (this.isDead) {
            assetType = 'endboss_dead';
            frameCount = window.ASSETS.endboss_dead.length;
        } else if (this.isHurt) {
            assetType = 'endboss_hurt';
            frameCount = window.ASSETS.endboss_hurt.length;
        } else if (this.isAttacking) {
            assetType = 'endboss_attack';
            frameCount = window.ASSETS.endboss_attack.length;
        } else if (this.isWalking) {
            assetType = 'endboss_walk';
            frameCount = window.ASSETS.endboss_walk.length;
        } else {
            assetType = 'endboss_alert';
            frameCount = window.ASSETS.endboss_alert.length;
        }
        if (assetType !== this.currentAssetType) {
            this.currentImageIndex = 0;
            this.currentAssetType = assetType;
        }
        super.animateFrames(frameCount);
        if (this.isHurt && this.currentImageIndex >= frameCount - 1) {
            this.isHurt = false;
        }
    }
    
    handleState() {
        if (!this.character) return;
        const distance = Math.abs(this.x - this.character.x);
        const maxLeft = this.startX - 500;
        if (distance <= 500) this.hasEngaged = true;
        if (this.hasEngaged && distance > 500 && !this.isReturning) {
            this.isReturning = true;
            this.otherDirection = true; 
        }
        if (this.isReturning) {
            this.handleReturn();
        } else {
            this.handleNormalState(distance, maxLeft);
        }
    }
        
    handleNormalState(distance, maxLeft) {
        if (this.x > maxLeft) {
            if (distance <= 500) {
                this.isWalking = true;
                this.isAlert = false;
                this.moveLeft();
                if (distance <= 300) {
                    this.isAttacking = true;
                    this.isWalking = false;
                    if (Date.now() > this.nextAttackSoundTime) {
                        this.assetManager.playSound('attack');
                        this.nextAttackSoundTime = Date.now() + 1000 + Math.random() * 2000; 
                    }
                    
                } else {
                    this.isAttacking = false;
                }
            } else {
                this.isWalking = false;
                this.isAttacking = false;
                this.isAlert = true;
            }
        } else {
            this.isWalking = false;
            if (distance <= 200) {
                this.isAttacking = true;
                this.isAlert = false;
                if (Date.now() > this.nextAttackSoundTime) {
                    this.assetManager.playSound('attack');
                    this.nextAttackSoundTime = Date.now() + 1000 + Math.random() * 2000; 
                }
            } else {
                this.isAttacking = false;
                this.isAlert = true;
            }
        }
    }
        
    handleReturn() {
        if (this.x < this.startX) {
            this.moveRight();
            this.isWalking = true;
            this.isAlert = false;
            this.isAttacking = false;
        } else {
            this.isReturning = false;
            this.otherDirection = false; 
            this.isWalking = false;
            this.isAlert = true;
            this.hasEngaged = false;
        }
    }
    

    
}
