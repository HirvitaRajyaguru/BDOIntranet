import * as React from 'react';
import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IBirthdayState } from './IBirthdayState';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Birthday from './Birthday';
import Anniversary from './Anniversary';
import Rewards from './Rewards';
import 'react-tabs/style/react-tabs.css';
import { sp, Web, Items } from 'sp-pnp-js';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import { Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, IPivotStyles } from 'office-ui-fabric-react/lib/Pivot';
import { any } from 'prop-types';
import { NeutralColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType';


export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdayState> {

  public constructor(props: IBirthdaysProps) {
    super(props);
  }

  public async componentDidMount() {
    //Get Current logged in User-Id
    let web = new Web(this.props.siteurl);
    await web.currentUser.get().then((r: CurrentUser) => {
      this.setState({
        currentUserId: r["Id"]
      });
    });
  }

  //will call it whenever props are changed
  public componentWillReceiveProps(nextProps): void {
  }
  public render(): React.ReactElement<IBirthdaysProps> {
    let pivotStyles: IPivotStyles = {
      link: {
        backgroundColor: NeutralColors.black,
      //  padding: '0 12px!important',
        padding: '0 !important',
        margin: '0 auto',
        borderRight: '1px solid #e5e5e5!important',
       // width: '40%',
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
        //width: '33.33%'
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
      <div className={styles.birthdays} >
        <div className={styles.container}>
          <Pivot linkFormat={PivotLinkFormat.tabs} aria-label="Links of Tab" styles={pivotStyles}>
            <PivotItem headerText="BIRTHDAYS">
              <Birthday siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location} rewardlistId={this.props.rewardlistId} />
            </PivotItem>
            <PivotItem headerText="TENURE MILESTONE">
              <Anniversary siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location} rewardlistId={this.props.rewardlistId} />
            </PivotItem>
            <PivotItem headerText="REWARDS">
              <Rewards siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location} rewardlistId={this.props.rewardlistId} />
            </PivotItem>
          </Pivot>
        </div>
      </div>
    );
  }
}

{/*<Tabs >
            <TabList>
              <Tab>BirthDay</Tab>
              <Tab>Service Anniversary</Tab>
              <Tab>New Joinee</Tab>
            </TabList>
            <TabPanel>
              <Birthday siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location} />
            </TabPanel>
            <TabPanel>
              <Anniversary siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location}/>
            </TabPanel>
            <TabPanel>
              <NewJoinee siteurl={this.props.siteurl} listId={this.props.listId} currentUserEmail={this.props.currentUserEmail}
                msGraphClient={this.props.msGraphClient} serviceline={this.props.serviceline} location={this.props.location}/>
            </TabPanel>
          </Tabs>*/}
