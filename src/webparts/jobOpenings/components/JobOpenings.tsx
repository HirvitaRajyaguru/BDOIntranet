import * as React from 'react';
import styles from './JobOpenings.module.scss';
import { IJobOpeningsProps } from './IJobOpeningsProps';
import { IJobOpeningsState } from './IJobOpeningsState';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import 'react-tabs/style/react-tabs.css';
import 'react-tabs/style/react-tabs.css';
import Jobopening from './JobOpening';
import NewJoinee from './NewJoinee';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, IPivotStyles } from 'office-ui-fabric-react/lib/Pivot';
import { Image, Stack, IStackTokens, Text, ITextStyles, IStyle } from 'office-ui-fabric-react';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';

export default class JobOpenings extends React.Component<IJobOpeningsProps, IJobOpeningsState> {


  public constructor(props: IJobOpeningsProps) {
    super(props);

  }

  public async componentDidMount() {
   
  }

  //will call it whenever props are changed
  public componentWillReceiveProps(nextProps): void {
   
  }
  public render(): React.ReactElement<IJobOpeningsProps> {
    let pivotStyles: IPivotStyles = {
      link: {
        backgroundColor: NeutralColors.black,
        padding: '0 12px!important',
        margin: '0 auto',
        borderRight: '1px solid #e5e5e5!important',
        width: '50%'
      },
      linkContent: {
        color: '#333 !important',
        fontSize: FontSizes.size12,
        margin: '0 auto',
        textAlign: 'center',
        display: 'inherit'
      },
      linkIsSelected: {
        backgroundColor: NeutralColors.gray160,
        margin: '0 auto',
        borderRight: '1px solid #e5e5e5!important',
        width: '50%'
      },
      text: {
        color: NeutralColors.white
      },
      icon: {},
      count: {},
      root: {
      }
    };
    return (
      <div className={styles.jobOpenings} >
        <div className={styles.container}>
          <Pivot linkFormat={PivotLinkFormat.tabs} aria-label="Links of Tab"  styles={pivotStyles}>
            <PivotItem headerText="CAREERS" >
              <Jobopening siteUrl={this.props.siteUrl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                graphClient={this.props.graphClient} serviceline={this.props.serviceline} location={this.props.location} newjoineelistId={this.props.newjoineelistId}  />
            </PivotItem>
            <PivotItem headerText="NEW JOINERS">
              <NewJoinee siteUrl={this.props.siteUrl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                graphClient={this.props.graphClient}  serviceline={this.props.serviceline} location={this.props.location} newjoineelistId={this.props.newjoineelistId}  />
            </PivotItem>
          </Pivot>
        </div>
      </div>
    );
  }
}


{/*<Tabs >
  <TabList>
    <Tab>CAREERS</Tab>
    <Tab>JOINEERS</Tab>
  </TabList>

  <TabPanel>
    <Jobopening siteUrl={this.props.siteUrl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
      graphClient={this.props.graphClient} records={this.props.records} serviceline={this.props.serviceline} location={this.props.location} />
  </TabPanel>

  <TabPanel>
    <NewJoinee siteUrl={this.props.siteUrl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
      graphClient={this.props.graphClient} records={this.props.records} serviceline={this.props.serviceline} location={this.props.location} />
  </TabPanel>
</Tabs>*/}
