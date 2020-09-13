"use strict";
(function (window) {
    console.log(window);
    var effects = new Map();
    var reactivities = new Map();
    var currentEffect = null;
    function effect(fn) {
        currentEffect = fn;
        fn();
        currentEffect = null;
    }
    function reactive(object) {
        if (reactivities.has(object))
            return reactivities.get(object);
        var observed = new Proxy(object, {
            get: function (object, propety) {
                if (currentEffect) {
                    if (!effects.has(object))
                        effects.set(object, new Map);
                    if (!effects.get(object).has(propety))
                        effects.get(object).set(propety, new Array);
                    effects.get(object).get(propety).push(currentEffect);
                }
                return object[propety];
            },
            set: function (object, propety, value) {
                object[propety] = value;
                for (var _i = 0, _a = effects.get(object).get(propety); _i < _a.length; _i++) {
                    var effect_1 = _a[_i];
                    effect_1();
                }
                return true;
            }
        });
        reactivities.set(object, observed);
        return observed;
    }
    if (typeof window !== 'undefined' && !window.effect) {
        window.effect = effect;
    }
    if (typeof window !== 'undefined' && !window.reactive) {
        window.reactive = reactive;
    }
})(window);
