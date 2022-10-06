import React from 'react'
import "./style.css"

const UserForm = () => {
  return (
   <div>
  &lt;&gt;
  <section>
    <div className="container new-step-container">
      <div className="row">
        <div className="col-md-4">
          <div className="col-wrap-table">
            <div id="site-logo" className="site-logo col-media-left col-media-middle">
              <a href>
                <img className="logo-static" src="./img/Fintranxect-Logo-1.png" alt="fintranxect1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="newstep-form">
    <div className="container new-step-container">
      <div className="row form-newalign">
        <div className="col-md-12 col-lg-6">
          <form id="msform">
            <fieldset className="ui-step-content">
              <h1>Instant Business &amp; Personal</h1>
              <ul className="checiocn">
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Personal Loan <small>₹ 10,000 to ₹ 25 Lakh</small>
                  </span>
                </li>
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Business Loan <small>₹ 50,000 to ₹ 5 Crores</small>
                  </span>
                </li>
              </ul>
              <ul className="checiocn">
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Rate of Interest <small>12% Onwards</small>
                  </span>
                </li>
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Tenure <small>3-60 Months</small>
                  </span>
                </li>
              </ul>
              <ul className="checiocn">
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Fast Approval <small>Instant approval in 3 Steps</small>
                  </span>
                </li>
                <li>
                  <img src="img/ornage-check.svg" alt />
                  <span>
                    Processing Fee <small>1% Onwards</small>
                  </span>
                </li>
              </ul>
              <input type="button" name="next" className="next action-button apply-now-btn new-mt50" defaultValue="Apply Now" />
            </fieldset>
            <fieldset className="ui-step-content">
              <h1 className="mb-0">Apply in 3 easy steps</h1>
              <h6>let's start with your basic info</h6>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>Mobile Number</label>
                    <input type className placeholder="We will send an OTP on this number" />
                  </div>
                  <div className="col-md-12">
                    <ul className="unstyled centered">
                      <li>
                        <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" defaultValue="value1" />
                        <label htmlFor="styled-checkbox-1">Get updates on WhatsApp</label>
                      </li>
                      <li>
                        <input className="styled-checkbox" id="styled-checkbox-2" type="checkbox" defaultValue="value2" defaultChecked />
                        <label htmlFor="styled-checkbox-2">By applying you agree to our
                          <a href> Terms of Use </a> and
                          <a href> Privacy Policy </a>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn ml-00" defaultValue="Send OTP" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1 className="mb-0">Verify OTP</h1>
              <h6>FINITT has sent an OTP to your registers mobile number +91 86****7741</h6>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>Enter OTP</label>
                    <input type className placeholder="Enter 6 Digit OTP" />
                  </div>
                  <div className="col-xs-6 col-md-5">
                    <a href className="resentotp">Resend OTP</a>
                  </div>
                  <div className="col-xs-6 col-md-5 text-right">
                    <i className="fa-regular fa-clock fa-fw" /> 00:15
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn mt-5 ml-00" defaultValue="Verify & Proceed" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1>Personal info</h1>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-xs-12 col-md-5">
                    <label>First Name</label>
                    <input type className placeholder="Name as per PAN" />
                  </div>
                  <div className="col-xs-12 col-md-5">
                    <label>Last Name</label>
                    <input type className placeholder="Name as per PAN" />
                  </div>
                  <div className="col-xs-12 col-md-5">
                    <label>Pan Card Number</label>
                    <input type className placeholder="Name as per PAN" />
                  </div>
                  <div className="col-xs-12 col-md-5">
                    <label>Date of birth</label>
                    <input type="date" className placeholder="DOB as per PAN" />
                  </div>
                  <div className="col-xs-12 col-md-5">
                    <p className="mb-33">Employment type</p>
                    <div className="radio">
                      <input id="radio-1" name="radio" type="radio" />
                      <label htmlFor="radio-1" className="radio-label">Salaried</label>
                    </div>
                    <div className="radio">
                      <input id="radio-2" name="radio" type="radio" defaultChecked />
                      <label htmlFor="radio-2" className="radio-label">Self Employed</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-5">
                    <p className="mb-33">Loan Type </p>
                    <div className="radio">
                      <input id="radio-1" name="radio" type="radio" />
                      <label htmlFor="radio-1" className="radio-label">Personal</label>
                    </div>
                    <div className="radio">
                      <input id="radio-3" name="radio" type="radio" defaultChecked />
                      <label htmlFor="radio-4" className="radio-label">Business</label>
                    </div>
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn mt-5 ml-00" defaultValue="Submit" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1>Phone number verification</h1>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>Mobile Number</label>
                    <input type className placeholder defaultValue={9009312345} disabled />
                  </div>
                  <div className="col-md-12">
                    <ul className="unstyled centered">
                      <li className="mb-10">
                        <label><small><i className="fa fa-info-circle" /> Phone number fetched
                            from existing profile data</small></label>
                      </li>
                      <li>
                        <input className="styled-checkbox docutxt" id="styled-checkbox-3" type="checkbox" defaultValue="value1" />
                        <label htmlFor="styled-checkbox-3"> I hereby consent to FinBox and IIFL
                          being appointed as my authorised representative to receive my Credit
                          Information from Experian and CIBIL for the purpose of checking my
                          Credit Score and for credit assessment and facilitation of loan
                          offers.</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn ml-00" defaultValue="Send OTP" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1 className="mb-0">Phone number verification</h1>
              <h6>FINITT has sent an OTP to your registers mobile number +91 86****7741</h6>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>Enter OTP</label>
                    <input type className placeholder="Enter 6 Digit OTP" />
                  </div>
                  <div className="col-xs-6 col-md-5">
                    <a href className="resentotp">Resend OTP</a>
                  </div>
                  <div className="col-xs-6 col-md-5 text-right">
                    <i className="fa-regular fa-clock fa-fw" /> 00:15
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn mt-5 ml-00" defaultValue="Verify Number" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1 className="mb-0">Additional Info Required</h1>
              <h6>We need some additional information to verify your bureau data. Please answer the
                questions below.</h6>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>The One Time Password is sent to 90093****. Please enter the One Time
                      Password.false</label>
                    <input type className placeholder="Enter one time password" />
                  </div>
                </div>
              </div>
              <input type="button" name="next" className="next action-button apply-now-btn  ml-00" defaultValue="Next" />
            </fieldset>
            <fieldset className="ui-step-content">
              <button type="button" name="previous" className="previous action-button-previous"><i className="fa-solid fa-arrow-left-long fa-fw" /> Back</button>
              <h1>Congratulations! <br /> You are eligible for a loan.</h1>
              <div className="stepform-newdesign">
                <div className="row">
                  <div className="col-12 col-md-10">
                    <label>Upload your last 1 Year bank statement</label>
                    <div className="custom-file-upload">
                      {/*<label for="file">File: </label>*/}
                      <input type="file" id="file" placeholder="Choose PDF File" name="myfiles[]" multiple />
                    </div>
                  </div>
                  <div className="col-12 col-md-10">
                    <label>Upload you Aadhar card</label>
                    <div className="custom-file-upload">
                      {/*<label for="file">File: </label>*/}
                      <input type="file" id="file" placeholder="Choose PDF File" name="myfiles[]" multiple />
                    </div>
                  </div>
                </div>
              </div>
              <input type="submit" name="submit" className="submit action-button apply-now-btn ml-00" defaultValue="Submit" />
            </fieldset>
          </form></div>
        <div className="col-md-12 col-lg-6">
          <img src="./img/loanright.png" alt className="righimg" />
        </div>
      </div>
    </div>
  </section>
</div>

  )
}

export default UserForm