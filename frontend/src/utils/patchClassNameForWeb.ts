if (typeof document !== 'undefined') {
  // 1. Add className to the forwardedProps allowlist so View/Text/TouchableOpacity
  //    don't strip it before passing props to createElement/createDOMProps.
  //    This must run before any RN Web component module loads its forwardPropsList.
  const fwdMod = require('react-native-web/dist/cjs/modules/forwardedProps');
  fwdMod.defaultProps.className = true;

  // 2. Patch createDOMProps so the generated RN atomic class and the user-supplied
  //    className are merged rather than the generated one overwriting the user's.
  const domPropsMod = require('react-native-web/dist/cjs/modules/createDOMProps');
  const original = domPropsMod.default;
  domPropsMod.default = function patchedCreateDOMProps(elementType, props, options) {
    const userClassName = props && props.className;
    const result = original(elementType, props, options);
    if (userClassName) {
      result.className = [result.className, userClassName].filter(Boolean).join(' ');
    }
    return result;
  };
}
