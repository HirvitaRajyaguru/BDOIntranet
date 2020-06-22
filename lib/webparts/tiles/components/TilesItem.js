var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import styles from './Tiles.module.scss';
import { Image, ImageFit } from 'office-ui-fabric-react';
var Tiles = /** @class */ (function (_super) {
    __extends(Tiles, _super);
    function Tiles(props) {
        return _super.call(this, props) || this;
    }
    Tiles.prototype.render = function () {
        return (React.createElement("a", { href: this.props.href, target: "_blank", role: "listitem" },
            React.createElement("div", { className: styles.pLinkItemWrapper },
                React.createElement(Image, { className: styles.pLinkItemImage, src: this.props.imageUrl, shouldFadeIn: true, imageFit: ImageFit.cover }))));
    };
    return Tiles;
}(React.Component));
export default Tiles;
//# sourceMappingURL=TilesItem.js.map