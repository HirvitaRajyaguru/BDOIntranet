import * as React from 'react';
import styles from './UploadJobResume.module.scss';
import { IUploadJobResumeProps } from './IUploadJobResumeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IUploadJobResumeState } from './IUploadJobResumeState';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import Dialog, { DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import Common from '../../common/common';
import { ItemAddResult, Web } from "sp-pnp-js";
export default class UploadJobResume extends React.Component<IUploadJobResumeProps, IUploadJobResumeState> {
  constructor(props) {
    super(props);
    //Initialize the State
    this.state = {
      items: [
        {
          Title: "",
          Description: "No Job Description",
          Experience: "0",
          Id: 0,
          Location: [{ Label: '' }],
          ADDepartment: [{ Label: '' }],
        }
      ],
      Candidatename: "",
      ContactNo: 0,
      Email: "",
      WorkExperience: 0,
      WorkwithBDO: "",
      required: "",
      errors: "",
      Success: "",
      popupOpened: false,
      hideDialog: true
    };
    this.filesave = this.filesave.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  public componentDidMount() {
    var queryParms = new UrlQueryParameterCollection(window.location.href); //get url
    var ID = queryParms.getValue("RID"); //fetch query prameter from Url
    var url = this.props.siteurl;
    var method = 'get items for UploadResume';
    var listname = 'JobOpenings';
    var query = `?$Filter=Id eq ${ID}`; //filter based on query ID
    let newCommonObj: Common = new Common();
    newCommonObj.getDataFromList(url, listname, query, method).then(async (res) => {
      //response not null then setState this Response
      const Jobopeningdata = res.data.value;
      this.setState({ items: Jobopeningdata });
    })
      .catch(error => {
        console.log(error);
      });
  }
  handleChange(event) {


    this.setState({
      ...this.state,
      [event.target.name]: event.target.value

    })

  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.Candidatename);
    event.preventDefault();


  }


  validateForm() {

    // let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!this.state.Candidatename) {
      formIsValid = false;
      errors["Candidatename"] = "*Please enter your username.";
    }

    //if (typeof fields["username"] !== "undefined") {
    //  if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
    //    formIsValid = false;
    //    errors["username"] = "*Please enter alphabet characters only.";
    //  }
    //}

    //if (!fields["emailid"]) {
    //  formIsValid = false;
    //  errors["emailid"] = "*Please enter your email-ID.";
    //}

    //if (typeof fields["emailid"] !== "undefined") {
    //  //regular expression for email validation
    //  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    //  if (!pattern.test(fields["emailid"])) {
    //    formIsValid = false;
    //    errors["emailid"] = "*Please enter valid email-ID.";
    //  }
    //}

    //if (!fields["mobileno"]) {
    //  formIsValid = false;
    //  errors["mobileno"] = "*Please enter your mobile no.";
    //}

    //if (typeof fields["mobileno"] !== "undefined") {
    //  if (!fields["mobileno"].match(/^[0-9]{10}$/)) {
    //    formIsValid = false;
    //    errors["mobileno"] = "*Please enter valid mobile no.";
    //  }
    //}

    //if (!fields["password"]) {
    //  formIsValid = false;
    //  errors["password"] = "*Please enter your password.";
    //}

    //if (typeof fields["password"] !== "undefined") {
    //  if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
    //    formIsValid = false;
    //    errors["password"] = "*Please enter secure and strong password.";
    //  }
    //}

    this.setState({
      errors: errors
    });
    return formIsValid;


  }


  public render(): React.ReactElement<IUploadJobResumeProps> {
    return (
      <div> {/*DialogBox Display afterResume uploaded*/}
        <Dialog type={DialogType.close} isOpen={this.state.popupOpened} title="Resume Upload" onDismiss={this.closeDialog}
          containerClassName={''} isDarkOverlay={true} isBlocking={false} >
          <div>
            <div>
              <Label>Thank You for Referring Candidate</Label>
            </div>
            <div style={{ paddingTop: '20px' }}>
              <Button onClick={this.closeDialog} buttonType={ButtonType.primary}>OK</Button>
            </div>
          </div>
        </Dialog>
        <div className={styles.uploadJobResume}>
          <div className={styles.container}>
            <p className={styles.header}>Job Openings Resume Upload</p>
            <div className={styles.item}>
              <div className={styles.jobsection}>
                <div className={styles.jobitem}>
                  {this.state.items.map((item, key) =>{
                    return (
                      <div>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-md3">
                            Designation</div>
                          <div className="ms-Grid-col  ms-md9 ">
                            <div className={styles.subject}>{item.Title}</div>
                          </div>
                        </div>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-md3">
                            Experience </div>
                          <div className="ms-Grid-col  ms-md9 ">
                            <div className={styles.subject}>{item.Experience}</div>
                          </div>
                        </div>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-md3">
                            Job Description</div>
                          <div className="ms-Grid-col  ms-md9 ">
                            <div className={styles.subject}dangerouslySetInnerHTML={{ __html: item.Description }}></div>
                          </div>
                        </div>
                        <form onSubmit={this.handleSubmit} >

                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md3">
                              Candidate Name</div>
                            <div className={styles.alltextbox}>
                              <input type="text" name="Candidatename" value={this.state.Candidatename}
                                onChange={this.handleChange.bind(this)} />

                              <div className={styles.errorMsg}>{this.state.Candidatename}</div>
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md3">
                              Contact Number</div>
                            <div className={styles.alltextbox}>
                              <input type="number" name="ContactNo" value={this.state.ContactNo}
                                onChange={this.handleChange.bind(this)} />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md3">
                              Email</div>
                            <div className={styles.alltextbox}>
                              <input type="string" name="Email" value={this.state.Email}
                                onChange={this.handleChange.bind(this)} />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md3">
                              Work Experience</div>
                            <div className={styles.alltextbox}>
                              <input type="number" name="WorkExperience" value={this.state.WorkExperience}
                                onChange={this.handleChange.bind(this)} />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md3">
                              Worked with BDO</div>
                            <div className={styles.alltextbox}>
                              <input type="string" name="WorkwithBDO" value={this.state.WorkwithBDO}
                                onChange={this.handleChange.bind(this)} />
                            </div>
                          </div>
                        </form>

                      </div>
                    );
                  })}
                </div>
                <div>
                  <div>{/*accept only doc,docx and pdf*/}
                    <input type="file" name="myFile" id="newfile" accept=".doc,.docx,.pdf" className={styles.chooseFile}></input></div>
                  <div>
                    <br></br>
                    <button onClick={this.filesave}> UploadFile</button>
                  </div>
                </div>
                <div className={styles.subject} >{this.state.Success}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private closeDialog(): void {
    this.setState({ popupOpened: false, hideDialog: true });
  }
  //Resume save in JobResumes Document library on button click
  private filesave() {
    let web = new Web(this.props.siteurl);
    let myfile = (document.querySelector("#newfile") as HTMLInputElement).files[0];
    //check File Size
    if (myfile.size <= 10485760) {
      web.getFolderByServerRelativeUrl("/sites/BDOIntranet/JobResumes").files.add(myfile.name, myfile, true).then(f => {

        f.file.getItem().then(item => {
          item.update({
            JobTitle: this.state.items[0].Title,
            Experience: this.state.items[0].Experience,
            Candidatename: this.state.Candidatename,
            ContactNo: this.state.ContactNo,
            Email: this.state.Email,
            WorkExperience: this.state.WorkExperience,
            WorkwithBDO: this.state.WorkwithBDO
          }).then((myupdate) => {
            this.setState({ Success: "File Uploaded" });
            this.setState({ popupOpened: true });
          });
        });
      });
    }
    else {
      web.getFolderByServerRelativeUrl("/sites/BDOIntranet/JobResumes")
        .files.addChunked(myfile.name, myfile)
        .then(({ file }) => file.getItem()).then((item: any) => {
          return item.update({
            JobTitle: this.state.items[0].Title,
            Experience: this.state.items[0].Experience
          }).then((myupdate) => {
            this.setState({ popupOpened: true });
          });
        }).catch(console.log);
    }
  }
}
