class Human {
    constructor(name,HP=100,MAX_HP=100,MP=9999){
        this.name = name
        this.HP = HP
        this.MP = MP
        this.MAX_HP = MAX_HP;
        this.selfHealingSystem = setInterval(() => {
            this.HP = Math.min(this.HP+1,this.MAX_HP)
        }, 1000);
    }
    hurt(f){
        this.HP = this.HP - f.damage
        if(f.damage>10)
            console.log('花Q,',f.by.name,'!');
        if(this.HP <= 0)
            clearInterval(this.selfHealingSystem)
    }
}

class Dog {
    constructor(name,HP=100,MAX_HP=100,MP=1,WaZa,ATK=5){
        this.name = name
        this.HP = HP
        this.MP = MP
        this.MAX_HP = MAX_HP;
        this.ATK = ATK;
        this.WaZa = WaZa
    }
}

const DogDogWaZa = {
    '终极咬碎':5.4,
    '咬碎':1.8,
    '抓':0.4
}

const DogA = new Dog('路过的狗A',100,150,5,DogDogWaZa)
const HumanA = new Human('张三')

HumanA.hurt({
    by: DogA,
    damage: DogA.ATK * DogDogWaZa['终极咬碎']
})