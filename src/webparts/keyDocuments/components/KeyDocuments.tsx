import * as React from 'react';
import styles from './KeyDocuments.module.scss';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { IKeyDocumentsProps } from './IKeyDocumentsProps';
import { IKeyDocumentsState } from './IKeyDocumentsState';
import AllKeyDocuments from './AllKeyDocuments';
import { escape } from '@microsoft/sp-lodash-subset';
import Common from '../../common/common';
const logo: string = require('../assets/logo.png');
const excel: string = require('../assets/excel.png');
const pdf: string = require('../assets/pdf.png');
const word: string = require('../assets/word.png');


export default class KeyDocuments extends React.Component<IKeyDocumentsProps, IKeyDocumentsState> {
  public constructor(props: IKeyDocumentsProps, state: IKeyDocumentsState) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          File: {
            Name: "",
            LinkingUri: "",
            //FileRef: "",
            File_x0020_Type: ""
          },
          File_x0020_Type: "",
          HeadLine: "No KeyDocuments to Display",
          RespectivePageLink: {
            url: ''
          }
        }
      ]
    };
  }
  public async componentDidMount() {
    await this.GetItemsForDocuments();
  }
  //get Key Documents
  public GetItemsForDocuments = () => {
    let newCommonObj: Common = new Common();
    var listName = 'Documents';
    var url = this.props.siteurl;
    var query;
    if (this.props.Practices == true)
      query = `?$select=File,File_x0020_Type&$expand=File&$top=3`;

    else
      query = `?$select=File,File_x0020_Type&$expand=File`;

    var method = 'get items for Documents';
    newCommonObj.getDataFromList(url, listName, query, method).then(res => {
      console.log("processesing")
      if (res.data.value != undefined && res.data.value != null) {
        if (res.data.value.length > 0) {
          //response not null then setState this Response
          const items = res.data.value;
          this.setState({ items });
        }
      }
    }).catch(error => {
      console.log('error while getting data');
      console.log(error);
    });
  }
  public render(): React.ReactElement<IKeyDocumentsProps> {
    return (
      <div className={styles.keyDocuments}>
        <div className={styles.container}>
          <h2 className={styles.header}>KEY DOCUMENTS</h2>
          <div className={`ms-Grid ${styles.keyblk}`} dir="ltr">
            {this.state.items.map((item, key) => {
              return (<div className="ms-Grid-row">
                <div className={`ms-Grid-col ms-sm1 ms-md1 ${styles.docimg}`}>
                  {/*check File Type*/}
                  {item.File_x0020_Type == 'xlsx' ? (
                    <img src={`${excel}`} />
                  ) :
                    item.File_x0020_Type == 'pdf' ?
                      (
                        <img src={`${pdf}`} />)
                      : (
                        <img src={`${word}`} />)
                  }
                </div>
                <div className="ms-Grid-col ms-sm10 ms-md10 filename">
                  <Link href={`${item.File.LinkingUri}`} target='_blank' className={styles.text}>{item.File.Name}</Link>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }
}

