const defaultRootFontSize = 16;

function getRootFontSize() {
  if (!document ||
      !document.querySelector ||
      !window ||
      !window.getComputedStyle) {
    return defaultRootFontSize;
  }

  var root = document.querySelector(':root');
  var rawRootFontSize = window.getComputedStyle(root).getPropertyValue('font-size');
  return parseInt(rawRootFontSize.split('px')[0]);
}

export function Rem(rootFontSize = defaultRootFontSize) {
  return function rem(value, decimalPlaces = 4) {
    if (rootFontSize === 'd' || rootFontSize === 'dynamic') {
      rootFontSize = getRootFontSize();
    }

    var decimalPlaces = parseInt(decimalPlaces, 10),
        unRounded = value/rootFontSize,
        roundingMultiplier = Math.pow(10, decimalPlaces),
        rounded = Math.round(unRounded * roundingMultiplier) / roundingMultiplier;

    return `${rounded}rem`;
  };
}

export function px(value) {
  return `${value}px`;
}
