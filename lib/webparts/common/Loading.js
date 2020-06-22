/*
 * This file contains a functional component for loading screen (A loading spinner).
*/
import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
export var Loader = function (props) {
    return (React.createElement("div", null,
        React.createElement(Spinner, { size: SpinnerSize.large, label: props.message })));
};
//# sourceMappingURL=Loading.js.map