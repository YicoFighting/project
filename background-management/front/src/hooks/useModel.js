import { computed } from "vue";

export default (props, propName, emits) => {
    return computed({
        get: () => {
            return new Proxy(props[propName], {
                get(target, key) {
                    return Reflect.get(target, key);
                },
                set(target, key, value) {
                    emits("update:" + propName, {
                        ...target,
                        [key]: value,
                    });
                    return true;
                },
            });
        },
    });
};
