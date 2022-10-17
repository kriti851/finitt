import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header'; //Include Heder
import { useFormik } from 'formik';
import * as yup from 'yup';
import Service from './../../service';
import uuid from 'react-uuid';
import toast, { Toaster } from 'react-hot-toast';
// import DatePicker from 'react-date-picker';

const config = require('./../../config.json')
const api = new Service();

const UserForm = () => {
	const navigate = useNavigate();
	const { name } = useParams();
	const [allStates, setallStates] = useState([]);
	const [header, setHeader] = useState({ 'Authorization': '', 'DSA': '' });
	const [formResponse, setformResponse] = useState({});
	const [data, setData] = useState({
		lenders: [],
		info: {
			mobile_number: '',
			is_agree: false,
			otp_verified: '',
			pan_number: '',
			loan_type: 1,
			employee_type: 1,
			wrong_opt:false,
			
		},
		business_info: {
			email: '',
			first_name: '',
			last_name: '',
			gender: '',
			date_of_birth: '',
			company_name: '',
			legal_name: '',
			state_id: '',
			state: '',
			city_id: '',
			city: '',
			houseno: '',
			pincode: '',
			business_type: '',
			type_of_nature: '',
			vintage: '',
			turn_over: '',
			desired_amount: '',
			required_amount: '',
			co_application: [
				{ name: "", pan_number: "", pancard_image: "", pancard_image_url: "", relationship: "" }
			],
			pan_number: '',
			pancard_image: '',
			pancard_image_url: '',
			gst_number: '',
			gstproof_image: '',
			gstproof_image_url: '',
			business_address: '',
			business_address_proof: '',
			business_address_proof_url: '',
			bank_statement: '',
			bank_statement_url: '',
			itr_docs: '',
			itr_docs_url: '',
			loan_purpose : 0
		},
		personal_info: {
			email: '',
			first_name: '',
			last_name: '',
			gender: '',
			date_of_birth: '',
			father_name: '',
			qualification: '',
			marital_status: '',
			number_of_kids: 0,
			vehicle_type: '',
			residence_building: '',
			residence_area: '',
			residence_state: '',
			residence_state_id: '',
			residence_city: '',
			residence_city_id: '',
			residence_pincode: '',
			employer_name: '',
			designation: '',
			organization: '',
			organization_type: '',
			total_experience: '',
			required_amount: '',
			company_building: '',
			company_area: '',
			company_state: '',
			company_state_id: '',
			company_city: '',
			company_city_id: '',
			company_pincode: '',
			company_website: '',
			company_email: '',
			salery_inhand: '',
			salary_mode: '',
			bank_name: '',
			pancard_image: '',
			pancard_image_url: '',
			aadhar_image: '',
			aadhar_image_url: '',
			bank_statement: '',
			bank_statement_url: '',
			salery_slip: '',
			salery_slip_url: '',
			loan_purpose : 0
		}
	})
	useEffect(() => {
		if (name !== undefined) {
			getUserDetail()
		}
	}, [])

	const getUserDetail = () => {
		api.postApi('user-exist', { name: name }).then(response => {
			console.log(response)
			if (response.status == 'success') {
				header.DSA = response.das_id;
				setHeader(header)
			} else {
				navigate('/')
			}
		}).catch(error => {

		});
	}
	const GetStates = () => {
		api.getApi('allStates', '', header).then(response => {
			setallStates(response.states);
		}).catch(error => {
		});

	}
	let steps = [];

	const [currentStep, setCurrentStep] = useState(0);
	const handleNextStep = (newData, final = false) => {
		setData((prev) => ({ ...prev, ...newData }));
		
		if (final) {
			console.log(newData)
			api.postApi(newData.info.loan_type == 2 ? 'businessInfoForm' : 'personalInForm', { ...newData }, false, header).then(response => {
				console.log(response)
				setformResponse(response)
			}).catch(error => {
				console.log(error)
			});
			return;
		}
	};
	const handlePrevStep = (newData) => {

		setData((prev) => ({ ...prev, ...newData }));
		setCurrentStep((prev) => prev - 1);
	};

	// Normal Form 
	steps.push(<StepOne GetStates={GetStates} setHeader={setHeader} header={header} next={handleNextStep} prev={handlePrevStep} setData={setData} data={data} setCurrentStep={setCurrentStep} allStates={allStates} />)
	// Personal Form
	steps.push(<PersonalForm formResponse={formResponse} header={header} next={handleNextStep} prev={handlePrevStep} setData={setData} data={data} allStates={allStates} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
	// Business Form
	steps.push(<BusinessForm formResponse={formResponse} header={header} next={handleNextStep} prev={handlePrevStep} setData={setData} data={data} allStates={allStates} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
	steps.push(<LenderListForm formResponse={formResponse} header={header} next={handleNextStep} prev={handlePrevStep} setData={setData} data={data} allStates={allStates} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
	steps.push(<ThankYouForm formResponse={formResponse} header={header} next={handleNextStep} prev={handlePrevStep} setData={setData} data={data} allStates={allStates} setCurrentStep={setCurrentStep} currentStep={currentStep} />)

	return (
		<>
		<Toaster position="top-right" reverseOrder={false} />
			<Header></Header>
			{steps[currentStep]}
		</>
	)
}

const StepOne = (props) => {

	const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
	const [currentStep, setCurrentStep] = useState(0);
	const form = useFormik({
		initialValues: props.data.info,
		// enableReinitialize: true,
		validationSchema: yup.object({
			mobile_number: currentStep == 1 ? yup.string().required('Please enter mobile number').min(10, 'Please enter valid mobile number')
				.max(10, 'Please enter valid mobile number.').matches(phoneRegExp, 'Please enter valid mobile number') : '',
			is_agree: currentStep == 1 ? yup.boolean().required('Please select terms and conditions').oneOf([true], 'Please select terms and conditions') : '',
			otp_verified: currentStep == 2 ? yup.string().required('Please enter OTP').min(6, 'Please enter valid OTP')
				.max(6, 'Please enter valid OTP.') : '',
			pan_number: currentStep == 3 ? yup.string().required('Please enter pan card number') : '',
			loan_type: currentStep == 4 ? yup.number().test('is boolean',
				'Please select loan type',
				(value) => value === 2 || value === 1) : '',
			employee_type: currentStep == 4 ? yup.string().required('Please select employee type') : ''

		}),
		onSubmit: values => {
			if (currentStep == 4) {
				props.data.info = values;
				props.setData(props.data);
				props.next(props.data, false);
				props.setCurrentStep(values.loan_type)
			} else {
				if (currentStep == 1) {
					api.postApi('loginUser', { mobile_number: values.mobile_number }).then(response => {
						if (response.status == 'success') {
							setCurrentStep(currentStep + 1)
						}
					}).catch(error => {

					});
				} else if (currentStep == 2) {
					api.postApi('verifyOtp', { mobile_number: values.mobile_number, otp: values.otp_verified },false,props.header).then(response => {
						if (response.status == 'success' && response.data) {
							props.header.Authorization = response.token
							props.setHeader(props.header, props.GetStates())
							if (response.exit == 1) {
								setCurrentStep(4)
								form.setFieldValue('wrong_opt',false)
								// if(response.data && response.data.user) {
								// 	props.data.info =  { ...props.data.info,
								// 		loan_type: 1,
								// 		employee_type: 1,
								// 	}
								// } 
								// if(response.data && response.data.user_detail) {

								// }
								// if(response.data && response.data.user_detail) {
									
								// }
							} else {
								setCurrentStep(currentStep + 1)
								form.setFieldValue('wrong_opt',false)
							}							
						}
						else {
							form.setFieldValue('wrong_opt',true)
						}
					}).catch(error => {

					});
				} else {
					setCurrentStep(currentStep + 1)
				}
			}
		}

	});

    const updateNumber = (value,path,digit) => {
		if(value.length > digit) 
		 value = value.substring(0,digit);
		form.setFieldValue(path,value) 
	}

	const [show, setShow] = useState(false);

	const [userResponse, setsUserResponse] = useState('');
	const formStatus = useFormik({
		initialValues:{
			caseid : "",
			password: ""
		},
		validationSchema: yup.object({
			caseid: yup.string().required('Please enter your id'),
			password: yup.string().required('Please enter password')
		}),
		onSubmit: values => {
			api.postApi('check-user-status', values,false, props.header).then(response => {
				if(response.status=='success') {
					setsUserResponse(response)
				}
			}).catch(error => {

			});
		}
	})

	return (
		<>
		<div className={show ? "modal right display-block" : "modal display-none"}   tabIndex="-1" data-backdrop="static" data-keyboard="false">
		<form id="msform" onSubmit={formStatus.handleSubmit}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content" id="modal_content">
					<div className="modal-header">
						<h4 className="modal-title"><b>{userResponse==''? 'Check Your Loan Status' : ' Current Loan Status ('+userResponse.case_status+ ')' }</b></h4>
						<button type="button" className="close" onClick={() =>setShow(false,setsUserResponse('',formStatus.resetForm()))}>&times;</button>
					</div>					
					<div className="modal-body">						
					    <div className="stepform-newdesign">
						    {userResponse==''? 
								<div className="row" style={{textAlign: "left"}}>
										<div className="col-12 col-sm-12">
											<label>Case Id</label>
											<input   name="caseid" {...formStatus.getFieldProps("caseid")} placeholder="Enter CaseId"   type="text"  style={{marginBottom: "0px"}}/>
											{formStatus.touched.caseid && formStatus.errors.caseid ?
													<div className="text-danger"  style={{textAlign: "left"}}>{formStatus.errors.caseid}</div> : ''}
										</div>
										<div className="col-12 col-sm-12">
										<label>Password</label>
										<input name="password" {...formStatus.getFieldProps("password")} placeholder ="Enter Password" type="password" style={{marginBottom: "0px"}} />
										{formStatus.touched.password && formStatus.errors.password ?
													<div className="text-danger" style={{textAlign: "left"}}>{formStatus.errors.password}</div> : ''}
										</div>

								</div>
							: ''}

                            {userResponse && userResponse.lenders.length && userResponse.lenders.map((option, index) => (
								<div className="row" key={index}>
                                  <table className="table table-bordered">
									<thead>
										<tr>
											<th>Company Name</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{option.company_name}</td>
											<td>{option.status}</td>
										</tr>
									</tbody>
								</table>                                  
								</div>
							))}
							
						</div>						
					</div>
					{userResponse==''?
					<div className="modal-footer" id="status-footer" style={{display: "unset"}} >
						<button type="submit"  className="next action-button apply-now-btn ml-00 leftfloat-withmr-1" style={{float: "right"}}>Check</button>
					</div>
					: ''}
					
				</div>
			</div>
			</form>
		</div>
			<section className="newstep-form">
				<div className="container new-step-container">
					<div className="row form-newalign">
						<div className="col-md-12 col-lg-6">
							<form id="msform" onSubmit={form.handleSubmit}>
								<fieldset className="ui-step-content" style={currentStep == 0 ? { display: "block" } : { display: "none" }}>
									<h1>Instant Business & Personal</h1>
									<ul className="checiocn">
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Personal Loan <small>₹ 10,000 to ₹ 25 Lakh</small>
											</span>
										</li>
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Business Loan <small>₹ 50,000 to ₹ 5 Crores</small>
											</span>
										</li>
									</ul>
									<ul className="checiocn">
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Rate of Interest <small>12% Onwards</small>
											</span>
										</li>
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Tenure <small>3-60 Months</small>
											</span>
										</li>
									</ul>
									<ul className="checiocn">
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Fast Approval <small>Instant approval in 3 Steps</small>
											</span>
										</li>
										<li>
											<img src="/assets/img/ornage-check.svg" alt="" />
											<span>
												Processing Fee <small>1% Onwards</small>
											</span>
										</li>
									</ul>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00 leftfloat-withmr-1" value="Apply Now" style={{float :"left"}}/>

									<input type="button" name="next" className="next action-button apply-now-btn ml-00 leftfloat-withmr-1" value="Check Status" style={{float :"right"}}  onClick={() => setShow(true)}/>
									{/* <a href="javascript:void(0)" data-toggle="modal" data-target="#check-status" className="apply-now-btn ml-00 mymodalonline">Check Status</a> */}

								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 1 ? { display: "block" } : { display: "none" }}>
									<h1 className="mb-0">Apply in 3 easy steps</h1>
									<h6 className="md-4">let's start with your basic info</h6>

									<div className="stepform-newdesign">
										<div className="row">
											<div className="col-12 col-md-10">
												<label>Mobile Number</label>
												<input type="text" className="mb-0" value={form.values.mobile_number}  onChange={(e) => updateNumber(e.target.value,'mobile_number',10) } placeholder="We will send an OTP on this number" />
												{form.touched.mobile_number && form.errors.mobile_number ?
													<div className="text-danger">{form.errors.mobile_number}</div> : ''}
											</div>
											<div className="col-md-12">
												<ul className="unstyled centered mt-5">
													<li>
														<input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
														<label htmlFor="styled-checkbox-1">Get updates on WhatsApp</label>
													</li>
													<li>
														<input className="styled-checkbox" id="styled-checkbox-2" type="checkbox" checked={form.values.is_agree == true} onChange={(e) => form.setFieldValue('is_agree', e.target.checked)} />
														<label htmlFor="styled-checkbox-2">Please agree with the
															<Link to=""> &nbsp;Terms & Conditions </Link> &nbsp;and&nbsp;<Link to=""> Privacy Policy </Link>
														</label>
														{form.touched.is_agree && form.errors.is_agree ? <div className="text-danger">{form.errors.is_agree}</div> : ''}
													</li>
												</ul>
											</div>
										</div>
									</div>
									<input type="submit" className="next action-button apply-now-btn ml-00" value="Send OTP" />
								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 2 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)}><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0">Verify OTP</h1>
									<h6 className="md-4">FINITT has sent an OTP to your registered mobile number +91 {form.values.mobile_number}</h6>
									<div className="stepform-newdesign">
										<div className="row">
											<div className="col-12 col-md-10">
												<label>Enter OTP</label>
												<input type="text" className="mb-0"  value={form.values.otp_verified} onChange={(e) => updateNumber(e.target.value,'otp_verified',6) }  placeholder="Enter 6 Digit OTP"  />
												{form.values.wrong_opt==false  && form.touched.otp_verified && form.errors.otp_verified ? <div className="text-danger">{form.errors.otp_verified}</div> : ''}
												{form.values.wrong_opt?
                                                  <div className="text-danger">
                                                       Please enter valid OPT.
												  </div>
                                                : ''}
											</div>
											{/* <div className="col-xs-6 col-md-5">
								     <Link to="" className="resentotp">Resend OTP</Link>
								</div> */}
											{/*<div className="col-xs-6 col-md-5 text-right">
								     <i className="fa-regular fa-clock fa-fw"></i> 00:15
								</div>*/}
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Verify & Proceed" />
								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 3 ? { display: "block" } : { display: "none" }}>
									{/* <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button> */}
									<h1>Personal info</h1>
									<div className="stepform-newdesign">
										<div className="row">
											{/* <div className="col-xs-12 col-md-5">
								    <label>First Name</label>
								    <input type="text" className="" placeholder="Name as per PAN"/>
								</div>
								<div className="col-xs-12 col-md-5">
								    <label>Last Name</label>
								    <input type="text" className="" placeholder="Name as per PAN"/>
								</div> */}
											<div className="col-xs-12 col-md-8"> 
												<label>Pan Card Number</label>
												<input type="text" className="mb-0" placeholder="Enter pan card number"  onChange={(e) => updateNumber(e.target.value,'pan_number',10) } value={form.values.pan_number} />
												{form.touched.pan_number && form.errors.pan_number ? <div className="text-danger">{form.errors.pan_number}</div> : ''}

											</div>
											{/* <div className="col-xs-12 col-md-5">
								    <label>Date of birth</label>
								    <input type="date" className="" placeholder="DOB as per PAN"/>
								</div> */}

										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Submit" />
								</fieldset>

								{/* <fieldset className="ui-step-content" style={currentStep==4?{display:"block"}:{display:"none"}}>
					    <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
						<h1>Phone number verification</h1>
						<div className="stepform-newdesign">
							<div className="row">
								<div className="col-12 col-md-10">
								    <label>Mobile Number</label>
								    <input type="text" className="" placeholder="" value="9009312345" disabled/>
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
								    <input type="text" className="" placeholder="Enter 6 Digit OTP"/>
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
								    <input type="text" className="" placeholder="Enter one time password"/>
								</div>
							</div>
						</div>
					   <input type="button" name="next" className="next action-button apply-now-btn  ml-00" value="Continue" />
					</fieldset> */}

								<fieldset className="ui-step-content" style={currentStep == 4 ? { display: "block" } : { display: "none" }}>
									{/* <button type="button" name="previous" className="previous action-button-previous" onClick={() =>setCurrentStep(currentStep-1) } ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button> */}

									<div>
										<h1>Congratulations! <br></br> You are eligible for a loan.</h1>

									</div>

									
									<div className="checkbox">
										<p className="mb-33"><b>Employment type</b></p>
										{/* <div className="checkbox"> */}
										<div className="col-md-12">
										<div className="col-md-4">
										<input id="checkbox-1"  className="styled-checkbox" name="employee_type" type="checkbox" value="1" onChange={(e) => form.setFieldValue('employee_type', e.target.value)} checked={form.values.employee_type == 1} />
										<label htmlFor="checkbox-1" className="checkbox-label">&nbsp; Salaried &nbsp;</label>
										</div>
										{/* </div> */}
										{/* <div className="checkbox"> */}
										<div className="col-md-4">
										<input id="checkbox-2" className="styled-checkbox"  name="employee_type" type="checkbox" value="2" onChange={(e) => form.setFieldValue('employee_type', e.target.value)} checked={form.values.employee_type == 2} />
										<label htmlFor="checkbox-2" className="checkbox-label"> Self Employed</label>
										</div>
										</div>
									</div>
									<div className="checkbox" style={{ marginBottom: "10px" }}>
										<p className="mb-33"><b>Loan Type</b></p>
										{/* <div className="checkbox"> */}
										<div className="col-md-12">
										<div className="col-md-4">
										<input id="checkbox-3" className="styled-checkbox"  name="loan_type" type="checkbox" value="1" onChange={(e) => form.setFieldValue('loan_type', e.target.value)} checked={form.values.loan_type == 1} />
										<label htmlFor="checkbox-3" className="checkbox-label">&nbsp; Personal &nbsp;</label>
										</div>
										<div className="col-md-4">
										<input id="checkbox-4"  className="styled-checkbox" name="loan_type" type="checkbox" value="2" onChange={(e) => form.setFieldValue('loan_type', e.target.value)} checked={form.values.loan_type == 2} />
										<label htmlFor="checkbox-4" className="checkbox-label">&nbsp; Business &nbsp;</label>
										</div>
										</div>
									</div>
									<div className="col-xs-12 col-md-8 ">
										{form.touched.loan_type && form.errors.loan_type ? <div className="text-danger">{form.errors.loan_type}</div> : ''}
									</div>

									{/* <div>
							<h1>Sorry!</h1>
							<p>Oops! We regret to inform you that we are unable to process your application as it does not meet our internal policy criteria. Please note the reason for the decline of your application is a business decision and is based on multiple parameters and certainly on no way, is indicative of your creditworthiness. Please try again after 60 Days.</p>
						</div> */}

									<div>
										<input type="submit" name="submit" className="submit action-button apply-now-btn ml-00" value="Go" />
									</div>
									<Link to="" className="apply-now-btn ml-00" style={{ display: "none" }}>Start New Application</Link>

								</fieldset>
							</form>
						</div>
						<div className="col-md-12 col-lg-6">
							<img src="/assets/img/loan.png" alt="" className="righimg" />
						</div>

					</div>
				</div>
			</section>
		</>
	);
}

const BusinessForm = (props) => {
	const [currentStep, setCurrentStep] = useState(0);
	const form = useFormik({
		initialValues: props.data.business_info,
		enableReinitialize: true,
		validationSchema: yup.object({
			email: currentStep == 0 ? yup.string().email('Please enter valid email address').required('Please enter email address') : '',
			first_name: currentStep == 0 ? yup.string().required('Please enter your name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			last_name: currentStep == 0 ? yup.string().required('Please enter your surname').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			gender: currentStep == 0 ? yup.string().required('Please select gender') : '',
			date_of_birth: currentStep == 0 ? yup.string().required('Please enter dob') : '',
			company_name: currentStep == 0 ? yup.string().required('Please enter business name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			legal_name: currentStep == 0 ? yup.string().required('Please enter legal name of your business').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			state: currentStep == 0 ? yup.string().required('Please select state') : '',
			city: currentStep == 0 ? yup.string().required('Please select city') : '',
			houseno: currentStep == 0 ? yup.string().required('Please tnter building name/flat no') : '',
			pincode: currentStep == 0 ? yup.string().required('Please select pincode') : '',
			business_type: currentStep == 0 ? yup.string().required('Please select business type') : '',
			type_of_nature: currentStep == 0 ? yup.string().required('Please select nature of your business') : '',
			vintage: currentStep == 0 ? yup.number().typeError('you must specify a number').required('Please enter no of years in business') : '',
			turn_over: currentStep == 0 ? yup.string().required('Please select business turn over') : '',
			desired_amount: currentStep == 0 ? yup.string().required('Please select desired loan amount') : '',
			required_amount: currentStep == 0 ? yup.number().typeError('you must specify a number').required('please enter required amount') : '',
			co_application: currentStep == 1 ? yup.array().of(
				yup.object({
					name: yup.string().required("Please enter co-applicant name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
					pan_number: yup.string().required("Please enter co-applicant pan card number"),
					pancard_image: yup.string().required("Please upload co-applicant pan card"),
					relationship: yup.string().required("Please enter co-applicant relationship").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
				}),
			) : '',
			pan_number: currentStep == 2 ? yup.string().required('Please enter pan card number') : '',
			pancard_image: currentStep == 2 ? yup.string().required('Please upload pan card') : '',
			gst_number: currentStep == 2 ? yup.string().required('Please enter valid GST number') : '',
			gstproof_image: currentStep == 2 ? yup.string().required('Please upload valid GST') : '',
			business_address: currentStep == 2 ? yup.string().required('Please enter valid business address') : '',
			business_address_proof: currentStep == 2 ? yup.string().required('Please enter business address proof') : '',
			bank_statement: currentStep == 2 ? yup.string().required('Please upload bank statement') : '',
			itr_docs: currentStep == 2 ? yup.string().required('Please upload ITR') : '',
			loan_purpose: currentStep == 2 ? yup.number().required('Please select loan purpose') : '',

		}),
		onSubmit: values => {
			props.data.business_info = values;
			props.setData(props.data);
			if (currentStep == 2) {
				// props.next(props.data, false);
				props.setCurrentStep(parseInt(props.currentStep) + 1)
				window.scrollTo(0, 0);
			} else {
				setCurrentStep(currentStep + 1)
				window.scrollTo(0, 0);
			}

		}
	});

	const acceptedFiles = (e, path, s3_path,co_index=0) => {
		if(e.target.files.length) {
			var formData;
				formData = new FormData();
				for (let i = 0; i < e.target.files.length; i++) {
					formData.append('image', e.target.files[i])
				}
				formData.append('folder', s3_path)
				api.postApi('multipleImageUpload', formData, true, props.header).then(response => {
					if(path=='co_application') {
						let fileNew = form.values.co_application[co_index].pancard_image ?form.values.co_application[co_index].pancard_image +','+response.fileName  :response.fileName;
						// console.log(fileNew)
						form.setFieldValue(`co_application.${co_index}.pancard_image`, fileNew);

					} else {
						form.setFieldValue(path, form.values[path]?form.values[path] +','+response.fileName : response.fileName);

					}
				}).catch(error => {

				});
		}
	}

	const removeImage = (e,index,path,co_index=0) => {
		e.preventDefault()
		var array;
		if(path=='co_application') {
		   console.log(form.values.co_application[co_index].pancard_image)
		    array =form.values.co_application[co_index].pancard_image.split(',')
			array.splice(index, 1)
			form.setFieldValue(`co_application.${co_index}.pancard_image`, array.join(','));
		} else {
		    array = form.values[path].split(',')
			array.splice(index, 1)
			form.setFieldValue(path, array.join(','));
		}
		
		console.log(array)
		
	}

	const [cities, setCities] = useState([]);
	const GetCities = (state_id) => {
		var state = props.allStates.find(state => state.id == state_id);
		api.postApi('cityList', { state_id: state_id }, false, props.header).then(response => {
			form.setFieldValue('state', state.name)
			form.setFieldValue('state_id', state_id)
			setCities(response.cities);
		}).catch(error => {
		});

	}

	const [pincode, setPincode] = useState([]);
	const GetPincode = (city_id) => {
		var city = cities.find(city => city.id == city_id);

		api.postApi('pincodeList', { city: city.name, state_id: form.values.state_id }, false, props.header).then(response => {
			form.setFieldValue('city', city.name)
			form.setFieldValue('city_id', city_id)
			setPincode(response.pincode);
		}).catch(error => {
		});

	}
	const checkURL= (url) => {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}

	const  capitalName = (text) => {
		text = text.toLowerCase();
		console.log(text.charAt(0).toUpperCase() + text.slice(1))
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
	return (
		<>
			<section className="newstep-form">
				<div className="container new-step-container">
					<div className="row form-newalign">
						<div className="col-md-12 col-lg-6">
							<form id="msform" onSubmit={form.handleSubmit}>
								<fieldset className="ui-step-content" style={currentStep == 0 ? { display: "block" } : { display: "none" }}>
									<h1 className="mb-0">Business Info</h1>
									<p className="mt-1">Instant Business & Personal Loan</p>
									<div className="stepform-newdesign">
										<div className="row">
										    <div className="col-12 col-md-5">
												<label>First Name</label>
												<input type="text" name="first_name" {...form.getFieldProps("first_name")} className="" placeholder="Enter first name" />
												{form.touched.first_name && form.errors.first_name ? <div className="text-danger">{form.errors.first_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Last Name</label>
												<input type="text" name="last_name" {...form.getFieldProps("last_name")} className="" placeholder="Enter last name" />
												{form.touched.last_name && form.errors.last_name ? <div className="text-danger">{form.errors.last_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Email Address</label>
												<input type="text" name="email" {...form.getFieldProps("email")} className="" placeholder="Enter email" />
												{form.touched.email && form.errors.email ? <div className="text-danger">{form.errors.email}</div> : ''}
											</div>
 
											<div className="col-12 col-md-5"> 
												<label>Date of birth</label>
												
												<input type="date"      
       max="1999-12-31" name="date_of_birth" {...form.getFieldProps("date_of_birth")} className="" placeholder="Enter Date of birth" />
												{form.touched.date_of_birth && form.errors.date_of_birth ? <div className="text-danger">{form.errors.date_of_birth}</div> : ''}
											</div>
										    <div className="col-xs-12 col-md-10">
												<label>Gender</label>
												<select name="gender" onChange={(e) => form.setFieldValue('gender', e.target.value)} >
													<option>Select One</option>
													<option value="Male" >Male</option>
													<option value="Female">Female</option>
													<option value="Other">Other</option>
													<option value="Prefer not to disclose">Prefer not to disclose</option>
												</select>
												{form.touched.gender && form.errors.gender ? <div className="text-danger">{form.errors.gender}</div> : ''}
											</div>
											<div className="col-12 col-md-10">
												<label>Business Name</label>
												<input type="text" name="company_name" {...form.getFieldProps("company_name")} className="" placeholder="Enter name" />
												{form.touched.company_name && form.errors.company_name ? <div className="text-danger">{form.errors.company_name}</div> : ''}
											</div>
											<div className="col-12 col-md-10">
												<label>Legal Name</label>
												<input type="text" name="legal_name" {...form.getFieldProps("legal_name")} className="" placeholder="Enter name" />
												{form.touched.legal_name && form.errors.legal_name ? <div className="text-danger">{form.errors.legal_name}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label>
												<select name="state" onChange={(e) => GetCities(e.target.value)} >
													<option>Select One</option>
													{props.allStates && props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.id} key={index}>{option.name}</option>
													))}
												</select>
												{form.touched.state && form.errors.state ? <div className="text-danger">{form.errors.state}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="city" onChange={(e) => GetPincode(e.target.value)} >
													<option>Select One</option>
													{cities.length > 0 && cities.map((option, index) => (
														<option value={option.id} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.touched.city && form.errors.city ? <div className="text-danger">{form.errors.city}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Flat No./building no./street no.</label>
												<input type="text" name="houseno" {...form.getFieldProps("houseno")} className="" placeholder="Enter House No." />
												{form.touched.houseno && form.errors.houseno ? <div className="text-danger">{form.errors.houseno}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pin Code</label>
												<select name="pincode" onChange={(e) => form.setFieldValue('pincode', e.target.value)} >
													<option>Select One</option>
													{pincode.length > 0 && pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.touched.pincode && form.errors.pincode ? <div className="text-danger">{form.errors.pincode}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Type of Firm</label>
												<select name="business_type" onChange={(e) => form.setFieldValue('business_type', e.target.value)}>
													<option>Select One</option>
													<option value="Individual">Individual</option>
													<option value="Proprietorship">Proprietorship</option>
													<option value="Partnership">Partnership</option>
													<option value="PVT .ltd">PVT .ltd</option>
												</select>
												{form.touched.business_type && form.errors.business_type ? <div className="text-danger">{form.errors.business_type}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Nature of Business</label>
												<select name="type_of_nature" onChange={(e) => form.setFieldValue('type_of_nature', e.target.value)}>
												{form.touched.loan_purpose && form.errors.loan_purpose ? <div className="text-danger">{form.errors.loan_purpose}</div> : ''}
													<option>Select One</option>
													<option value="Retail">Retail</option>
													<option value="Manufacturing">Manufacturing</option>
													<option value="Service">Service</option>
													<option value="Wholesale" >Wholesale</option>
												</select>
												{form.touched.type_of_nature && form.errors.type_of_nature ? <div className="text-danger">{form.errors.type_of_nature}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>No. of years in Business</label>
												<input type="number" min="0" name="vintage" {...form.getFieldProps("vintage")} className="" placeholder="Enter year" />
												{form.touched.vintage && form.errors.vintage ? <div className="text-danger">{form.errors.vintage}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Monthly Turnover</label>
												<select name="turn_over" onChange={(e) => form.setFieldValue('turn_over', e.target.value)}>
													<option>Select One</option>
													<option value="0.5 - 0.75 lac">0.5 - 0.75 lac</option>
													<option value="0.75 - 1 lac">0.75 - 1 lac</option>
													<option value="1 - 5 lac">1 - 5 lac</option>
													<option value="5 - 10 lac">5 - 10 lac</option>
													<option value="10 - 15 lac">10 - 15 lac</option>
													<option value="15 - 20 lac">15 - 20 lac</option>
													<option value="20 - 25 lac">20 - 25 lac</option>
													<option value="25 - 30 lac">25 - 30 lac</option>
													<option value="30 - 35 lac">30 - 35 lac</option>
													<option value="35 - 40 lac">35 - 40 lac</option>
													<option value="40 - 45 lac">40 - 45 lac</option>
													<option value="45 - 50 lac">45 - 50 lac</option>
													<option value="50 - 55 lac">50 - 55 lac</option>
													<option value="55 - 60 lac">55 - 60 lac</option>
													<option value="60 - 65 lac">60 - 65 lac</option>
													<option value="65 - 70 lac" >65 - 70 lac</option>
													<option value="70 - 75 lac">70 - 75 lac</option>
													<option value="75 - 80 lac">75 - 80 lac</option>
													<option value="80 - 85 lac">80 - 85 lac</option>
													<option value="85 - 90 lac">85 - 90 lac</option>
													<option value="90 - 95 lac">90 - 95 lac</option>
													<option value="95 - 99 lac">95 - 99 lac</option>
													<option value="99 above">99 above</option>
												</select>
												{form.touched.turn_over && form.errors.turn_over ? <div className="text-danger">{form.errors.turn_over}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Desired Loan Amount</label>
												<select name="desired_amount" onChange={(e) => form.setFieldValue('desired_amount', e.target.value)}>
													<option>Select One</option>
													<option value="0.5 - 0.75 lac">0.5 - 0.75 lac</option>
													<option value="0.75 - 1 lac">0.75 - 1 lac</option>
													<option value="1 - 5 lac">1 - 5 lac</option>
													<option value="5 - 10 lac">5 - 10 lac</option>
													<option value="10 - 15 lac">10 - 15 lac</option>
													<option value="15 - 20 lac">15 - 20 lac</option>
													<option value="20 - 25 lac">20 - 25 lac</option>
													<option value="25 - 30 lac">25 - 30 lac</option>
													<option value="30 - 35 lac">30 - 35 lac</option>
													<option value="35 - 40 lac">35 - 40 lac</option>
													<option value="40 - 45 lac">40 - 45 lac</option>
													<option value="45 - 50 lac">45 - 50 lac</option>
													<option value="50 - 55 lac">50 - 55 lac</option>
													<option value="55 - 60 lac">55 - 60 lac</option>
													<option value="60 - 65 lac">60 - 65 lac</option>
													<option value="65 - 70 lac">65 - 70 lac</option>
													<option value="70 - 75 lac" >70 - 75 lac</option>
													<option value="75 - 80 lac">75 - 80 lac</option>
													<option value="80 - 85 lac">80 - 85 lac</option>
													<option value="85 - 90 lac">85 - 90 lac</option>
													<option value="90 - 95 lac">90 - 95 lac</option>
													<option value="95 - 99 lac">95 - 99 lac</option>
													<option value="99 above">99 above</option>
												</select>
												{form.touched.desired_amount && form.errors.desired_amount ? <div className="text-danger">{form.errors.desired_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Required Amount</label>
												<input type="text" name="required_amount" {...form.getFieldProps("required_amount")} className="" placeholder="Enter amount" />
												{form.touched.required_amount && form.errors.required_amount ? <div className="text-danger">{form.errors.required_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-10">
												    <label>Loan purpose </label>
												    <select name="loan_purpose" onChange={(e) => form.setFieldValue('loan_purpose', e.target.value)}>
														<option>Select One</option>
														<option value="90000111" >Business Funding</option>
														<option value="90133283">Business working capital</option>
														<option value="1367">Education</option>
														<option value="90133283">Loan against gold</option>
														<option value="90133589">Loan against property</option>
														<option value="1371">Medical</option>
														<option value="90156975">Top up Loan</option>
														<option value="1373">Wedding</option>
													</select>
												{form.touched.loan_purpose && form.errors.loan_purpose ? <div className="text-danger">{form.errors.loan_purpose}</div> : ''}

											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00" value="Continue" />
								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 1 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)} ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0 mt-1">Co-Applicants</h1>
									<p className="mt-1">Instant Business & Personal Loan </p>
									<div className="stepform-newdesign">
										{form.values.co_application.length > 0 && form.values.co_application.map((co, index) =>

											<div className="row" key={index}>
												<div className="col-12 col-md-5">
													<label>Name</label>
													<input type="text" name={`form.values.co_application.${index}.name`}  {...form.getFieldProps(`co_application.${index}.name`)} className="" placeholder="Enter name" />

													{form.touched['co_application']?.[index]?.['name'] && form.errors['co_application']?.[index]?.['name'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['name']}</div> : ''}
												</div>
												<div className="col-12 col-md-5">
													<label>Relationship</label>
													<input type="text" name={`form.values..co_application.${index}.relationship`} {...form.getFieldProps(`co_application.${index}.relationship`)} className="" placeholder="Enter relationship" />
													{form.touched['co_application']?.[index]?.['relationship'] && form.errors['co_application']?.[index]?.['relationship'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['relationship']}</div> : ''}
												</div>
												<div className="col-xs-12 col-md-10 mb-3">
													<label>Pan Card Number </label>
													<input type="text" name={`form.values..co_application.${index}.pan_number`}  {...form.getFieldProps(`co_application.${index}.pan_number`)} className="mb-0" placeholder="Enter Number" />
													{form.touched['co_application']?.[index]?.['pan_number'] && form.errors['co_application']?.[index]?.['pan_number'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['pan_number']}</div> : ''}
												</div>
												<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Co-Applicants Pan Card</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'co_application', 'uploads/merchant/pancard',index)} />

															</label>
														</div>
														{form.values['co_application']?.[index]?.['pancard_image'] == '' && form.touched['co_application']?.[index]?.['pancard_image'] && form.errors['co_application']?.[index]?.['pancard_image'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['pancard_image']}</div> : ''}

													</div>
													{form.values['co_application']?.[index]?.['pancard_image'] && form.values['co_application']?.[index]?.['pancard_image'].split(',') && form.values['co_application']?.[index]?.['pancard_image'].split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values['co_application']?.[index]?.['pancard_image'] && form.values['co_application']?.[index]?.['pancard_image'].split(',').map((option, option_index) => (
																	<li key={option_index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/pancard/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/pancard/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,option_index,'co_application',index)}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,option_index,'co_application',index)}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
												</div>
												{/* <div className="col-12 col-md-6 col-lg-5">
													<p className="mb-0">Upload Co-Applicants Pan Card</p>
													<div className="preview-zone hidden">
														<div className="imgupload-box box-solid">
															<div className="box-header with-border">
																<div className="box-tools pull-right">
																	<button type="button" className="btn btn-danger btn-xs remove-preview">
																		<i className="fa-solid fa-trash fa-fw"></i>
																	</button>
																</div>
															</div>
															<div className="box-body"></div>
														</div>
													</div>
													<div className="dropzone-wrapper" style={{overflow:"hidden"}}>
														<label htmlFor="co_application_image" style={{cursor: "pointer"}}>
															{form.values['co_application']?.[index]?.['pancard_image_url'] ?
																<img src={form.values['co_application']?.[index]?.['pancard_image_url']} alt="" width="100%" height="100%" />
																:
																<div className="dropzone-desc">
																	<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
																	<p className="mt-1">Upload Image(png/jpeg/jpg)</p>
																</div>
															}
														</label>
													</div>
													<input type="file" id="co_application_image"  className="dropzone" accept="image/png, image/jpeg, image/jpg" onChange={(e) => acceptedFiles(e, `co_application.${index}.pancard_image`, 'uploads/merchant/pancard')}  style={{display:"none"}}/>

													{form.values['co_application']?.[index]?.['pancard_image'] == '' && form.touched['co_application']?.[index]?.['pancard_image'] && form.errors['co_application']?.[index]?.['pancard_image'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['pancard_image']}</div> : ''}

												</div> */}
											</div>
										)}
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00" value="Continue" />
								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 2 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)} ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0 mt-1">Upload Doc</h1>
									<p className="mt-1">Instant Business & Personal Loan</p>
									<div className="stepform-newdesign">
										<div className="row md-4">
											<div className="col-xs-12 col-md-10 mb-3">
												<label>Firm Pan Number </label>
												<input type="text" name="pan_number" {...form.getFieldProps('pan_number')} className="mb-0" placeholder="Enter Number" />
												{form.touched.pan_number && form.errors.pan_number ? <div className="text-danger">{form.errors.pan_number}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Pan Card</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'pancard_image', 'uploads/merchant/pancard')} />

															</label>
														</div>
														{form.values.pancard_image == '' && form.touched.pancard_image && form.errors.pancard_image ? <div className="text-danger">{form.errors.pancard_image}</div> : ''} 

													</div>
													{form.values.pancard_image && form.values.pancard_image.split(',') && form.values.pancard_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.pancard_image && form.values.pancard_image.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/pancard/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/pancard/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
										</div>
										<div className="row">
											<div className="col-xs-12 col-md-10 mb-3">
												<label>Firm GST Number </label>
												<input type="text" name="gst_number" {...form.getFieldProps('gst_number')} className="" placeholder="Enter Number" />
												{form.touched.gst_number && form.errors.gst_number ? <div className="text-danger">{form.errors.gst_number}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload GST Registration</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'gstproof_image', 'uploads/merchant/gst')} />

															</label>
														</div>
														{form.values.gstproof_image == '' && form.touched.gstproof_image && form.errors.gstproof_image ? <div className="text-danger">{form.errors.gstproof_image}</div> : ''} 

													</div>
													{form.values.gstproof_image && form.values.gstproof_image.split(',') && form.values.gstproof_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.gstproof_image && form.values.gstproof_image.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/gst/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/gst/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'gstproof_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'gstproof_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
										</div>
										<div className="row md-4">
											<div className="col-xs-12 col-md-10 mb-3">
												<label>Business Address </label>
												<input type="text" name="business_address"  {...form.getFieldProps('business_address')} className="mb-0" placeholder="Enter address" />
												{form.values.business_address == '' &&  form.touched.business_address && form.errors.business_address ? <div className="text-danger">{form.errors.business_address}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Address Proof</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'business_address_proof', 'uploads/merchant/business')} />

															</label>
														</div>
														{form.values.business_address_proof == '' && form.touched.business_address_proof && form.errors.business_address_proof ? <div className="text-danger">{form.errors.business_address_proof}</div> : ''} 

													</div>
													{form.values.business_address_proof && form.values.business_address_proof.split(',') && form.values.business_address_proof.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.business_address_proof && form.values.business_address_proof.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/business/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/business/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'business_address_proof')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'business_address_proof')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
										</div>
										<div className="row">
												<div className="col-12 col-md-6 col-lg-10">
													{/* <p>One Year Latest Bank Statement</p> */}
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload One Year Latest Bank Statement (only pdf file)</p>
															<input type="file" multiple accept=".pdf" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'bank_statement', 'uploads/merchant/bankstatement')} />

															</label>
														</div>
														{form.values.bank_statement == '' && form.touched.bank_statement && form.errors.bank_statement ? <div className="text-danger">{form.errors.bank_statement}</div> : ''} 

													</div>
													{form.values.bank_statement && form.values.bank_statement.split(',') && form.values.bank_statement.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.bank_statement && form.values.bank_statement.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/bankstatement/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/bankstatement/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'bank_statement')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'bank_statement')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
												<div className="col-12 col-md-6 col-lg-10">
													{/* <p>Upload ITR (Optional)</p> */}
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload ITR (Optional)</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'itr_docs', 'uploads/merchant/business')} />

															</label>
														</div>
														{form.values.itr_docs == '' && form.touched.itr_docs && form.errors.itr_docs ? <div className="text-danger">{form.errors.itr_docs}</div> : ''} 

													</div>
													{form.values.itr_docs && form.values.itr_docs.split(',') && form.values.itr_docs.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.itr_docs && form.values.itr_docs.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/business/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/business/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'itr_docs')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'itr_docs')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Verify & Proceed" />
								</fieldset>

								{/* <fieldset className="ui-step-content" style={currentStep == 3 ? { display: "block", textAlign: "center" } : { display: "none" }} >
									<div className="success-animation">
										<svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
									</div>
									<h1 className="mb-0">Thank you!</h1>
									<h6 className="mb-0">Your application has been successfully received. You may choose to note down the file number for further tracking of the case!</h6>
									<p><b>File ID:</b> : {props.formResponse && props.formResponse.file_id}</p>
									<p><b>Password:</b> {props.formResponse && props.formResponse.password}</p>
								</fieldset> */}
							</form>
						</div>

						<div className="col-md-12 col-lg-6">
							<img src="/assets/img/loan.png" alt="dd" className="righimg" />
						</div>

					</div>
				</div>
			</section>
		</>
	)
}

const PersonalForm = (props) => {
	const [currentStep, setCurrentStep] = useState(0);
	const form = useFormik({
		initialValues: props.data.personal_info,
		// enableReinitialize: true,
		validationSchema: yup.object({
			first_name: currentStep == 0 ? yup.string().required('Please enter your name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			last_name: currentStep == 0 ? yup.string().required('Please enter your surname').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			date_of_birth: currentStep == 0 ? yup.string().required('Please enter dob') : '',
			email: currentStep == 0 ? yup.string().email('Please enter valid email address').required('Please enter email address') : '',
			father_name: currentStep == 0 ? yup.string().required(`Please enter father's name`).matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			gender: currentStep == 0 ? yup.string().required('Please select gender') : '',
			qualification: currentStep == 0 ? yup.string().required('Please select qualification') : '',
			marital_status: currentStep == 0 ? yup.string().required('Please select marital status') : '',
			number_of_kids: currentStep == 0 ? yup.number().typeError('you must specify a number') : '',
			vehicle_type: currentStep == 0 ? yup.string().required('Please select vehicle type') : '',
			residence_building: currentStep == 0 ? yup.string().required('Please enter Flat No./Building No./Street No') : '',
			residence_area: currentStep == 0 ? yup.string().required('Please enter residence area') : '',
			residence_state: currentStep == 0 ? yup.string().required('Please select state') : '',
			residence_city: currentStep == 0 ? yup.string().required('Please select city') : '',
			residence_pincode: currentStep == 0 ? yup.string().required('Please select pincode') : '',

			employer_name: currentStep == 1 ? yup.string().required('Please enter employer name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			designation: currentStep == 1 ? yup.string().required('Please enter your designation').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			organization: currentStep == 1 ? yup.number().typeError('you must specify a number').required('Please enter working years') : '',
			organization_type: currentStep == 1 ? yup.string().required('Please select organization') : '',
			total_experience: currentStep == 1 ? yup.string().required('Please select total experience') : '',
			required_amount: currentStep == 1 ? yup.number().typeError('you must specify a number').required('Please enter required amount') : '',
			company_building: currentStep == 1 ? yup.string().required('Please enter Flat No./Building No./Street No') : '',
			company_area: currentStep == 1 ? yup.string().required('Please enter area') : '',
			company_state: currentStep == 1 ? yup.string().required('Please select state') : '',
			company_city: currentStep == 1 ? yup.string().required('Please select city') : '',
			company_pincode: currentStep == 1 ? yup.string().required('Please select pincode') : '',
			company_website: currentStep == 1 ? yup.string().matches(
				/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
				'Please enter valid URL'
			).required('Please enter website') : '',
			company_email: currentStep == 1 ? yup.string().email('Please enter valid email address').required('Please enter valid company email') : '',
			salery_inhand: currentStep == 1 ? yup.number().typeError('you must specify a number').required('Please enter salary detail') : '',
			salary_mode: currentStep == 1 ? yup.string().required('Please select salary mode') : '',
			bank_name: currentStep == 1 ? yup.string().required('Please enter bank name') : '',
			pancard_image: currentStep == 2 ? yup.string().required('Please upload pan card image') : '',
			aadhar_image: currentStep == 2 ? yup.string().required('Please upload aadhar image') : '',
			bank_statement: currentStep == 2 ? yup.string().required('Please upload bank statement') : '',
			salery_slip: currentStep == 2 ? yup.string().required('Please upload salary slip') : '',
			loan_purpose: currentStep == 1 ? yup.number().required('Please select loan purpose') : '',
		}),
		onSubmit: values => {
			props.data.personal_info = values;
			props.setData(props.data);
			if (currentStep == 2) {
				// props.next(props.data);
				props.setCurrentStep(parseInt(props.currentStep) + 2)
				window.scrollTo(0, 0);
			} else {
				setCurrentStep(currentStep + 1)
				window.scrollTo(0, 0);
			}
		}
	});

	const acceptedFiles = (e, path, s3_path) => {
		if(e.target.files.length) {
			var formData;
				formData = new FormData();
				for (let i = 0; i < e.target.files.length; i++) {
					formData.append('image', e.target.files[i])
				}
				formData.append('folder', s3_path)
				api.postApi('multipleImageUpload', formData, true, props.header).then(response => {
					form.setFieldValue(path, form.values[path]?form.values[path] +','+response.fileName : response.fileName);
					e.target.value='';
				}).catch(error => {

				});
		}
	}


	const [cities, setCities] = useState([]);
	const [residence_cities, setresidence_cities] = useState([]);
	const GetCities = (state_id, path = '') => {
		var state = props.allStates.find(state => state.id == state_id);
		api.postApi('cityList', { state_id: state_id }, false, props.header).then(response => {
			if (path == 'residence_state') {
				form.setFieldValue('residence_state', state.name)
				form.setFieldValue('residence_state_id', state_id)
				setresidence_cities(response.cities);
			} else {
				form.setFieldValue('company_state', state.name)
				form.setFieldValue('company_state_id', state_id)
				setCities(response.cities);
			}
		}).catch(error => {
		});
	}
	const [residence_pincode, setresidence_pincode] = useState([]);
	const [pincode, setPincode] = useState([]);
	const GetPincode = (city_id, path = '') => {
		var city;
		var state_id;
		if (path == 'residence_city') {
			city = residence_cities.find(city => city.id == city_id);
			state_id = form.values.residence_state_id
		} else {
			city = cities.find(city => city.id == city_id);
			state_id = form.values.company_state_id
		}

		api.postApi('pincodeList', { city: city.name, state_id: state_id }, false, props.header).then(response => {
			if (path == 'residence_city') {
				form.setFieldValue('residence_city', city.name)
				form.setFieldValue('residence_city_id', city_id)
				setresidence_pincode(response.pincode);
			} else {
				form.setFieldValue('company_city', city.name)
				form.setFieldValue('company_city_id', city_id)
				setPincode(response.pincode);
			}
		}).catch(error => {
		});

	}
	const removeImage = (e,index,path,co_index=0) => {
		e.preventDefault()
		var array;
		if(path=='co_application') {
		   console.log(form.values.co_application[co_index].pancard_image)
		    array =form.values.co_application[co_index].pancard_image.split(',')
			array.splice(index, 1)
			form.setFieldValue(`co_application.${co_index}.pancard_image`, array.join(','));
		} else {
		    array = form.values[path].split(',')
			array.splice(index, 1)
			form.setFieldValue(path, array.join(','));
		}
		
		console.log(array)
		
	}
	const checkURL= (url) => {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}


	const  capitalName = (text) => {
		text = text.toLowerCase();
		console.log(text.charAt(0).toUpperCase() + text.slice(1))
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
	return (
		<>
			<section className="newstep-form">
				<div className="container new-step-container">
					<div className="row form-newalign">
						<div className="col-md-12 col-lg-6">
							<form id="msform" onSubmit={form.handleSubmit}>

								<fieldset className="ui-step-content" style={currentStep == 0 ? { display: "block" } : { display: "none" }}>
									<h1 className="mb-0">Personal Info</h1>
									<p className="mt-1">Instant Business & Personal Loan</p>
									<div className="stepform-newdesign">
										<div className="row">
										    <div className="col-12 col-md-5">
												<label>First Name</label>
												<input type="text" name="first_name" {...form.getFieldProps("first_name")} className="" placeholder="Enter first name" />
												{form.touched.first_name && form.errors.first_name ? <div className="text-danger">{form.errors.first_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Last Name</label>
												<input type="text" name="last_name" {...form.getFieldProps("last_name")} className="" placeholder="Enter last name" />
												{form.touched.last_name && form.errors.last_name ? <div className="text-danger">{form.errors.last_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Email Address</label>
												<input type="text" name="email" {...form.getFieldProps("email")} className="" placeholder="Enter email" />
												{form.touched.email && form.errors.email ? <div className="text-danger">{form.errors.email}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Date of birth</label>
												<input type="date"   max="1999-12-31" name="date_of_birth" {...form.getFieldProps("date_of_birth")} className="" placeholder="Enter Date of birth" />
												{form.touched.date_of_birth && form.errors.date_of_birth ? <div className="text-danger">{form.errors.date_of_birth}</div> : ''}
											</div>
											<div className="col-12 col-md-10">
												<label>Father's Name</label>
												<input type="text" name="father_name" {...form.getFieldProps("father_name")} className="" placeholder="Enter father name" />
												{form.touched.father_name && form.errors.father_name ? <div className="text-danger">{form.errors.father_name}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Gender</label>
												<select name="gender" onChange={(e) => form.setFieldValue('gender', e.target.value)} >
													<option>Select One</option>
													<option value="Male" >Male</option>
													<option value="Female">Female</option>
													<option value="Other">Other</option>
													<option value="Prefer not to disclose">Prefer not to disclose</option>
												</select>
												{form.touched.gender && form.errors.gender ? <div className="text-danger">{form.errors.gender}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Qualification</label>
												<select name="qualification" onChange={(e) => form.setFieldValue('qualification', e.target.value)}>
													<option>Select One</option>
													<option value="Under Graduate" >Under Graduate</option>
													<option value="Graduate">Graduate</option>
													<option value="Post Graduate">Post Graduate</option>
												</select>
												{form.touched.qualification && form.errors.qualification ? <div className="text-danger">{form.errors.qualification}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Marital Status</label>
												<select name="marital_status" onChange={(e) => form.setFieldValue('marital_status', e.target.value)} >
													<option value="">Select One</option>
													<option value="Married" >Married</option>
													<option value="Single">Single</option>
													<option value="Prefer Not to Say">Prefer Not to Say</option>
												</select>
												{form.touched.marital_status && form.errors.marital_status ? <div className="text-danger">{form.errors.marital_status}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Number of Kids</label>
												<input type="number" min="0" name="number_of_kids" {...form.getFieldProps("number_of_kids")} className="" placeholder="Enter kids number" />
												{form.touched.number_of_kids && form.errors.number_of_kids ? <div className="text-danger">{form.errors.number_of_kids}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Vehicle Type</label>
												<select name="vehicle_type" onChange={(e) => form.setFieldValue('vehicle_type', e.target.value)} >
													<option>Select One</option>
													<option value="2 wheeler">2 wheeler</option>
													<option value="4 wheeler" >4 wheeler</option>
													<option value="None">None</option>
												</select>
												{form.touched.vehicle_type && form.errors.vehicle_type ? <div className="text-danger">{form.errors.vehicle_type}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Flat No./Building No./Street No.</label>
												<input type="text" name="residence_building" {...form.getFieldProps("residence_building")} className="" placeholder="Enter House No." />
												{form.touched.residence_building && form.errors.residence_building ? <div className="text-danger">{form.errors.residence_building}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label>
												<select name="residence_state" onChange={(e) => GetCities(e.target.value, 'residence_state')} >
													<option>Select One</option>
													{props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.id} key={index}>{option.name}</option>
													))}
												</select>
												{form.touched.residence_state && form.errors.residence_state ? <div className="text-danger">{form.errors.residence_state}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="residence_city" onChange={(e) => GetPincode(e.target.value, 'residence_city')}  >
													{/* <option>Select City</option> */}
													<option >Select One</option>
													{residence_cities.length > 0 && residence_cities.map((option, index) => (
														<option value={option.id} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.touched.residence_city && form.errors.residence_city ? <div className="text-danger">{form.errors.residence_city}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Locality/Area</label>
												<input type="text" name="residence_area" {...form.getFieldProps("residence_area")} className="" placeholder="Enter Locality/Area" />
												{form.touched.residence_area && form.errors.residence_area ? <div className="text-danger">{form.errors.residence_area}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pincode</label>
												<select name="residence_pincode" onChange={(e) => form.setFieldValue('residence_pincode', e.target.value)} >
													<option>Select One</option>
													{residence_pincode.length > 0 && residence_pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.touched.residence_pincode && form.errors.residence_pincode ? <div className="text-danger">{form.errors.residence_pincode}</div> : ''}
											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00" value="Continue" />
								</fieldset>

								<fieldset className="ui-step-content" style={currentStep == 1 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)} ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0 mt-1">Employment Info</h1>
									<p className="mt-1">Instant Business & Personal Loan</p>
									<div className="stepform-newdesign">
										<div className="row">
											<div className="col-12 col-md-5">
												<label>Name of current employer</label>
												<input type="text" name="employer_name"  {...form.getFieldProps("employer_name")} className="" placeholder="Enter name" />
												{form.touched.employer_name && form.errors.employer_name ? <div className="text-danger">{form.errors.employer_name}</div> : ''}

											</div>
											<div className="col-12 col-md-5">
												<label>Designation</label>
												<input type="text" className="" name="designation"  {...form.getFieldProps("designation")} placeholder="Enter designation" />
												{form.touched.designation && form.errors.designation ? <div className="text-danger">{form.errors.designation}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>No. of years in organization</label>
												<input type="number" min="0" className="" name="organization"  {...form.getFieldProps("organization")} placeholder="Enter year" />
												{form.touched.organization && form.errors.organization ? <div className="text-danger">{form.errors.organization}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Type of <br></br>organization </label>
												<select name="organization_type" onChange={(e) => form.setFieldValue('organization_type', e.target.value)}  >
													<option >Select One</option>
													<option value="Proprietorship" >Proprietorship</option>
													<option value="Partnership">Partnership</option>
													<option value="Private Limited">Private Limited</option>
													<option value="Public Limited">Public Limited</option>
													<option value="Government">Government</option>
													<option value="Other">OTHER</option>
												</select>
												{form.touched.organization_type && form.errors.organization_type ? <div className="text-danger">{form.errors.organization_type}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Total Experience (In Year) </label>
												<select name="total_experience" onChange={(e) => form.setFieldValue('total_experience', e.target.value)}  >
													<option >Select One</option>
													<option value="Less than 1">Less than Year</option>
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
													<option value="5">5</option>
													<option value="6">6</option>
													<option value="7">7</option>
													<option value="8">8</option>
													<option value="9">9</option>
													<option value="10">10</option>
													<option value="11">11</option>
													<option value="12">12</option>
													<option value="13">13</option>
													<option value="14">14</option>
													<option value="15">15</option>
													<option value="16">16</option>
													<option value="17">17</option>
													<option value="18">18</option>
													<option value="19">19</option>
													<option value="20">20</option>
													<option value="21">21</option>
													<option value="22">22</option>
													<option value="23">23</option>
													<option value="24">24</option>
													<option value="25">25</option>
													<option value="26">26</option>
													<option value="27">27</option>
													<option value="28">28</option>
													<option value="29">29</option>
													<option value="30">30</option>
													<option value="Greater than 30">Greater than 30</option>
												</select>
												{form.touched.total_experience && form.errors.total_experience ? <div className="text-danger">{form.errors.total_experience}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Required Amount</label>
												<input type="text" name="required_amount"  {...form.getFieldProps("required_amount")} className="" placeholder="Enter amount" />
												{form.touched.required_amount && form.errors.required_amount ? <div className="text-danger">{form.errors.required_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-10">
												<label>Loan purpose </label>
												<select name="loan_purpose" onChange={(e) => form.setFieldValue('loan_purpose', e.target.value)}>
														<option >Select One</option>
														<option value="1364">Appliance purchase</option>
														<option value="1365" >Car 2 Weller</option>
														<option value="1367" >Education</option>
														<option value="1368">Family event</option>
														<option value="1369" >Home furnishing</option>
														<option value="90000138">Land Purchase loan against property</option>
														<option value="90133639" >Loan for purchase of 2 wheelers</option>
														<option value="1371" >Medical</option>
														<option value="1372" >Travel</option>
														<option value="90156975">Top up loan</option>
														<option value="1373" >Wedding</option>
														<option value="1368" >Family event</option>
														<option value="1366" >Debt consolidationl</option>
													</select> 
													{form.touched.loan_purpose && form.errors.loan_purpose ? <div className="text-danger">{form.errors.loan_purpose}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Building No./Plot No.</label>
												<input type="text" name="company_building"  {...form.getFieldProps("company_building")} className="" placeholder="Enter house no." />
												{form.touched.company_building && form.errors.company_building ? <div className="text-danger">{form.errors.company_building}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label>
												<select name="company_state" onChange={(e) => GetCities(e.target.value, 'company_state')} >
													<option>Select One</option>
													{props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.id} key={index}>{option.name}</option>
													))}
												</select>
												{form.touched.company_state && form.errors.company_state ? <div className="text-danger">{form.errors.company_state}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="company_city" onChange={(e) => GetPincode(e.target.value, 'company_city')} >
													<option>Select One</option>
													{cities.length > 0 && cities.map((option, index) => (
														<option value={option.id} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.touched.company_city && form.errors.company_city ? <div className="text-danger">{form.errors.company_city}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Locality/Area </label>
												<input type="text" name="company_area"  {...form.getFieldProps("company_area")} className="" placeholder="Enter area." />
												{form.touched.company_area && form.errors.company_area ? <div className="text-danger">{form.errors.company_area}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pincode </label>
												<select name="company_pincode" onChange={(e) => form.setFieldValue('company_pincode', e.target.value)} >
													<option>Select One</option>
													{pincode.length > 0 && pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.touched.company_pincode && form.errors.company_pincode ? <div className="text-danger">{form.errors.company_pincode}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Company Website</label>
												<input type="text" name="company_website"  {...form.getFieldProps("company_website")} className="" placeholder="Enter website URL" />
												{form.touched.company_website && form.errors.company_website ? <div className="text-danger">{form.errors.company_website}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Official Email Address</label>
												<input type="text" name="company_email"  {...form.getFieldProps("company_email")} className="" placeholder="Enter official email" />
												{form.touched.company_email && form.errors.company_email ? <div className="text-danger">{form.errors.company_email}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Monthly take home</label>
												<input type="text" name="salery_inhand"  {...form.getFieldProps("salery_inhand")} className="" placeholder="Enter monthly income" />
												{form.touched.salery_inhand && form.errors.salery_inhand ? <div className="text-danger">{form.errors.salery_inhand}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Mode of receiving salary</label>
												<select name="salary_mode" onChange={(e) => form.setFieldValue('salary_mode', e.target.value)} >
													<option>Select One</option>
													<option value="Bank account transfer">Bank account transfer</option>
													<option value="Cheque" >Cheque</option>
													<option value="Cash">Cash</option>
												</select>
												{form.touched.salary_mode && form.errors.salary_mode ? <div className="text-danger">{form.errors.salary_mode}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Bank Name</label>
												<input type="text" name="bank_name"  {...form.getFieldProps("bank_name")} className="" placeholder="Enter your bank name" />
												{form.touched.bank_name && form.errors.bank_name ? <div className="text-danger">{form.errors.bank_name}</div> : ''}

											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00" value="Continue" />
								</fieldset>

								<fieldset className="ui-step-content" style={currentStep == 2 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)}  ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0 mt-1">Upload Doc</h1>
									<p className="mt-1">Instant Business & Personal Loan</p>
									<div className="stepform-newdesign">
										<div className="row">
										    <div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Pan Card</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'pancard_image', 'uploads/merchant/pancard')} />

															</label>
														</div>
														{form.values.pancard_image == '' && form.touched.pancard_image && form.errors.pancard_image ? <div className="text-danger">{form.errors.pancard_image}</div> : ''} 

													</div>
													{form.values.pancard_image && form.values.pancard_image.split(',') && form.values.pancard_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.pancard_image && form.values.pancard_image.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/pancard/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/pancard/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>

											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Aadhar Card</p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'aadhar_image', 'uploads/merchant/aadharcard')} />

															</label>
														</div>
														{form.values.aadhar_image == '' && form.touched.aadhar_image && form.errors.aadhar_image ? <div className="text-danger">{form.errors.aadhar_image}</div> : ''} 

													</div>
													{form.values.aadhar_image && form.values.aadhar_image.split(',') && form.values.aadhar_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.aadhar_image && form.values.aadhar_image.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/aadharcard/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/aadharcard/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'aadhar_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'aadhar_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
											
										</div>
										<div className="row">
										    <div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload One Year Latest Bank Statement (only pdf file)</p>
															<input type="file" multiple accept=".pdf" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'bank_statement', 'uploads/merchant/bankstatement')} />

															</label>
														</div>
														{form.values.bank_statement == '' && form.touched.bank_statement && form.errors.bank_statement ? <div className="text-danger">{form.errors.bank_statement}</div> : ''} 

													</div>
													{form.values.bank_statement && form.values.bank_statement.split(',') && form.values.bank_statement.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.bank_statement && form.values.bank_statement.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/bankstatement/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/bankstatement/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'bank_statement')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'bank_statement')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>

											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload latest 3 months salary slips</p>
															<input type="file" multiple  accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'salery_slip', 'uploads/merchant/salery_slip')} />

															</label>
														</div>
														{form.values.salery_slip == '' && form.touched.salery_slip && form.errors.salery_slip ? <div className="text-danger">{form.errors.salery_slip}</div> : ''} 

													</div>
													{form.values.salery_slip && form.values.salery_slip.split(',') && form.values.salery_slip.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
																{form.values.salery_slip && form.values.salery_slip.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/salery_slip/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/salery_slip/'+option} alt="" />
																				<Link to="" onClick={(e) => {removeImage(e,index,'salery_slip')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     <Link to="" onClick={(e) => {removeImage(e,index,'salery_slip')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link>
																		     <p>{option}</p>
																		   </>
																		}
																	</li>
																))}
														</ul>
													</>
													: ''}
											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Verify & Proceed" />
								</fieldset>
							</form>
						</div>

						<div className="col-md-12 col-lg-6">
							<img src="/assets/img/loan.png" alt="sds" className="righimg" />
						</div>

					</div>
				</div>
			</section>
		</>
	)
}
const LenderListForm = (props) => {

	const [errorMassege, setErrorMassege] = useState(0);	
	const submitForm = (event) => {
	        if(props.data.lenders.length>0) {
				setErrorMassege('')
				props.setData(props.data)
				props.next(props.data,true);
				props.setCurrentStep(props.currentStep + 1)
			} else {
				setErrorMassege('Please select at least one lender')
			}
	}
	useEffect(() => {
			GetLenderList()
	}, [])
	const lenderPushArray = (event) => {
		if(event.target.checked) {
			setErrorMassege('')
			props.data.lenders.push(event.target.value)
			props.setData(props.data)
		} else {
			var index = props.data.lenders.indexOf(event.target.value);
			if (index !== -1) {
				props.data.lenders.splice(index, 1);
			}
			props.setData(props.data)
			
		}
	}
	const [lenderList, setlenderList] = useState([]);
	const GetLenderList = () => {
		api.postApi('verifyLendersList', {city:props.data.info.loan_type==1?props.data.personal_info.residence_city:props.data.business_info.city,pincode:props.data.info.loan_type==1?props.data.personal_info.residence_pincode:props.data.business_info.pincode}, false, props.header).then(response => {
			if(response.status=='success') {
				setlenderList(response.lenderList);
			}
		}).catch(error => {
		});
	}

	return (
		<>
		<section className="newstep-form">
		{/* <form id="msform" onSubmit={form.handleSubmit}> */}
		<div className="container">		
			<div className="row d-flex justify-content-center flexwrap">			
				<div className="col-md-12">
					{lenderList.length > 0 && lenderList.map((co, index) => (		
						
						<div className="col-md-6"  key={index}>
							<div className="landerlist-loan">
									<div className="review-body">
										<div className="review-right nonemobile">
											<label className="control control--checkbox"> {co.company_name} 
												<input type="checkbox" id={co.user_id+"_lender_error"} value={co.user_id}  
onChange={(e) => lenderPushArray(e)} />
											<div className="control__indicator"></div>
											</label>
										</div>
									</div>
									<div className="review-table">
										<table>
											<thead>
												<tr>
													<th>Min-Max Rate Of Interest</th>
													<th>Min-max Loan Range</th>
													<th>Min-Max Tenure</th>
												</tr>
											</thead>
											<tbody>
												<tr>
												<td>{co.mini_rate_of_intrest}% - {co.max_rate_of_intrest}%</td>
												<td>{co.mini_loan_range}-{co.max_loan_range}</td>
												<td>{co.mini_tenure} Month - {co.max_tenure} Month</td>
												</tr>
											</tbody>
										</table>
									</div>
							</div>			
						</div>
					))}
						
						{errorMassege? <div className="text-danger" style={{textAlign:"end"}}>{errorMassege}</div> :''}

						<div className="col-md-12">
							<button type="button" id="lender_detail"  onClick={() => submitForm() } className="sb-btn">SUBMIT</button>
						</div>
				</div>
			</div>			
		</div>
		{/* </form> */}
  </section>
  </>
	)
}

const ThankYouForm = (props) => {

	return (
		<section className="newstep-form">
				<div className="container new-step-container">
					<div className="row form-newalign">
						<div className="col-md-12 col-lg-6">
							{/* <form id="msform" onSubmit={form.handleSubmit}> */}
								<fieldset className="ui-step-content" style={{ display: "block", textAlign: "center" }}>
									<div className="success-animation">
										<svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
									</div>
									<h1 className="mb-0">Thank you!</h1>
									<h6 className="mb-0">Your application has been successfully received. You may choose to note down the file number for further tracking of the case!</h6>&nbsp;
									<p><b>File ID:</b> : {props.formResponse && props.formResponse.file_id}</p>
									<p><b>Password:</b> {props.formResponse && props.formResponse.password}</p>
									{/* <input type="submit" name="submit" className="submit action-button apply-now-btn" value="Continue" /> */}
								</fieldset>
							{/* </form> */}
						</div>

						<div className="col-md-12 col-lg-6">
							<img src="/assets/img/loan.png" alt="sds" className="righimg" />
						</div>

					</div>
				</div>
		</section>
	)
}

export default UserForm