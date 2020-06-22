
import * as React from 'react';
import styles from './EmployeeStories.module.scss';
import { IEmployeeStoriesProps } from './IEmployeeStoriesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IEmployeeStoriesState } from './IEmployeeStoriesState';
import common from '../../common/common';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export interface IEmployeeStoriesState {
  image: [{
    ServerRelativeUrl: string
  }];
  items: [ 
    {
      ID: number;
      Title: string;
      Description: string;
      AttachmentFiles: [{ ServerRelativeUrl: string }],
      EmployeeName: { FirstName: string, LastName: string };
      ADDepartment: [{ Label: string }]
    }
  ];
  ReqID: Number;
  isLoading: boolean;
}

export default class EmployeeStoriesDisplay extends React.Component<IEmployeeStoriesProps, IEmployeeStoriesState> {
  public constructor(props: IEmployeeStoriesProps, state: IEmployeeStoriesState) {
    super(props);
    //Initialize the State
    this.state = {
      image: [{
        ServerRelativeUrl: ''
      }],
      items: [
        {
          ID:0,
          Title: 'No Employee Story to Display',
          Description: '',
          AttachmentFiles: [{ ServerRelativeUrl:'' }],
          EmployeeName: { FirstName: '', LastName: '' },
          ADDepartment: [{ Label: '' }],
          Location: [{ Label:'' }]
        }
      ],
      ReqID: 0,
      isLoading: true
    };
  }

  public componentDidMount() {
    this.GetGlobalThoughtByID();
  }

  public GetGlobalThoughtByID() {
    var method = 'get items for Global Thought Leadership';
    let newCommonObj: common = new common();
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    const queryID: number = parseInt(queryParameters.getValue("RID"));
    var query = `?$select=*,AttachmentFiles/ServerRelativeUrl&$expand=AttachmentFiles&$Filter= ID eq ${queryID}`;

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        this.setState({
          items: res.data.value
        });
        var i = 0;
        let images = [];
        for (i = 0; i < res.data.value.length; i++) {
          if (res.data.value[i].AttachmentFiles.length == 0) {
            images.push({ "ServerRelativeUrl": "/_layouts/15/userphoto.aspx?size=L" });
          } else {
            images.push({ "ServerRelativeUrl": res.data.value[i].AttachmentFiles[0].ServerRelativeUrl });
          }
        }
        var imageser;
        imageser = images;
        this.setState({ image: imageser })
      }
    }).catch(error => {
      console.log(error);
    });
  }
  public render(): React.ReactElement<IEmployeeStoriesProps> {
    return (
      <div className={styles.employeeStories}>

        <div className={styles.container}>
          <h1>
           Employee Stories :
                  </h1>
          <div>
            <h2>
              {this.state.items[0].Title}
            </h2>
            <div><img src={this.state.image[0].ServerRelativeUrl}  /></div>
            <div 
              dangerouslySetInnerHTML={{ __html: this.state.items[0].Description }} >
             
            </div>

          </div>


        </div>

      </div>)
  }
}
