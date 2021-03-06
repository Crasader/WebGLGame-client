/* LivingBeing */
var LivingBeing = function(){
	this.currentAnimationName = "";
}

LivingBeing.prototype.lookAt = function(position){
	var deltaX = position.x - this.moveObj.currentPosition.x;
	var deltaY = position.y - this.moveObj.currentPosition.y;
	var newRot = Math.atan(deltaY/deltaX);
	if(deltaX < 0){
		newRot += Math.PI;
	}
	//otherCharacter.skin.rotation.z = newRot + otherCharacter.baseRotationZ;
	var diff = newRot - this.oldRot;
	if(!isNaN(diff)){
		this.oldRot = newRot;
		this.skin.rotateAroundWorldAxis(new THREE.Vector3(0,1,0), diff);
	}
}

LivingBeing.prototype.changeAnimationRealName = function(newAnimName){
	//search for the animation among the model's animations
	var animIndex = 0;
	for(var i=0;i<this.skin.geometry.animations.length;i++){
		var thisAnim = this.skin.geometry.animations[i];
		if(thisAnim.name == newAnimName){
			animIndex = i;
			break;
		}
	}
	this.skin.geometry.animation = this.skin.geometry.animations[animIndex];
	
	this.animation = new THREE.Animation(
		this.skin,
		this.skin.geometry.animation.name,
		THREE.AnimationHandler.LINEAR
	);
	
	this.animation.reset();
	this.animation.play();
}
	
LivingBeing.prototype.changeAnimation = function(newAnimName){
	//changes the animation based on a generic animation name, i.e. 'walk'
	//real animation name will be something like "walk-dog"
	this.currentAnimationName = newAnimName;
	this.changeAnimationRealName(newAnimName + "-" + this.modelType);
}
	
LivingBeing.prototype.isPerforming = function(animName){
	//returns if this animation is doing the action specified
	return this.currentAnimationName == animName;
}

LivingBeing.prototype.stopAnimation = function(){
	//stops the animation, changes to walk, resets, and prepares it again
	this.animation.stop();
	this.changeAnimation("walk");
	this.animation.reset();
	this.animation.play();
	this.animation.update(.01);
}

LivingBeing.prototype.playWalk = function(animAmount){
	//sets this LivingBeing's animation to walk, if not already set, and animates by the animAmount
	//check if the animation is set to walk, if not, set it
	if(!this.isPerforming("walk") || !this.animation.isPlaying){
		this.changeAnimation("walk");
	}
	this.animation.update(animAmount);
}

LivingBeing.prototype.playShoot = function(){
	//sets this LivingBeing's animation to shoot, if not already set, and animates a little bit to prepare for movement which
	//is taken care of in moveAllAnimations
	//check if the animation is set to shoot, if not, set it
	if(!this.isPerforming("shoot") || !this.animation.isPlaying){
		this.changeAnimation("shoot");
	}
	this.animation.update(.01);
}

LivingBeing.prototype.playChop = function(){
	if(!this.isPerforming("chop") || !this.animation.isPlaying){
		this.changeAnimation("chop");
	}
	this.animation.update(.01);
}

LivingBeing.prototype.playSearch = function(){
	if(!this.isPerforming("search") || !this.animation.isPlaying){
		this.changeAnimation("search");
	}
	this.animation.update(.01);
}

/* end LivingBeing */

var moveObj = function(){
	this.moving = false;
	this.moveTo = {x:0,y:0};
	this.moveDistEach = {x:0,y:0};
	this.distX = 0;
	this.distY = 0;
	this.numStepsRequired = 1;
	this.numStepsSoFar = 0;
	this.currentPosition = {x:0,y:0};
}

function createMoveEvent(pointObj){
	//creates a new destination based on character's current position and the destination given by pointObj
	var destination = {x: pointObj.point.x, y: pointObj.point.y};
	return destination;
}

var weaponParticleTexture = THREE.ImageUtils.loadTexture("img/textures/particle2.png");
var weapon = function(type, weaponParticleSelection){
	var wepProperty = weaponProperties[type];
	this.wepProperty = wepProperty;
	this.weaponTexture = THREE.ImageUtils.loadTexture(wepProperty.texture);
	this.materialWeapon = new THREE.MeshBasicMaterial({
		side: THREE.DoubleSide,
		map: this.weaponTexture,
		//transparent: true,
		//side: THREE.DoubleSide
	});
	
	this.entity = new THREE.Mesh(new THREE.BoxGeometry(wepProperty.width, wepProperty.length, wepProperty.width, 1, 1, 1), this.materialWeapon);
	this.entity.scale.x = this.entity.scale.y = this.entity.scale.z = .25;
	this.entity.rotateAroundWorldAxis(new THREE.Vector3(0,0,1), Math.PI/2);
	this.entity.position.z = 3;
	if(type != 0){
		this.entity.position.y = 12;
		this.entity.position.x = 3;
	}else{
		this.entity.position.y = 10;
	}
	this.entity.rotation.z += Math.PI/8;
	this.basePositionY = this.entity.position.y;
	this.baseRotationZ = this.entity.rotation.z;
	this.type = type;
	
	//add particles
	var numParticles = 15;
	this.particles = new THREE.Geometry();
	this.pMaterial = new THREE.ParticleBasicMaterial({
		size: 20,
		map: particleTexture,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	
	this.pVariation = {x: wepProperty.width, y: wepProperty.length * .85, z: wepProperty.width};
	this.pMax = {x: 0, y: wepProperty.length / 2 + 3, z: 0};
	for(var p=0;p<numParticles;p++){
		var pX = Math.random() * this.pVariation.x - this.pMax.x;
		var pY = Math.random() * this.pVariation.y - this.pMax.y;
		var pZ = Math.random() * this.pVariation.z - this.pMax.z;
		var particle = new THREE.Vector3(pX, pY, pZ);
		this.particles.vertices.push(particle);
	}
	
	this.particleSystem = new THREE.ParticleSystem(this.particles, this.pMaterial);
	this.particleSystem.sortParticles = true;
	this.entity.add(this.particleSystem);
	
	this.cock = function(){
		var cockTime = 250;
		var cockDistance = Math.PI/8;
		
		//first change particles
		var matIncrease = 10;
		var varYIncrease = 30;
		var maxYIncrease = 30;
		this.pMaterial.size += matIncrease;
		this.pVariation.y += varYIncrease;
		this.pMax.y += maxYIncrease;
		
		var wepRef = this;
		setTimeout(function(){
			wepRef.pMaterial.size -= matIncrease;
			wepRef.pVariation.y -= varYIncrease;
			wepRef.pMax.y -= maxYIncrease;
		}, cockTime);
		
		//only cock if its not already cocked
		if(this.entity.rotation.z == this.baseRotationZ){
			this.entity.position.y = 10;
			this.entity.rotation.z -= cockDistance;
			setTimeout(function(){
				wepRef.entity.position.y = wepRef.basePositionY;
				wepRef.entity.rotation.z = wepRef.baseRotationZ;
			}, cockTime);
		}
	}
	
	this.moveParticles = function(){
		var pVertices = this.particles.vertices;
		for(var n=0;n<pVertices.length;n++){
			var vert = pVertices[n];
			var pX = Math.random() * this.pVariation.x - this.pMax.x;
			var pY = Math.random() * this.pVariation.y - this.pMax.y;
			var pZ = Math.random() * this.pVariation.z - this.pMax.z;
			vert.set(pX, pY, pZ);
		}
		Math.random()
		this.pMaterial.opacity = Math.random() * (1- .5) + .5;
		this.particleSystem.geometry.verticesNeedUpdate = true;
	}
	
	this.setParticleColor = function(newColor){
		this.pMaterial.color.setHex("0x" + newColor.toString(16));
	}
	
	//initially set the appropriate color of the particles based on the currently selected firing particle
	//sometimes this can be undefined
	weaponParticleSelection = weaponParticleSelection ? weaponParticleSelection : 0;
	this.setParticleColor(particleProperties[weaponParticleSelection].color);
}

var healthPlane = function(health,maxHealth){
	var planeHeight = 40;
	this.maxHealth = maxHealth;
	this.currentHealth = health;
	
	this.materialRemaining = new THREE.MeshBasicMaterial({
		color: 0x339900, //green
		transparent: true,
		depthTest: false
	});
	
	this.materialTotal = new THREE.MeshBasicMaterial({
		color: 0xDF0101, //red
		wireframe: true,
		transparent: true,
		depthTest: false
	});
	
	this.totalEntity = new THREE.Mesh(new THREE.PlaneGeometry(31, 5), this.materialTotal);
	this.remainingEntity = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), this.materialRemaining);
	
	this.remainingEntity.scale.y = this.currentHealth/this.maxHealth;
	
	this.entity = new THREE.Object3D();
	this.entity.add(this.totalEntity);
	this.entity.add(this.remainingEntity);
	
	//this.entity.rotation.z = Math.PI/2;
	this.entity.position.y = planeHeight;
	
	//set up initial rotation (primarily used for users entering the world)
	if(otherCharacterList[connectionNum] != undefined){
		var otherCharRot = otherCharacterList[connectionNum].healthPlane.entity.rotation;
		this.entity.rotation.x = otherCharRot.x;
		this.entity.rotation.y = otherCharRot.y;
		this.entity.rotation.z = otherCharRot.z;
	}else{
		//they are just joining, so everything is at the default rotation
		this.entity.rotation.x = 0;
		this.entity.rotation.y = 0;
		this.entity.rotation.z = 0;
	}
	
	this.newHealth = function(newHealth){
		//sets health bar size based on newHealth
		this.currentHealth = newHealth;
	}
}

var pMoveIndex = 0;
function moveAllWeaponParticles(){
	pMoveIndex++;
	if(pMoveIndex > 5){
		for(var i=0;i<otherCharacterList.length;i++){
			//they could have logged off
			if(otherCharacterList[i]){
				var thisWeapon = otherCharacterList[i].weapon;
				thisWeapon.moveParticles();
			}
		}
		pMoveIndex = 0;
	}
}
