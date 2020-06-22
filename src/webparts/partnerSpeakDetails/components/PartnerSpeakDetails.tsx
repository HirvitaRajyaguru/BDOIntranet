import * as React from 'react';
import styles from './PartnerSpeakDetails.module.scss';
import { IPartnerSpeakDetailsProps } from './IPartnerSpeakDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Loader } from '../../common/Loading';
import axios from 'axios';

//Interface of the state for this webpart.
export interface IPartnerSpeakDetailsState {
  isLoading: boolean;
  speaks: {
    "Title": string,
    "Description": string,
    WriterImage: {
      "Url": string,
      "Description": string,
    },
    BannerImage: {
      "Url": string,
      "Description": string,
    };
  };
}

export default class PartnerSpeakDetails extends React.Component<IPartnerSpeakDetailsProps, IPartnerSpeakDetailsState> {

  constructor(props: IPartnerSpeakDetailsProps, state: IPartnerSpeakDetailsState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      speaks: {
        "Title": "No Partner Speak.",
        "Description": "",
        WriterImage: {
          "Url": "",
          "Description": "",
        },
        BannerImage: {
          "Url": "",
          "Description": "",
        },
      }
    };
  }

  public componentDidMount() {
    this.LoadSpeak();
  }

  // Load the partner's speak from the list by filtering that expiryDate is grater or equal the date of today.  
  private async LoadSpeak() {
    await axios.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.ListName}')/items()?$filter=(ExpiryDate ge datetime'${new Date(new Date().setDate((new Date().getDate() - 1))).toISOString()}')&$orderby=ID desc`)
      .then(res => {

        // Check that data is not empty and getting the actual result in response.
        if (res.data.value.length > 0) {

          // Assign the data in the state rendering
          this.setState({
            speaks: res.data.value[0]
          });
        }
        // After data is loaded set the loading screen to false to display actual data to the use..
        this.setState({
          isLoading: false
        });
      })
      .catch((error) => {
        // Handle the error if any.
        console.log(error);
      });
  }

  public render(): React.ReactElement<IPartnerSpeakDetailsProps> {
    // This function return the loading screen or data based on the state IsLoading
    return (
      <div className={styles.partnerSpeakDetails}>
        {(!this.state.isLoading) ? <FullSpeak bindoutput={this.state.speaks} /> : <Loader message="Please wait..." />}
      </div>
    );
  }
}

// A functional component which will rander the screen with the data
const FullSpeak = (props) => {
  return (
    <div>
      {
        // Check that data is empty or not and display appropriate message id data is empty.
        (props.bindoutput.Title === "No Partner Speak.")
        ?
        <div>
          <h2>PARTNER'S SPEAK</h2>
          <h3>{props.bindoutput.Title}</h3>
        </div>
        :
        <div>
          <h2>PARTNER'S SPEAK</h2>
          <div className={styles.row}>
            <div className={styles.svtColSmall}>
              <img className={styles.svtImg} src={props.bindoutput.WriterImage.Url} alt={props.bindoutput.WriterImage.Description} />
            </div>
            <div className={styles.svtCol}>
              <img className={styles.svtImg} src={props.bindoutput.BannerImage.Url} alt={props.bindoutput.BannerImage.Description} />
            </div>
          </div>
          <div className={`${styles.row} ${styles.title}`}><h1>{props.bindoutput.Title}</h1></div>
          <div className={styles.row}>
            <div dangerouslySetInnerHTML={{ __html: props.bindoutput.Description.replace(/\n/g, '<br />') }} />
          </div>
        </div >
      }
    </div>
  );
};
