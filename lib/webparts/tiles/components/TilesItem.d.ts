import * as React from 'react';
export interface ITileItemProps {
    imageUrl: string;
    title: string;
    description: string;
    href: string;
}
export default class Tiles extends React.Component<ITileItemProps, {}> {
    constructor(props: ITileItemProps);
    render(): React.ReactElement<ITileItemProps>;
}
//# sourceMappingURL=TilesItem.d.ts.map