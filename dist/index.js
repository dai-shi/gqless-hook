var e=require("react"),n="undefined"==typeof window||/ServerSideRendering/.test(window.navigator&&window.navigator.userAgent)?function(e){return e()}:e.useLayoutEffect;exports.useQuery=function(r){var t=e.useReducer(function(e){return e+1},0)[1],u=e.useRef(!1);if(u.current)throw new Promise(function(e){r.scheduler.commit.onFetched.then(e)});var c=e.useCallback(function(){u.current=!0},[]),o=e.useCallback(function(){u.current=!1},[]);return r.scheduler.commit.onActive.then(c),r.scheduler.commit.onFetched.then(o),n(function(){u.current?t():r.scheduler.commit.accessors.size>0&&(u.current=!0,t())}),r.query};
//# sourceMappingURL=index.js.map
