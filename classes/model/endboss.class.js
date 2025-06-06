class Endboss extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'endboss_alert', 6);
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
        this.returnCooldown = 4000;
        this.initialEngageTime = null;
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
        if (!this.isDead) this.assetManager.playSound('endboss_hurt');
        if (this.endbossBar) {
            const percent = (this.health / this.maxHealth) * 100;
            const step = Math.floor(percent / 20) * 20;
            this.endbossBar.setValue(step);
            if (step === 0) this.handleDeath(now);
        }
    }
    
    handleDeath(now) {
        this.isDead = true;
        this.deathTime = now;
        this.assetManager.stopSound('endboss_hurt');
        this.assetManager.playSound('endboss_dead');
    }

    animate() {
        this.handleState();
        let assetType;
        if (this.isDead) assetType = 'endboss_dead';
        else if (this.isHurt) assetType = 'endboss_hurt';
        else if (this.isAttacking) assetType = 'endboss_attack';
        else if (this.isWalking) assetType = 'endboss_walk';
        else assetType = 'endboss_alert';
        const frameCount = this.assetManager.getAssetCount(assetType);
        if (assetType !== this.currentAssetType) {
            this.currentImageIndex = 0;
            this.currentAssetType = assetType;
        }
        super.animateFrames(frameCount);
        if (this.isHurt && this.currentImageIndex >= frameCount - 1) this.isHurt = false;
    }
    
    handleState() {
        if (!this.character || this.isDead) return;
        const distance = Math.abs(this.x - this.character.x);
        const maxLeft = this.startX - 500;
        if (distance <= 500 && !this.hasEngaged) {
            this.hasEngaged = true;
            this.initialEngageTime = Date.now();
        }
        const timeSinceEngagement = Date.now() - this.initialEngageTime;
        const shouldReturn = (this.hasEngaged && timeSinceEngagement >= this.returnCooldown) || (this.hasEngaged && distance > 500);
        if (shouldReturn && !this.isReturning) {
            this.isReturning = true;
            this.otherDirection = true;
        }
        if (this.isReturning) this.handleReturn();
        else this.handleNormalState(distance, maxLeft);
    }
 
    handleNormalState(distance, maxLeft) {
        const now = Date.now();
        if (this.x > maxLeft) this.handleInRangeState(distance, now);
        else {
            this.isWalking = false;
            if (distance <= 100) {
                this.isAttacking = true;
                this.isAlert = false;
                this.handleAttack(now);
            } else {
                this.isAttacking = false;
                this.isAlert = true;
            }
        }
    }
    
    handleInRangeState(distance, now) {
        if (distance <= 500) {
            this.handleWalk();
            if (distance <= 200) {
                this.isAttacking = true;
                this.isWalking = false;
                this.handleAttack(now);
            } else this.isAttacking = false;
        } else this.handleAlert();
    }
    
    handleAttack(now) {
        if (!this.isDead && now > this.nextAttackSoundTime) {
            this.assetManager.playSound('attack'); 
            this.nextAttackSoundTime = now + 1000 + Math.random() * 2000;
        }
    }
    
    handleWalk() {
        this.isWalking = true;
        this.isAlert = false;
        if (!this.isDead) this.moveLeft();
    }

    handleAlert() {
        this.isWalking = false;
        this.isAttacking = false;
        this.isAlert = true;
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
