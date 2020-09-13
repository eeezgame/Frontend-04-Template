
let effects = new Map()
let reactivities = new Map()
let currentEffect:any = null

function effect(fn:any){
    currentEffect = fn
    fn()
    currentEffect =null
}
function reactive (object:object) {
    if (reactivities.has(object)) return reactivities.get(object)

    let observed = new Proxy(object,{
        get(object:any, propety:string){
            if(currentEffect){
                if(!effects.has(object))
                    effects.set(object,new Map);
                if(!effects.get(object).has(propety))
                    effects.get(object).set(propety, new Array)
                effects.get(object).get(propety).push(currentEffect)
            }
            return object[propety]
        },
        set(object, propety ,value){
            object[propety] = value;
            for(let effect of effects.get(object).get(propety)){
                effect()
            }
            return true
        }
    })
    reactivities.set(object, observed)
    return observed
}


if (typeof window !== 'undefined' && window.effect) {
    window.effect = effect
}

if (typeof window !== 'undefined' && window.reactive) {
    window.reactive = reactive
}
