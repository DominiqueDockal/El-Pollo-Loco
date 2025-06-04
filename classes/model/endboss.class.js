class Endboss extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 50) {
        super(x, y, canvas, assetManager, 'endboss_walk', 4);
        this.scale = 0.8;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isHurt = false;
        this.isDead = false;
        this.currentAssetType = 'endboss_walk';
        this.canHit = true;
        this.lastHitTime = 0;
        this.hitCooldown = 500;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.deathTime = null;
        this.endbossBar = null;
        this.isAttacking = false;
        this.isAlert = false;
        super.setDimensions(this.scale);
    }

    setEndbossBar(endbossBar) {
        this.endbossBar = endbossBar;
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
        } else if (this.isAlert) {
            assetType = 'endboss_alert';
            frameCount = window.ASSETS.endboss_alert.length;
        } else {
            assetType = 'endboss_walk';
            frameCount = window.ASSETS.endboss_walk.length;
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
        // Hier später die State-Logik für Angriffe/Verhalten implementieren
        // Beispiel: if (playerInRange) this.isAttacking = true;
    }

    
}
