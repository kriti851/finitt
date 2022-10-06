import React,{useState,useEffect} from 'react';
import { Link,useLocation,useParams } from 'react-router-dom';
import Header from '../layout/Header'; //Include Heder
import {useFormik} from 'formik';
import * as yup from 'yup';




const UserForm = () => {

  const [data, setData] = useState({

  })
  const [currentStep, setCurrentStep] = useState(0);
  
  
  const handleNextStep = (newData, final = false) => {
    setData((prev) => ({ ...prev, ...newData }));
    if (final) {
      // makeRequest(newData);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };
  const handlePrevStep = (newData) => {
    
    setData((prev) => ({ ...prev, ...newData }));
    setCurrentStep((prev) => prev - 1);
  };
  let steps = [];

  steps.push(<StepOne next={handleNextStep}  prev={handlePrevStep} />) 

  return (
    <>
        <Header></Header>
        {steps[currentStep]}
    </>
  )
}

const StepOne = (props) => {

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const [currentStep, setCurrentStep] = useState(0);
  const form=useFormik({
    initialValues: {
        mobile_number : '',
        is_agree : false,
        otp_verified : '',
        pan_number : '',
    },
    enableReinitialize: true,
    validationSchema: yup.object({
        mobile_number:currentStep==1?yup.string().required('Mobile number is required.').matches(phoneRegExp, 'Mobile number is not valid'):'',
        is_agree :currentStep==1?yup.boolean().required('Please selected terms and conditions.').oneOf([true],'Please selected terms and conditions.'):'',
        otp_verified : currentStep==2?yup.string().required('Please enter OTP.'):'',
        pan_number : currentStep==3?yup.string().required('Please enter pan card number.'):''

    }),
    onSubmit:values=>{

        console.log(currentStep)
        if(currentStep==7){
          console.log(values)
        } else {
          setCurrentStep(currentStep+1)
        }
        // if(fourStepform.values.item_old == 1) {
        //     props.data.items[fourStepform.values.item_index]=values;
        // } else {
        //     props.data.items.push(values);
        // }
        // props.next(props.data,false);  
    }
});

  return (
    <>
      <section className="newstep-form"> 
	     <div className="container new-step-container">
            <div className="row form-newalign">
                <div className="col-md-12 col-lg-6">
                   
				   
				   <form id="msform" onSubmit={form.handleSubmit}>
                            
                       <fieldset className="ui-step-content" style={currentStep==0?{display:"block"}:{display:"none"}}>
					      <h1>Instant Business & Personal</h1>
							   <ul className="checiocn">
								  <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Personal Loan <small>₹ 10,000 to ₹ 25 Lakh</small>
									</span>
								   </li>
								   <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Business Loan <small>₹ 50,000 to ₹ 5 Crores</small>
									</span>
								   </li>
							   </ul>
							   <ul className="checiocn">
								  <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Rate of Interest <small>12% Onwards</small>
									</span>
								   </li>
								   <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Tenure <small>3-60 Months</small>
									</span>
								   </li>
							   </ul>
							   <ul className="checiocn">
								  <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Fast Approval <small>Instant approval in 3 Steps</small>
									</span>
								   </li>
								   <li>
									<img src="/assets/img/ornage-check.svg" alt=""/> 
									<span>
									  Processing Fee <small>1% Onwards</small>
									</span>
								   </li>
							   </ul>
					    <input type="button" name="next" className="next action-button apply-now-btn ml-00" value="Apply Now" onClick={()=>setCurrentStep(1)}/>
					</fieldset>
					   
				   
				   <fieldset className="ui-step-content" style={currentStep==1?{display:"block"}:{display:"none"}}>
					  <h1 className="mb-0">Apply in 3 easy steps</h1>
							<h6>let's start with your basic info</h6>
							
							<div className="stepform-newdesign">
							   <div className="row">
								   <div className="col-12 col-md-10">
								      <label>Mobile Number</label>
								      <input type="text" className="mb-0" name="mobile_number" {...form.getFieldProps("mobile_number")}    placeholder="We will send an OTP on this number"/>
                      {form.touched.mobile_number && form.errors.mobile_number ? <div  className="text-danger">{form.errors.mobile_number}</div> : ''}
								   </div>
								   <div className="col-md-12">
								     <ul className="unstyled centered">
										  <li>
											<input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
											<label htmlFor="styled-checkbox-1">Get updates on WhatsApp</label>
										  </li>
										  <li>
											<input className="styled-checkbox" id="styled-checkbox-2" type="checkbox" checked={form.values.is_agree==true}   onChange={(e)=> form.setFieldValue('is_agree', e.target.checked) }/>
											<label htmlFor="styled-checkbox-2">By applying you agree to our 
											   <Link to=""> Terms of Use </Link> and 
											   <Link to=""> Privacy Policy </Link>
											</label>
                      {form.touched.is_agree && form.errors.is_agree ? <div  className="text-danger">{form.errors.is_agree}</div> : ''}
										  </li>
									  </ul>
								   </div>
							    </div>
							  </div>
					    <input type="submit"  className="next action-button apply-now-btn ml-00" value="Send OTP"  />
					</fieldset>
					   
					   
					<fieldset className="ui-step-content"  style={currentStep==2?{display:"block"}:{display:"none"}}>
					    <button type="button" name="previous" className="previous action-button-previous"  onClick={() =>setCurrentStep(currentStep-1) }><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1 className="mb-0">Verify OTP</h1>
						<h6>FINITT has sent an OTP to your registers mobile number +91 {form.values.mobile_number}</h6>
						<div className="stepform-newdesign">
							<div className="row">
								<div className="col-12 col-md-10">
								    <label>Enter OTP</label>
								    <input type="text" className=""  name="otp_verified" {...form.getFieldProps("otp_verified")}   placeholder="Enter 6 Digit OTP"/>
                    {form.touched.otp_verified && form.errors.otp_verified ? <div  className="text-danger">{form.errors.otp_verified}</div> : ''}

								</div>
								{/* <div className="col-xs-6 col-md-5">
								     <Link to="" className="resentotp">Resend OTP</Link>
								</div> */}
								<div className="col-xs-6 col-md-5 text-right">
								     <i className="fa-regular fa-clock fa-fw"></i> 00:15
								</div>
							</div>
						</div>
					   <input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Verify & Proceed"  />
					</fieldset>
					
				   
				   <fieldset className="ui-step-content"  style={currentStep==3?{display:"block"}:{display:"none"}}>
					    <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1>Personal info</h1>
						<div className="stepform-newdesign">
							<div className="row">
								{/* <div className="col-xs-12 col-md-5">
								    <label>First Name</label>
								    <input type="" className="" placeholder="Name as per PAN"/>
								</div>
								<div className="col-xs-12 col-md-5">
								    <label>Last Name</label>
								    <input type="" className="" placeholder="Name as per PAN"/>
								</div> */}
								<div className="col-xs-12 col-md-8">
								    <label>Pan Card Number</label>
								    <input type="" className="" placeholder="Enter pan card number"  name="pan_number" {...form.getFieldProps("pan_number")}   />
                    {form.touched.pan_number && form.errors.pan_number ? <div  className="text-danger">{form.errors.pan_number}</div> : ''}

								</div>
								{/* <div className="col-xs-12 col-md-5">
								    <label>Date of birth</label>
								    <input type="date" className="" placeholder="DOB as per PAN"/>
								</div> */}
								
								<div className="col-xs-12 col-md-8">
								  <p className="mb-33">Employment type</p>
								  <div className="radio">
									<input id="radio-1" name="employee_type" type="radio" />
									<label htmlFor="radio-1" className="radio-label">Salaried</label>
								  </div>
								  <div className="radio">
									<input id="radio-2" name="employee_type" type="radio" checked readOnly/>
									<label htmlFor="radio-2" className="radio-label">Self Employed</label>
								  </div>
								</div>
								<div className="col-xs-12 col-md-5">
								  <p className="mb-33">Loan Type </p>
								  <div className="radio">
									<input id="radio-3" name="loan_type" type="radio" />
									<label htmlFor="radio-3" className="radio-label">Personal</label>
								  </div>
								  <div className="radio">
									<input id="radio-4" name="loan_type" type="radio" checked readOnly />
									<label htmlFor="radio-4" className="radio-label">Business</label>
								  </div>
								</div>
							</div>
						</div>
					   <input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Submit"  />
					</fieldset>
					
					
					 {/* <fieldset className="ui-step-content" style={currentStep==4?{display:"block"}:{display:"none"}}>
					    <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1>Phone number verification</h1>
						<div className="stepform-newdesign">
							<div className="row">
								<div className="col-12 col-md-10">
								    <label>Mobile Number</label>
								    <input type="" className="" placeholder="" value="9009312345" disabled/>
								</div>
								   <div className="col-md-12">
								     <ul className="unstyled centered">
										  <li className="mb-10">
											<label><small><i className="fa fa-info-circle"></i> Phone number fetched from existing profile data</small></label>
										  </li>
										  
										  <li>
											<input className="styled-checkbox docutxt" id="styled-checkbox-3" type="checkbox" value="value1" />
											<label htmlFor="styled-checkbox-3"> I hereby consent to FinBox and IIFL being appointed as my authorised  representative to receive my Credit Information from Experian and CIBIL for the purpose of checking my Credit Score and for credit assessment and facilitation of loan offers.</label>
										  </li>
										  
									  </ul>
								   </div>
							    </div>
						</div>
					   <input type="button" name="next" className="next action-button apply-now-btn ml-00" value="Send OTP" onClick={()=>setCurrentStep(5)}/>
					</fieldset> */}
				   
				   
				   {/* <fieldset className="ui-step-content" style={currentStep==5?{display:"block"}:{display:"none"}}>
					    <button type="button" name="previous" className="previous action-button-previous" ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1 className="mb-0">Phone number verification</h1>
						<h6>FINITT has sent an OTP to your registers mobile number +91 86****7741</h6>
						<div className="stepform-newdesign">
							<div className="row">
								<div className="col-12 col-md-10">
								    <label>Enter OTP</label>
								    <input type="" className="" placeholder="Enter 6 Digit OTP"/>
								</div>
								<div className="col-xs-6 col-md-5">
								     <a href="" className="resentotp">Resend OTP</a>
								</div>
								<div className="col-xs-6 col-md-5 text-right">
								     <i className="fa-regular fa-clock fa-fw"></i> 00:15
								</div>
							</div>
						</div>
					   <input type="button" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Verify Number" onClick={()=>setCurrentStep(6)}/>
					</fieldset> */}
					
					
					
					{/* <fieldset className="ui-step-content">
					    <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1 className="mb-0">Additional Info Required</h1>
						<h6>We need some additional information to verify your bureau data. Please answer the questions below.</h6>
						<div className="stepform-newdesign">
							<div className="row">
								<div className="col-12 col-md-10">
								    <label>The One Time Password is sent to 90093****. Please enter the One Time Password.false</label>
								    <input type="" className="" placeholder="Enter one time password"/>
								</div>
							</div>
						</div>
					   <input type="button" name="next" className="next action-button apply-now-btn  ml-00" value="Continue" />
					</fieldset> */}
				   
				   
				   
				   <fieldset className="ui-step-content" style={currentStep==4?{display:"block"}:{display:"none"}}> 
					    {/* <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button> */}
						
						<div>
							<h1>Congratulations! <br></br> You are eligible for a loan.</h1>
							<p>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
						</div>
						
						{/* <div>
							<h1>Sorry!</h1>
							<p>Oops! We regret to inform you that we are unable to process your application as it does not meet our internal policy criteria. Please note the reason for the decline of your application is a business decision and is based on multiple parameters and certainly on no way, is indicative of your creditworthiness. Please try again after 60 Days.</p>
						</div> */}
						
					
					   {/* <input type="submit" name="submit" className="submit action-button apply-now-btn ml-00" value="Submit Your Details" />
					   
					   <Link to="" className="apply-now-btn ml-00" style={{display:"none"}}>Start New Application</Link> */}
					   
					</fieldset>
          </form>
				    
                </div>
				
				        <div className="col-md-12 col-lg-6">
                   <img src="/assets/img/loanright-1.png" alt="" className="righimg" />
                </div>
				
            </div>
         </div> 
	  </section>
    </>
  );
};

export default UserForm