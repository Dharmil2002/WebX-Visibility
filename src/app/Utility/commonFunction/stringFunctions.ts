export function nextKeyCode(keyCode: string) {

    const ASCIIValues = [...keyCode].map(char => char.charCodeAt(0));

    const isAllZed = ASCIIValues.every(value => value === 90);
    const isAllNine = ASCIIValues.every(value => value === 57);
    const stringLength = ASCIIValues.length;

    if(isAllZed)
        return keyCode;
                
    if (isAllNine) {
        ASCIIValues[stringLength - 1] = 47;
        ASCIIValues[0] = 65;

        for (let i = 1; i < stringLength - 1; i++) {
            ASCIIValues[i] = 48;
        }
    }

    for (let i = stringLength; i > 0; i--) {
        if (i - stringLength === 0) {
            ASCIIValues[i - 1] += 1;
        }

        if (ASCIIValues[i - 1] === 58) {
            ASCIIValues[i - 1] = 48;

            if (i - 2 === -1) {
                break;
            }

            ASCIIValues[i - 2] += 1;
        } else if (ASCIIValues[i - 1] === 91) {
            ASCIIValues[i - 1] = 65;

            if (i - 2 === -1) {
                break;
            }

            ASCIIValues[i - 2] += 1;
        } else {
            break;
        }
    }
    keyCode = String.fromCharCode(...ASCIIValues);
    return keyCode;
}

export function nextKeyCodeByN (keyCode, N) {
    for (let i = 0; i < N; i++) {
        keyCode = nextKeyCode(keyCode);
        console.log(keyCode);
    }
    return keyCode;
}

export function adjustLength (input, n) {
    const padding = '_'.repeat(n);
    return (input + padding).slice(0, n);
}

export function  getCodesBetween (startCode, endCode, maxIterations = 10000) {
    const codeList = [];
    let currentCode = startCode;
    let iterations = 0;

    while (currentCode !== endCode && iterations < maxIterations) {
        codeList.push(currentCode);
        currentCode = nextKeyCode(currentCode);
        iterations++;
    }

    if (iterations === maxIterations) {
        console.warn("Max iterations reached. Consider adjusting the increment logic.");
    }

    // Include the endCode in the list
    codeList.push(endCode);

    return {
        count: codeList.length,
        list: codeList,
    };
}

export function isBetween (input, startCode, endCode) {
    let bChk = false;
    let allCodes = getCodesBetween(startCode, endCode);
    bChk = allCodes.list.includes(input);
    return bChk;
}