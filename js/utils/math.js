export const lerp = function(start, target, easing){
    return start + (target - start) * easing;
};

export const cubicOut = function(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
};

export const cubicIn = function(t) {
    return t * t * t;
};

export const expoOut = function(t) {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
};

export const cubicInOut = function(t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  }