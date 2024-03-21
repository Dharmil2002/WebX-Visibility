 interface SeriesDetail {
  prefix: string;
  numericPart: string;
  numericValue: number;
}

export interface SeriesRange {
  from: string;
  to: string;
  itemCount: number;
}

export function nextKeyCode(keyCode: string) {
  const ASCIIValues = [...keyCode].map((char) => char.charCodeAt(0));

  const isAllZed = ASCIIValues.every((value) => value === 90);
  const isAllNine = ASCIIValues.every((value) => value === 57);
  const stringLength = ASCIIValues.length;

  if (isAllZed) return keyCode;

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

export function nextKeyCodeByN(keyCode, N) {
  for (let i = 0; i < N; i++) {
    keyCode = nextKeyCode(keyCode);
  }
  return keyCode;
}

export function adjustLength(input, n) {
  const padding = "_".repeat(n);
  return (input + padding).slice(0, n);
}

export function getCodesBetween(startCode, endCode, maxIterations = 10000) {
  const codeList = [];
  let currentCode = startCode;
  let iterations = 0;

  while (currentCode !== endCode && iterations < maxIterations) {
    codeList.push(currentCode);
    currentCode = nextKeyCode(currentCode);
    iterations++;
  }

  if (iterations === maxIterations) {
    console.warn(
      "Max iterations reached. Consider adjusting the increment logic."
    );
  }

  // Include the endCode in the list
  codeList.push(endCode);

  return {
    count: codeList.length,
    list: codeList,
  };
}

export function isBetween(input, startCode, endCode) {
  let bChk = false;
  let allCodes = getCodesBetween(startCode, endCode);
  bChk = allCodes.list.includes(input);
  return bChk;
}

export function splitSeries(
  startSeries: string,
  endSeries: string,
  splitFromSeries: string,
  splitToSeries: string
): SeriesRange[] {
  const lens: number[] = [
    startSeries.length,
    endSeries.length,
    splitFromSeries.length,
    splitToSeries.length,
  ];
  const allEqual: boolean = lens.every((v) => v === lens[0]);
  if (!allEqual) throw new Error("All inputs must have the same length.");
  // Function to extract the prefix and numeric part of a series string
  const extractDetails = (series: string): SeriesDetail => {
    const numericPartMatch = series.match(/\d+$/);
    if (!numericPartMatch) {
      throw new Error("Numeric part not found in series.");
    }
    const numericPart = numericPartMatch[0];
    const prefix = series.replace(numericPart, "");
    return {
      prefix: prefix,
      numericPart: numericPart,
      numericValue: parseInt(numericPart, 10),
    };
  };
  const startDetails = extractDetails(startSeries);
  const endDetails = extractDetails(endSeries);
  const splitFromDetails = extractDetails(splitFromSeries);
  const splitToDetails = extractDetails(splitToSeries);
  // Validate series consistency and range correctness
  if (
    startDetails.prefix !== endDetails.prefix ||
    startDetails.prefix !== splitFromDetails.prefix ||
    startDetails.prefix !== splitToDetails.prefix
  ) {
    throw new Error("All inputs must belong to the same series.");
  }
  if (
    startDetails.numericValue > endDetails.numericValue ||
    splitFromDetails.numericValue < startDetails.numericValue ||
    splitToDetails.numericValue > endDetails.numericValue ||
    splitFromDetails.numericValue > splitToDetails.numericValue
  ) {
    throw new Error(
      "Invalid range: Ensure start/end and splitFrom/splitTo are properly ordered and within bounds."
    );
  }
  // Calculate the total length of the numeric part for proper padding
  const numericLength = endDetails.numericPart.length;
  // Initialize the result array
  let result: SeriesRange[] = [];
  // Generate sub-range before the split range, if applicable
  if (splitFromDetails.numericValue > startDetails.numericValue) {
    const beforeStart = `${
      startDetails.prefix
    }${startDetails.numericPart.padStart(numericLength, "0")}`;
    const beforeEnd = `${splitFromDetails.prefix}${(
      splitFromDetails.numericValue - 1
    )
      .toString()
      .padStart(numericLength, "0")}`;
    const itemCount = splitFromDetails.numericValue - startDetails.numericValue;
    result.push({ from: beforeStart, to: beforeEnd, itemCount: itemCount });
  }
  // Include the split range itself
  const splitStart = `${
    splitFromDetails.prefix
  }${splitFromDetails.numericPart.padStart(numericLength, "0")}`;
  const splitEnd = `${
    splitToDetails.prefix
  }${splitToDetails.numericPart.padStart(numericLength, "0")}`;
  const splitItemCount =
    splitToDetails.numericValue - splitFromDetails.numericValue + 1;
  result.push({ from: splitStart, to: splitEnd, itemCount: splitItemCount });

  // Generate sub-range after the split range, if applicable
  if (splitToDetails.numericValue < endDetails.numericValue) {
    const afterStart = `${splitToDetails.prefix}${(
      splitToDetails.numericValue + 1
    )
      .toString()
      .padStart(numericLength, "0")}`;
    const afterEnd = `${endDetails.prefix}${endDetails.numericPart.padStart(
      numericLength,
      "0"
    )}`;
    const afterItemCount =
      endDetails.numericValue - splitToDetails.numericValue;
    result.push({ from: afterStart, to: afterEnd, itemCount: afterItemCount });
  }
  return result;
}
