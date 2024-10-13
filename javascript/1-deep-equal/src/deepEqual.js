function deepEqual(...args) {
    if (args.length < 2) {
        throw new Error('Both "actual" and "expected" arguments must be specified');
    }

    if (args.length > 2) {
        throw new Error('deepEqual takes only "actual" and "expected" arguments');
    }

    const compareUtils = {
        getType(payload) {
            if (Array.isArray(payload)) return 'array';

            if (typeof payload === 'object') return 'object';

            if (typeof payload === 'function') return 'function';

            return 'primitive';
        },

        comparePrimitives(a, b) {
            return Object.is(a, b);
        },

        compareFunctions(a, b) {
            return a.name === b.name;
        },
    }

    const [actual, expected] = args;

    const checkEquality = (asIs, toBe, nodeName) => {
        const asIsType = compareUtils.getType(asIs);
        const toBeType = compareUtils.getType(toBe);

        if (asIsType !== toBeType) {
            return nodeName;
        }

        if ((asIsType === 'primitive') && (toBeType === 'primitive')) {
            return compareUtils.comparePrimitives(asIs, toBe) ? '' : nodeName;
        }

        if ((asIsType === 'function') && (toBeType === 'function')) {
            return compareUtils.compareFunctions(asIs, toBe) ? '' : nodeName;
        }

        for (prop of [...new Set([...Object.keys(asIs), ...Object.keys(toBe)])]) {
            const res = checkEquality(asIs[prop], toBe[prop], nodeName + (Number.isNaN(Number(prop)) ? `.${prop}` : `[${prop}]`));
            
            if (res.length) {
                return res;
            } else continue;
        }

        return '';
    }

    const result = checkEquality(actual, expected, '$');

    if (result.length) {
        return 'Error: '.concat(result);
    }

    return 'OK';

}
