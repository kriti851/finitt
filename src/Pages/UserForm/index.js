import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../layout/Header'; //Include Heder
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment'
import Service from './../../service';
// import uuid from 'react-uuid';
import toast, { Toaster } from 'react-hot-toast';
import { toHaveFocus } from '@testing-library/jest-dom/dist/matchers';
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
			pancard_image : '',
			pancard_image_true : false,
			loan_type: 1,
			employee_type: 1,
			wrong_otp:false,
			
		},
		business_info: {
			email: '',
			email_true: false,
			first_name: '',
			first_name_true: false,
			last_name: '',
			last_name_true: false,
			gender: '',
			gender_true: false,
			date_of_birth: '',
			date_of_birth_true: false,
			company_name: '',
			company_name_true: false,
			legal_name: '',
			legal_name_true: false,
			state: '',
			state_true: false,
			city: '',
			city_true: false,
			houseno: '',
			houseno_true: false,
			pincode: '',
			pincode_true: false,
			business_type: '',
			business_type_true: false,
			type_of_nature: '',
			type_of_nature_true: false,
			vintage: '',
			vintage_true: false,
			turn_over: '',
			turn_over_true: false,
			desired_amount: '',
			desired_amount_true: false,
			required_amount: '',
			required_amount_true: false,
			co_application: [
			{ id:0,name: "",name_true:false, relationship: "",relationship_true:false, pan_number: "", pan_number_true:false,pancard_image: "",pancard_image_true:false }
			],
			co_application_true: "",
			pan_number: '',
			pan_number_true: false,
			pancard_image: '',
			pancard_image_true: false,
			gst_number: '',
			gst_number_true: false,
			gstproof_image: '',
			gstproof_image_true: false,
			business_address: '',
			business_address_true: false,
			business_address_proof: '',
			business_address_proof_true: false,
			bank_statement: '',
			bank_statement_true: false,
			itr_docs: '',
			itr_docs_true: false,
			loan_purpose : '',
			loan_purpose_true: false,
		},
		personal_info: {
				email: '',
				email_true: false,
				first_name: '',
				first_name_true: false,
				last_name: '',
				last_name_true:'',
				gender: '',
				gender_true: false,
				date_of_birth: '',
				date_of_birth_true: false,
				father_name: '',
				father_name_true: false,
				qualification: '',
				qualification_true: false,
				marital_status: '',
				marital_status_true: false,
				number_of_kids: 0,
				number_of_kids_true: 0,
				vehicle_type: '',
				vehicle_type_true: false,
				residence_building: '',
				residence_building_true: false,
				residence_area: '',
				residence_area_true: false,
				residence_state: '',
				residence_state_true: false,
				residence_city: '',
				residence_city_true: false,
				residence_pincode: '',
				residence_pincode_true: false,
				employer_name: '',
				employer_name_true: false,
				designation: '',
				designation_true: false,
				organization: '',
				organization_true: false,
				organization_type_true: false,
				total_experience: '',
				total_experience_true: false,
				required_amount: '',
				required_amount_true: false,
				company_building: '',
				company_building_true: false,
				company_area: '',
				company_area_true: false,
				company_state: '',
				company_state_true: false,
				company_city: '',
				company_city_true: false,
				company_pincode: '',
				company_pincode_true: false,
				company_website: '',
				company_website_true: false,
				company_email: '',
				company_email_true: false,
				salery_inhand: '',
				salery_inhand_true: false,
				salary_mode: '',
				salary_mode_true: false,
				bank_name: '',
				bank_name_true: false,
				pancard_image: '',
				pancard_image_true: false,
				aadhar_image: '',
				aadhar_image_true: false,
				bank_statement: '',
				bank_statement_true: false,
				salery_slip: '',
				salery_slip_true: false,
				loan_purpose : '',
				loan_purpose_true: false,
		}
	})
	useEffect(() => {
		if (name !== undefined) {
			getUserDetail()
		}
		GetStates()
	}, [])

	const getUserDetail = () => {
		api.postApi('user-exist', { name: name }).then(response => {
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
			api.postApi(newData.info.loan_type == 2 ? 'businessInfoForm' : 'personalInForm', { ...newData }, false, header).then(response => {
				setformResponse(response)
			}).catch(error => {
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
	const [uploadBr, setUploadBr] = 
	useState({'pancard_image':0})
	const [progress, setProgress] = useState(0)
	const [progressName, setProgressName] = useState('')
	useEffect(() => {
		setuploadBr()
	}, [progress])

	const setuploadBr = () => { 
		uploadBr[progressName] =progress
		setUploadBr(uploadBr)
	}
	const checkURL= (url) => {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}
	const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
	const [currentStep, setCurrentStep] = useState(0);
	const form = useFormik({
		initialValues: props.data.info,
		enableReinitialize: true,
		validationSchema: yup.object({
			mobile_number: currentStep == 1 ? yup.string().required('Please enter mobile number').min(10, 'Please enter valid mobile number')
				.max(10, 'Please enter valid mobile number.').matches(phoneRegExp, 'Please enter valid mobile number') : '',
			is_agree: currentStep == 1 ? yup.boolean().required('Please select terms and conditions').oneOf([true], 'Please select terms and conditions') : '',
			otp_verified: currentStep == 2 ? yup.string().required('Please enter OTP').min(6, 'Please enter valid OTP')
				.max(6, 'Please enter valid OTP.') : '',
			pancard_image: currentStep == 3 ? yup.string().required('Please upload pan card') : '',
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
					console.log(currentStep)
					api.postApi('verifyOtp', { mobile_number: values.mobile_number, otp: values.otp_verified },false,props.header).then(response => {
						if (response.status == 'success' && response.data) {
							props.header.Authorization = response.token
							props.setHeader(props.header, props.GetStates())
							
							if (response.exit==1) {
								
								form.setFieldValue('wrong_otp',false)
								let user = response.data.user;
								
								let user_detail = response.data.user_detail;
								let user_merchant_detail = response.data.user_merchant_detail;
								let co_applicants = response.data.co_applicants;
								if(co_applicants) {
									co_applicants.forEach(item => { 
										for (let val in item) item[val] = item[val] === null ? '' : item[val] 
									});
								}

								
								let full_name = user.full_name? user.full_name.split(' ') : []
								let first_name = full_name.length > 0 ? full_name[0] : '';
								let last_name = full_name.length > 1 ? full_name[1] : '';
									
									props.data.info = 
									{
										mobile_number:props.data.info.mobile_number,
										is_agree: props.data.info.is_agree,
										otp_verified: props.data.info.otp_verified,
										pan_number: user && user.pan_number?user.pan_number:'',
										loan_type: user &&  user.loan_type=='Personal'?1:2,
										employee_type: 1,
										wrong_otp:false,
										pancard_image : user_detail && user_detail.pancard_image?user_detail.pancard_image: user_merchant_detail && user_merchant_detail.pancard_image? user_merchant_detail.pancard_image:'',
										pancard_image_true : user_detail && user_detail.pancard_image?true: user_merchant_detail && user_merchant_detail.pancard_image? true:false,
									
									}

									
									if(user_detail) {
										props.data.personal_info = 
										{
											first_name: first_name,
											first_name_true: first_name?true:false,
											last_name: last_name,
											last_name_true: last_name?true:false,
											email: user.email?user.email:'',
											email_true: user.email?true:false,
											gender:user_detail.gender?user_detail.gender:'',
											gender_true:user_detail.gender?true:false,
											date_of_birth: user_detail.date_of_birth?user_detail.date_of_birth:'',
											date_of_birth_true: user_detail.date_of_birth?true:false,
											father_name: user_detail.father_name?user_detail.father_name:'',
											father_name_true: user_detail.father_name?true:false,
											qualification: user_detail.qualification?user_detail.qualification:'',
											qualification_true: user_detail.qualification?true:false,
											marital_status: user_detail.marital_status?user_detail.marital_status:'',
											marital_status_true: user_detail.marital_status?true:false,
											number_of_kids: user_detail.number_of_kids?user_detail.number_of_kids:'',
											number_of_kids_true: user_detail.number_of_kids?true:false,
											vehicle_type: user_detail.vehicle_type?user_detail.vehicle_type:'',
											vehicle_type_true: user_detail.vehicle_type?true:false,
											residence_building: user_detail.residence_building?user_detail.residence_building:'',
											residence_building_true: user_detail.residence_building?true:false,
											residence_area: user_detail.residence_area?user_detail.residence_area:'',
											residence_area_true: user_detail.residence_area?true:false,
											residence_state:user_detail.residence_state?user_detail.residence_state:'',
											residence_state_true:user_detail.residence_state?true:false,
											residence_city: user_detail.residence_city?user_detail.residence_city:'',
											residence_city_true: user_detail.residence_city?true:false,
											residence_pincode:user_detail.residence_pincode?user_detail.residence_pincode:'',
											residence_pincode_true:user_detail.residence_pincode?true:false,
											employer_name: user_detail.employer_name?user_detail.employer_name:'',
											employer_name_true: user_detail.employer_name?true:false,
											designation:user_detail.designation?user_detail.designation:'',
											designation_true:user_detail.designation?true:false,
											organization:user_detail.organization?user_detail.organization:'',
											organization_true:user_detail.organization?true:false,
											organization_type: user_detail.organization_type?user_detail.organization_type:'',
											organization_type_true: user_detail.organization_type?true:false,
											total_experience:user_detail.total_experience?user_detail.total_experience:'',
											total_experience_true:user_detail.total_experience?true:false,
											required_amount: user_detail.required_amount?user_detail.required_amount:'',
											required_amount_true: user_detail.required_amount?true:false,
											company_building: user_detail.company_building?user_detail.company_building:'',
											company_building_true: user_detail.company_building?true:false,
											company_area: user_detail.company_area?user_detail.company_area:'',
											company_area_true: user_detail.company_area?true:false,
											company_state: user_detail.company_state?user_detail.company_state:'',
											company_state_true: user_detail.company_state?true:false,
											company_city: user_detail.company_city?user_detail.company_city:'',
											company_city_true: user_detail.company_city?true:false,
											company_pincode: user_detail.company_pincode?user_detail.company_pincode:'',
											company_pincode_true: user_detail.company_pincode?true:false,
											company_website: user_detail.company_website?user_detail.company_website:'',
											company_website_true: user_detail.company_website?true:false,
											company_email: user_detail.company_email?user_detail.company_email:'',
											company_email_true: user_detail.company_email?true:false,
											salery_inhand: user_detail.salery_inhand?user_detail.salery_inhand:'',
											salery_inhand_true: user_detail.salery_inhand?true:false,
											salary_mode: user_detail.salary_mode?user_detail.salary_mode:'',
											salary_mode_true: user_detail.salary_mode?true:false,
											bank_name: user_detail.bank?user_detail.bank:'',
											bank_name_true: user_detail.bank?true:false,
											pancard_image: user_detail.pancard_image?user_detail.pancard_image:'',
											pancard_image_true: user_detail.pancard_image?true:false,
											aadhar_image:user_detail.aadhar_image?user_detail.aadhar_image:'',
											aadhar_image_true:user_detail.aadhar_image?true:false,
											bank_statement: user_detail.bank_statement?user_detail.bank_statement:'',
											bank_statement_true: user_detail.bank_statement?true:false,
											salery_slip: user_detail.salery_slip?user_detail.salery_slip:'',
											salery_slip_true: user_detail.salery_slip?true:false,
											loan_purpose :user_detail.loan_purpose?user_detail.loan_purpose:'',
											loan_purpose_true :user_detail.loan_purpose?true:false,
										}
									}
									if(user_merchant_detail) {
										props.data.business_info =  
										{
											email: user.email?user.email:'',
											email_true: user.email?true:false,
											first_name: first_name,
											first_name_true: first_name?true:false,
											last_name: last_name,
											last_name_true: last_name?true:false,
											gender:user_detail.gender?user_detail.gender:'',
											gender_true:user_detail.gender?true:false,
											date_of_birth: user_merchant_detail.date_of_birth?user_merchant_detail.date_of_birth:'',
											date_of_birth_true: user_merchant_detail.date_of_birth?true:false,
											company_name: user.company_name?user.company_name:'',
											company_name_true: user.company_name?true:false,
											legal_name: user.legal_name?user.legal_name:'', 
											legal_name_true: user.legal_name?true:false,
											state: user_merchant_detail.state?user_merchant_detail.state:'',
											state_true: user_merchant_detail.state?true:false,
											city:  user_merchant_detail.city?user_merchant_detail.city:'',
											city_true:  user_merchant_detail.city?true:false,
											houseno:  user_merchant_detail.houseno?user_merchant_detail.houseno:'',
											houseno_true:  user_merchant_detail.houseno?true:false,
											pincode:  user_merchant_detail.pincode?user_merchant_detail.pincode:'',
											pincode_true:  user_merchant_detail.pincode?true:false,
											business_type: user_merchant_detail.business_type?user_merchant_detail.business_type:'',
											business_type_true: user_merchant_detail.business_type?true:false,
											type_of_nature: user_merchant_detail.nature_of_business?user_merchant_detail.nature_of_business:'',
											type_of_nature_true: user_merchant_detail.nature_of_business?true:false,
											vintage:  user_merchant_detail.vintage?user_merchant_detail.vintage:'',
											vintage_true:  user_merchant_detail.vintage?true:false,
											turn_over:  user_merchant_detail.turn_over?user_merchant_detail.turn_over:'',
											turn_over_true:  user_merchant_detail.turn_over?true:false,
											desired_amount: user_merchant_detail.desired_amount?user_merchant_detail.desired_amount:'',
											desired_amount_true: user_merchant_detail.desired_amount?true:false,
											required_amount:  user_detail.required_amount?user_detail.required_amount:'',
											required_amount_true:  user_detail.required_amount?true:false,
											co_application: co_applicants && co_applicants.length ? co_applicants.map(item=> ({...item, name_true:item.name?true:false,relationship_true:item.relationship?true:false, pan_number_true:item.pan_number?true:false,pancard_image_true:item.pancard_image?true:false})) : [
												{ id:0,name: "",name_true:false, relationship: "",relationship_true:false, pan_number: "", pan_number_true:false,pancard_image: "",pancard_image_true:false }

											],
											co_application_true:  co_applicants && co_applicants.length?true:false,
											pan_number:  user_merchant_detail.pan_number?user_merchant_detail.pan_number:'',
											pan_number_true:  user_merchant_detail.pan_number?true:false,
											pancard_image:  user_merchant_detail.pancard_image?user_merchant_detail.pancard_image:'',
											pancard_image_true:  user_merchant_detail.pancard_image?true:false,
											gst_number:  user_merchant_detail.gst_number?user_merchant_detail.gst_number:'',
											gst_number_true:  user_merchant_detail.gst_number?true:false,
											gstproof_image:  user_merchant_detail.gstproof_image?user_merchant_detail.gstproof_image:'',
											gstproof_image_true:  user_merchant_detail.gstproof_image?true:false,
											business_address:  user_merchant_detail.business_address?user_merchant_detail.business_address:'',
											business_address_true:  user_merchant_detail.business_address?true:false,
											business_address_proof: user_merchant_detail.business_address_proof?user_merchant_detail.business_address_proof:'',
											business_address_proof_true: user_merchant_detail.business_address_proof?true:false,
											bank_statement: user_detail.bank_statement?user_detail.bank_statement:'',
											bank_statement_true: user_detail.bank_statement?true:false,
											itr_docs:  user_detail.itr_docs?user_detail.itr_docs:'',
											itr_docs_true:  user_detail.itr_docs?true:false,
											loan_purpose : user_merchant_detail.loan_purpose?user_merchant_detail.loan_purpose:'',
											loan_purpose_true : user_merchant_detail.loan_purpose?true:false,
										}
									}

									props.setData(props.data)
									user_detail.pan_number?setCurrentStep(3):setCurrentStep(3)
									
							} else {
								setCurrentStep(currentStep + 1)
								form.setFieldValue('wrong_otp',false)
							}							
						}
						else {
							form.setFieldValue('wrong_otp',true)
						}
					}).catch(error => {

					});
				} else if (currentStep == 3) {
					setCurrentStep(currentStep + 1)
				} else if (currentStep == 4) {
					setCurrentStep(currentStep + 1)
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
	const [validId, setValidID] = useState('');

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
			setValidID('')
			api.postApi('check-user-status', values,false, props.header).then(response => {
				if(response.status=='success') {
					setsUserResponse(response)
					setValidID('')
				} else {
					setValidID('Please enter valid ID and password')
				}

			}).catch(error => {

			});
		}
	})

	const acceptedFiles = (e, path, s3_path,co_index=0) => {
		if(e.target.files.length) {
			var formData;
				formData = new FormData();
				for (let i = 0; i < e.target.files.length; i++) {
					formData.append('image', e.target.files[i])
				}
				formData.append('folder', s3_path)
				setProgressName(path)
				uploadBr[path] =0;
				setUploadBr(uploadBr)
				api.postApi('pan-verify',  formData, true, props.header,setProgress).then(response => {
					if (response.status == 'success') {
						form.setFieldValue(path,response.data.pancard_image)
						form.setFieldValue(path+'_true',true);
						let full_name = response.data.full_name? response.data.full_name.split(' ') : []
						let first_name = full_name.length > 0 ? full_name[0] : '';
						let last_name = full_name.length > 1 ? full_name[1] : '';
						props.data.personal_info = 
						{
							...props.data.personal_info,
							first_name: first_name,
							first_name_true: first_name?true:false,
							last_name: last_name,
							last_name_true: last_name?true:false,
							date_of_birth: response.data.date_of_birth?response.data.date_of_birth:'',
							date_of_birth_true: response.data.date_of_birth?true:false,
							father_name: response.data.father_name?response.data.father_name:'',
							father_name_true: response.data.father_name?true:false,
						}
						props.data.business_info =  
						{
							...props.data.business_info,
							first_name: first_name,
							first_name_true: first_name?true:false,
							last_name: last_name,
							last_name_true: last_name?true:false,
							date_of_birth: response.data.date_of_birth?response.data.date_of_birth:'',
							date_of_birth_true: response.data.date_of_birth?true:false,
							pan_number:   response.data.pan_number?response.data.pan_number:'',
							pan_number_true: response.data.pan_number?true:false,
							pancard_image:  response.data.pancard_image?response.data.pancard_image:'',
							pancard_image_true: response.data.pancard_image?true:false,
						}

						props.setData(props.data)
						console.log(props.data)
						toast.success('Pancard is verified')
					} else {
						toast.error('Pancard is not verified')
					}
					e.target.value=''
				}).catch(error => {

				});
		}
	}
	const removeImage = (e,index,path,co_index=0) => {
		e.preventDefault()
		var array;
		array = form.values[path].split(',')
		array.splice(index, 1)
		if(array==''){
			form.setFieldValue(path+'_true',false);
		}
		form.setFieldValue(path, array.join(','));
	}
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
						{validId? 
						<div className="text-danger" style={{textAlign: "center"}}>{validId}</div>
						:''}				
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
														<input className="styled-checkbox doublecheck" id="styled-checkbox-2" type="checkbox" checked={form.values.is_agree == true} onChange={(e) => form.setFieldValue('is_agree', e.target.checked)} />
														<label htmlFor="styled-checkbox-2">Please agree with the
															<Link to=""> &nbsp;Terms & Conditions </Link> &nbsp;and&nbsp;<Link to=""> Privacy Policy </Link>
														</label>
														{form.touched.is_agree && !form.errors.mobile_number && form.errors.is_agree ? <div className="text-danger">{form.errors.is_agree}</div> : ''}
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
												{form.values.wrong_otp==false  && form.touched.otp_verified && form.errors.otp_verified ? <div className="text-danger">{form.errors.otp_verified}</div> : ''}
												{form.values.wrong_otp?
                                                  <div className="text-danger">
                                                       Please enter valid OTP.
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
									<h1>Verify Pancard</h1>
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
								            {/* <div className="col-12 col-md-5">
												<label>First Name</label>
												<input type="text" name="first_name" {...form.getFieldProps("first_name")}  className="" placeholder="Enter first name" />
											
												{form.touched.first_name && Object.keys(form.errors)[0]=='first_name' && form.errors.first_name ? <div className="text-danger">{form.errors.first_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Last Name</label>
												<input type="text" name="last_name" {...form.getFieldProps("last_name")} className="" placeholder="Enter last name" />
												
												{form.touched.last_name && Object.keys(form.errors)[0]=='last_name' && form.errors.last_name ? <div className="text-danger">{form.errors.last_name}</div> : ''}
											</div>

											<div className="col-12 col-md-5"> 
												<label>Date of birth</label>
												
												<input type="date" max="1999-12-31" {...form.getFieldProps("date_of_birth")}  name="date_of_birth" className="" placeholder="Enter Date of birth" />
	                                         
												{form.touched.date_of_birth && Object.keys(form.errors)[0]=='date_of_birth' && form.errors.date_of_birth ? <div className="text-danger">{form.errors.date_of_birth}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-8"> 
												<label>Pan Card Number</label>
												<input type="text" className="mb-0" placeholder="Enter pan card number"  onChange={(e) => updateNumber(e.target.value,'pan_number',10) } value={form.values.pan_number} />
												{form.touched.pan_number && Object.keys(form.errors)[0]=='pan_number' && form.errors.pan_number ? <div className="text-danger">{form.errors.pan_number}</div> : ''}

											</div> */}
{/* 
<div className="col-xs-12 col-md-10 mb-3">
												<label>Firm Pan Number </label>
												<input type="text" name="pan_number"  onChange={(e) => updateRecord(e,'pan_number')} onBlur={(e) => updateAndSaveRecord(e,'pan_number')} value={form.values.pan_number} className="mb-0" placeholder="Enter Number" />
												{form.values.pan_number_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.pan_number && form.errors.pan_number ? <div className="text-danger">{form.errors.pan_number}</div> : ''}

											</div> */}
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">

													    {form.values.pancard_image_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Pan Card <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span>  <small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'pancard_image', 'uploads/merchant/pancard')}  />
															</label>
														</div>
														{form.values.pancard_image == '' && form.touched.pancard_image && Object.keys(form.errors)[0]=='pancard_image' && form.errors.pancard_image ? <div className="text-danger">{form.errors.pancard_image}</div> : ''} 

													</div>
													{form.values.pancard_image && form.values.pancard_image.split(',') && form.values.pancard_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['pancard_image'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['pancard_image']+'%'}}><span>{uploadBr['pancard_image']}%</span></div>
															</div>
															 :''} 
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
										{/* </div> */}
											{/* <div className="col-xs-12 col-md-5">
								    <label>Date of birth</label>
								    <input type="date" className="" placeholder="DOB as per PAN"/>
								</div> */}

										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn mt-5 ml-00" value="Continue" />
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
										<div className="col-md-12 p-0">
										<div className="col-md-5 p-0">
										<input id="checkbox-1"  className="styled-checkbox" name="employee_type" type="checkbox" value="1" onChange={(e) => form.setFieldValue('employee_type', e.target.value)} checked={form.values.employee_type == 1} />
										<label htmlFor="checkbox-1" className="checkbox-label">&nbsp; Salaried &nbsp;</label>
										</div>
										{/* </div> */}
										{/* <div className="checkbox"> */}
										<div className="col-md-5 p-0">
										<input id="checkbox-2" className="styled-checkbox"  name="employee_type" type="checkbox" value="2" onChange={(e) => form.setFieldValue('employee_type', e.target.value)} checked={form.values.employee_type == 2} />
										<label htmlFor="checkbox-2" className="checkbox-label"> Self Employed</label>
										</div>
										</div>
									</div>
									<div className="checkbox" style={{ marginBottom: "10px" }}>
										<p className="mb-33"><b>Loan Type</b></p>
										{/* <div className="checkbox"> */}
										<div className="col-md-12 p-0">
										<div className="col-md-5 p-0">
										<input id="checkbox-3" className="styled-checkbox"  name="loan_type" type="checkbox" value="1" onChange={(e) => form.setFieldValue('loan_type', e.target.value)} checked={form.values.loan_type == 1} />
										<label htmlFor="checkbox-3" className="checkbox-label">&nbsp; Personal &nbsp;</label>
										</div>
										<div className="col-md-5 p-0">
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
	const [uploadBr, setUploadBr] = 
	useState({'pancard_image':0,'gstproof_image':0,'business_address_proof':0,'bank_statement':0,'itr_docs':0})
	const [progress, setProgress] = useState(0)
	const [progressName, setProgressName] = useState('')

	useEffect(() => {
		setuploadBr()
	}, [progress])

	// useEffect(() => {
	// 	updatePanNumber()
	// }, [])

	// const updatePanNumber = () => {
	// 	api.postApi('updateSingleKey-businessForm', { key: 'pan_number', value: props.data.info.pan_number}, false, props.header).then(response => {
							
	// 	}).catch(error => {
	// 	});
	// }
	const setuploadBr = () => { 
		uploadBr[progressName] =progress
		setUploadBr(uploadBr)
	}

	const [cities, setCities] = useState([]);
	const [pincode, setPincode] = useState([]);
	const [pincodeOnload, setPincodeOnload] = useState(false);
	useEffect(() => {
		if (props.data.business_info.state) {
			GetCities(props.data.business_info.state,true)
		}
	}, [])
	useEffect(() => {
		if (pincodeOnload) {
			GetPincode(props.data.business_info.city)
		}
	}, [pincodeOnload])
	const [currentStep, setCurrentStep] = useState(0);
	const form = useFormik({
		initialValues: props.data.business_info,
		enableReinitialize: true,
		validationSchema: yup.object({
			
			// first_name: currentStep == 0 ? yup.string().required('Please enter your name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			// last_name: currentStep == 0 ? yup.string().required('Please enter your surname').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			email: currentStep == 0 ? yup.string().email('Please enter valid email address').required('Please enter email address') : '',
			// date_of_birth: currentStep == 0 ? yup.string().required('Please enter dob') : '',
			gender: currentStep == 0 ? yup.string().required('Please select gender') : '',
			
			company_name: currentStep == 0 ? yup.string().required('Please enter business name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			legal_name: currentStep == 0 ? yup.string().required('Please enter legal name of your business').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			state: currentStep == 0 ? yup.string().required('Please select state') : '',
			city: currentStep == 0 ? yup.string().required('Please select city') : '',
			houseno: currentStep == 0 ? yup.string().required('Please enter building name/flat no') : '',
			pincode: currentStep == 0 ? yup.string().required('Please select pincode') : '',
			business_type: currentStep == 0 ? yup.string().required('Please select business type') : '',
			type_of_nature: currentStep == 0 ? yup.string().required('Please select nature of your business') : '',
			vintage: currentStep == 0 ? yup.number().typeError('you must specify a number').required('Please enter no of years in business') : '',
			turn_over: currentStep == 0 ? yup.string().required('Please select business turn over') : '',
			desired_amount: currentStep == 0 ? yup.string().required('Please select desired loan amount') : '',
			required_amount: currentStep == 0 ? yup.number().typeError('you must specify a number').required('please enter required amount') : '',
			loan_purpose: currentStep == 0 ? yup.string().required('Please select loan purpose') : '',
			co_application: currentStep == 1 ? yup.array().of(
				yup.object({
					name: yup.string().required("Please enter co-applicant name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
					relationship: yup.string().required("Please enter co-applicant relationship").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
					pan_number: yup.string().required("Please enter co-applicant pan card number"),
					pancard_image: yup.string().required("Please upload co-applicant pan card"),
					
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
				setProgressName(path)
				uploadBr[path] =0;
				setUploadBr(uploadBr)
				api.uploadPostApi('multipleImageUpload', formData, true, props.header,setProgress).then(response => {
					if(path=='co_application') {
						let fileNew = form.values.co_application[co_index].pancard_image ?form.values.co_application[co_index].pancard_image +','+response.fileName  :response.fileName;
						form.setFieldValue(`co_application.${co_index}.pancard_image`, fileNew);
						let id = form.values['co_application'][co_index].id;
						api.postApi('add-update-co_applicant', { id:id,key: 'pancard_image', value: fileNew}, false, props.header).then(co_response => {
							if(id==0) {
							  form.setFieldValue(`co_application.${co_index}.id`,co_response.data.id);
							}
							form.setFieldValue(`co_application.${co_index}.pancard_image_true`,true);
							toast.success('Pancard is verified')
						}).catch(error => {
						});

					} else {
						form.setFieldValue(path, form.values[path]?form.values[path] +','+response.fileName : response.fileName).then(res => {
							if(res[path]==undefined) {
								api.postApi('updateSingleKey-businessForm', { key: path, value: form.values[path]?form.values[path] +','+response.fileName : response.fileName}, false, props.header).then(response => {
									form.setFieldValue(path+'_true',true);
									if(path=='pancard_image') {
										toast.success('Pancard is verified')
									 }
								}).catch(error => {
	
								});
							}
						});
						if(path!='pancard_image') {
							toast.success('Upload Successful')
						  }
					}
					
					e.target.value = '';
				}).catch(error => {

				});
		}
	}
	const removeImage = (e,index,path,co_index=0) => {
		e.preventDefault()
		var array;
		if(path=='co_application') {
		    array =form.values.co_application[co_index].pancard_image.split(',')
			array.splice(index, 1)
			if(array==''){
				form.setFieldValue(`co_application.${co_index}.pancard_image_true`,false);
			}
			form.setFieldValue(`co_application.${co_index}.pancard_image`, array.join(','));
		} else {
		    array = form.values[path].split(',')
			array.splice(index, 1)
			if(array==''){
				form.setFieldValue(path+'_true',false);
			}
			form.setFieldValue(path, array.join(','));
		}		
	}
	const GetCities = (state_name,send=false) => {
		if(state_name) {
			var state = props.allStates.find(state => state.name == state_name);
			api.postApi('cityList', { state_id: state.id }, false, props.header).then(response => {
				// form.setFieldValue('state', state_name)
				setCities(response.cities);
				setPincodeOnload(send)
			}).catch(error => {
			});
		} else {
			setCities([])
			setPincode([])
			form.setFieldValue('pincode', '')
			form.setFieldValue('pincode_true',false)
			form.setFieldValue('city', '')
			form.setFieldValue('city_true',false)
		}

	}
	const GetPincode = (city_name) => {
		if(city_name) {
			var city = cities.find(city => city.name == city_name);
			var state = props.allStates.find(state => state.name == form.values.state);
			if(city && state) {
				api.postApi('pincodeList', { city: city.name, state_id: state.id.toString()}, false, props.header).then(response => {
					// form.setFieldValue('city', city.name)
					setPincode(response.pincode);
				}).catch(error => {
				});
			}
		} else {
			form.setFieldValue('pincode', '')
			form.setFieldValue('pincode_true',false)
			setPincode([])
		}
	}
	const checkURL= (url) => {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}
	const  capitalName = (text) => {
		text = text.toLowerCase();
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
 
	const updateRecord = (e,path) => {
		if(e.target.value) {
			form.setFieldValue(path+'_true',false);
			form.setFieldValue(path,e.target.value)
		} else {
			form.setFieldValue(path+'_true',false);
			form.setFieldValue(path,e.target.value);
		}
		
	}

	const updateAndSaveRecord = (e,path,table_name='',) => {
		if(e.target.value || e.target.type=='file') {
			form.setFieldValue(path+'_true',false);
			if(e.target.type=='file') {
				form.validateForm().then((res) => {
					if(res[path]==undefined) {
							form.setFieldValue(path+'_true',true);
					}
				})
			} else {
				form.setFieldValue(path,e.target.value).then((res) => {
					if(res[path]==undefined) {
						let value = path=='first_name' || path=='last_name'? form.values.first_name+' '+form.values.last_name : e.target.value;
						let key = path=='first_name' || path=='last_name'? 'full_name' : path;
						api.postApi('updateSingleKey-businessForm', { key: key, value: value}, false, props.header).then(response => {
							
							form.setFieldValue(path+'_true',true);
						}).catch(error => {
						});
						
					}
				});
			}
		} else {
			if(e.target.type=='file'){
			} else {
				form.setFieldValue(path,e.target.value);
			}
			form.setFieldValue(path+'_true',false);
			
		}
	}


	const updateCoAppRecord = (e,path,index,real_path) => {
		if(e.target.value) {
			form.setFieldValue(real_path,e.target.value)
			form.setFieldValue(real_path+'_true',false);
		} else {
			form.setFieldValue(real_path,e.target.value)
			form.setFieldValue(real_path+'_true',false);
		}
		
	}

	const updateCoAppAndSaveRecord = (e,path,index) => {
		if(e.target.value || e.target.type=='file') {
			form.setFieldValue(path+'_true',false);
			if(e.target.type=='file') {
				form.setFieldValue(`co_application.${index}.pancard_image_true`,true);
			} else {
				form.setFieldValue(`co_application.${index}.${path}`,e.target.value).then((res) => {
					let id = form.values['co_application'][index].id;
						api.postApi('add-update-co_applicant', { id:id,key: path, value: e.target.value}, false, props.header).then(response => {
							if(id==0) {
						    	form.setFieldValue(`co_application.${index}.id`,response.data.id);
							}
							form.setFieldValue(`co_application.${index}.${path}_true`,true);
						}).catch(error => {
						});
				});
			}
		} else {
			if(e.target.type=='file'){
			} else {
				form.setFieldValue(path,e.target.value);
			}
			form.setFieldValue(path+'_true',false);
			
		}
	}
    
	const addCoApplication = () => {
		form.values.co_application.push({ id:0, name: "", pan_number: "", pancard_image: "", relationship: "" })
		form.validateForm()

	}

	const removeCoApplication = (index) => {
		if(form.values.co_application.length) {
			let lastElementIndex = index
			const lastElement = form.values.co_application[index];
			if(lastElement.id) {
				api.postApi('delete-co_applicants', { co_applicant_id: lastElement.id.toString()}, false, props.header).then(response => {
					form.values.co_application.splice(lastElementIndex, 1)
					form.validateForm()
					toast.success('Remove Successful')
				}).catch(error => {

				});
			} else {
				form.values.co_application.splice(lastElementIndex, 1)
				form.validateForm()
				toast.success('Remove Successful')
			}
		}
		
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
												<input type="text" name="first_name" readOnly className="" placeholder="Enter first name" value={form.values.first_name}/>
												{form.values.first_name_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.first_name && Object.keys(form.errors)[0]=='first_name' && form.errors.first_name ? <div className="text-danger">{form.errors.first_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Last Name</label>
												<input type="text" readOnly name="last_name" value={form.values.last_name} className="" placeholder="Enter last name" />
												{form.values.last_name_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.last_name && Object.keys(form.errors)[0]=='last_name' && form.errors.last_name ? <div className="text-danger">{form.errors.last_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Email Address</label>
												<input type="text" name="email" onChange={(e) => updateRecord(e,'email')} onBlur={(e) => updateAndSaveRecord(e,'email')} value={form.values.email} className="" placeholder="Enter email" />
												{form.values.email_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.email && Object.keys(form.errors)[0]=='email'   && form.errors.email ? <div className="text-danger">{form.errors.email}</div> : ''}
											</div>
 
											<div className="col-12 col-md-5"> 
												<label>Date of birth</label>
												
												<input type="date" readOnly max="1999-12-31" name="date_of_birth"  value={form.values.date_of_birth} className="" placeholder="Enter Date of birth" />
	                                            {form.values.date_of_birth_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.date_of_birth && Object.keys(form.errors)[0]=='date_of_birth' && form.errors.date_of_birth ? <div className="text-danger">{form.errors.date_of_birth}</div> : ''}
											</div>
										    <div className="col-xs-12 col-md-10">
												<label>Gender</label>
												<select name="gender"  onChange={(e) => updateRecord(e,'gender')} onBlur={(e) => updateAndSaveRecord(e,'gender')} value={form.values.gender} >
													<option value="">Select One</option>
													<option value="Male" >Male</option>
													<option value="Female">Female</option>
													<option value="Other">Other</option>
													<option value="Prefer not to disclose">Prefer not to disclose</option>
												</select>
												{form.values.gender_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.gender && Object.keys(form.errors)[0]=='gender' && form.errors.gender ? <div className="text-danger">{form.errors.gender}</div> : ''}
											</div>
											<div className="col-12 col-md-10">
												<label>Business Name</label>
												<input type="text" name="company_name" onChange={(e) => updateRecord(e,'company_name')}  onBlur={(e) => updateAndSaveRecord(e,'company_name')}  value={form.values.company_name} className="" placeholder="Enter name" />
												{form.values.company_name_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_name && Object.keys(form.errors)[0]=='company_name'  && form.errors.company_name ? <div className="text-danger">{form.errors.company_name}</div> : ''}
											</div>
											<div className="col-12 col-md-10">
												<label>Legal Name</label>
												<input type="text" name="legal_name" onChange={(e) => updateRecord(e,'legal_name')} onBlur={(e) => updateAndSaveRecord(e,'legal_name')} value={form.values.legal_name} className="" placeholder="Enter name" />
												{form.values.legal_name_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.legal_name && Object.keys(form.errors)[0]=='legal_name' && form.errors.legal_name ? <div className="text-danger">{form.errors.legal_name}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label> 
												<select name="state" onChange={(e) => updateRecord(e,'state',GetCities(e.target.value))} onBlur={(e) => updateAndSaveRecord(e,'state')} value={form.values.state}  >
													<option value="">Select One</option>
													{props.allStates && props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.name} key={index}>{option.name}</option>
													))}
												</select>
												{form.values.state_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.state  && Object.keys(form.errors)[0]=='state' && form.errors.state ? <div className="text-danger">{form.errors.state}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="city" onChange={(e) => updateRecord(e,'city',GetPincode(e.target.value)) } onBlur={(e) => updateAndSaveRecord(e,'city')} value={form.values.city}  >
													<option value="">Select One</option>
													{cities.length > 0 && cities.map((option, index) => (
														<option value={option.name} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.values.city_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.city  && Object.keys(form.errors)[0]=='city' && form.errors.city ? <div className="text-danger">{form.errors.city}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Flat/Building/Street No.</label>
												<input type="text" name="houseno" onChange={(e) => updateRecord(e,'houseno')} onBlur={(e) => updateAndSaveRecord(e,'houseno')} value={form.values.houseno} className="" placeholder="Enter House No." />
												{form.values.houseno_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.houseno && Object.keys(form.errors)[0]=='houseno' && form.errors.houseno ? <div className="text-danger">{form.errors.houseno}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pin Code</label>
												<select name="pincode" onChange={(e) => updateRecord(e,'pincode')} onBlur={(e) => updateAndSaveRecord(e,'pincode')} value={form.values.pincode}  >
													<option value="">Select One</option>
													{pincode.length > 0 && pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.values.pincode_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.pincode && Object.keys(form.errors)[0]=='pincode' && form.errors.pincode ? <div className="text-danger">{form.errors.pincode}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Type of Firm</label>
												<select name="business_type" onChange={(e) => updateRecord(e,'business_type')} onBlur={(e) => updateAndSaveRecord(e,'business_type')}  value={form.values.business_type} >
													<option value="">Select One</option>
													<option value="Individual">Individual</option>
													<option value="Proprietorship">Proprietorship</option>
													<option value="Partnership">Partnership</option>
													<option value="PVT .ltd">PVT .ltd</option>
												</select>
												{form.values.business_type_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.business_type && Object.keys(form.errors)[0]=='business_type' && form.errors.business_type ? <div className="text-danger">{form.errors.business_type}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Nature of Business</label>
												<select name="type_of_nature"  value={form.values.type_of_nature}  onChange={(e) => updateRecord(e,'type_of_nature')} onBlur={(e) => updateAndSaveRecord(e,'type_of_nature')} >
													<option value="">Select One</option>
													<option value="Retail">Retail</option>
													<option value="Manufacturing">Manufacturing</option>
													<option value="Service">Service</option>
													<option value="Wholesale" >Wholesale</option>
												</select>
												{form.values.type_of_nature_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.type_of_nature && Object.keys(form.errors)[0]=='type_of_nature'  && form.errors.type_of_nature ? <div className="text-danger">{form.errors.type_of_nature}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>No. of years in Business</label>
												<input type="number" min="0" name="vintage" value={form.values.vintage}  onChange={(e) => updateRecord(e,'vintage')} onBlur={(e) => updateAndSaveRecord(e,'vintage')} className="" placeholder="Enter year" />
												{form.values.vintage_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.vintage && Object.keys(form.errors)[0]=='vintage' && form.errors.vintage ? <div className="text-danger">{form.errors.vintage}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Monthly Turnover</label>
												<select name="turn_over"   value={form.values.turn_over}  onChange={(e) => updateRecord(e,'turn_over')} onBlur={(e) => updateAndSaveRecord(e,'turn_over')} >
													<option value="">Select One</option>
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
												{form.values.turn_over_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.turn_over && Object.keys(form.errors)[0]=='turn_over' && form.errors.turn_over ? <div className="text-danger">{form.errors.turn_over}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Desired Loan Amount</label>
												<select name="desired_amount"  value={form.values.desired_amount} onChange={(e) => updateRecord(e,'desired_amount')} onBlur={(e) => updateAndSaveRecord(e,'desired_amount')}>
													<option value="">Select One</option>
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
												{form.values.desired_amount_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.desired_amount && Object.keys(form.errors)[0]=='desired_amount' && form.errors.desired_amount ? <div className="text-danger">{form.errors.desired_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Required Amount</label>
												<input type="text" name="required_amount" value={form.values.required_amount} onChange={(e) => updateRecord(e,'required_amount')} onBlur={(e) => updateAndSaveRecord(e,'required_amount')} className="" placeholder="Enter amount" />
												{form.values.required_amount_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.required_amount && Object.keys(form.errors)[0]=='required_amount' && form.errors.required_amount ? <div className="text-danger">{form.errors.required_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-10">
												    <label>Loan purpose </label>
												    <select name="loan_purpose" value={form.values.loan_purpose}  onChange={(e) => updateRecord(e,'loan_purpose')}  onBlur={(e) => updateAndSaveRecord(e,'loan_purpose')}  >
														<option value="">Select One</option>
														<option value="90000111" >Business Funding</option>
														<option value="90133283">Business working capital</option>
														<option value="1367">Education</option>
														<option value="90133283">Loan against gold</option>
														<option value="90133589">Loan against property</option>
														<option value="1371">Medical</option>
														<option value="90156975">Top up Loan</option>
														<option value="1373">Wedding</option>
													</select>
													{form.values.loan_purpose_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
													{form.touched.loan_purpose && Object.keys(form.errors)[0]=='loan_purpose' && form.errors.loan_purpose ? <div className="text-danger">{form.errors.loan_purpose}</div> : ''}

											</div>
										</div>
									</div>
									<input type="submit" name="next" className="next action-button apply-now-btn ml-00" value="Continue" />
								</fieldset>
								<fieldset className="ui-step-content" style={currentStep == 1 ? { display: "block" } : { display: "none" }}>
									<button type="button" name="previous" className="previous action-button-previous" onClick={() => setCurrentStep(currentStep - 1)} ><i className="fa-solid fa-arrow-left-long fa-fw"></i> Back</button>
									<h1 className="mb-0 mt-1">Co-Applicants</h1>
									<p className="mt-1">Instant Business & Personal Loan 
									
									</p>
									

									<div className="stepform-newdesign">
									<div className="row">
									   <div className="col-12 col-md-10" style={{textAlign:"right",cursor:"pointer"}}>
									<span className="add-btn" onClick={() => addCoApplication()} style={{float:"unset"}}>Add</span>
									</div>
									</div>
										{form.values.co_application.length > 0 && form.values.co_application.map((co, index) =>

											<div className="row" key={index}>
												<div className="col-12 col-md-5">
													<label>Name</label>
													<input type="text" 
													onChange={(e) => updateCoAppRecord(e,'name',index,`co_application.${index}.name`)} onBlur={(e) => updateCoAppAndSaveRecord(e,'name',index,`co_application.${index}.name`)} 
													className="" placeholder="Enter name" value={form.values['co_application']?.[index]?.['name']} />
													{form.values['co_application']?.[index]?.['name_true']?
													<i className="fa-solid fa-check fa-fw checkgreen"></i> 
													: '' }
													{form.touched['co_application']?.[index]?.['name'] && form.errors['co_application']?.[index]?.['name'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['name']}</div> : ''}
												</div>
												<div className="col-12 col-md-5">
													<label>Relationship</label>
													<input type="text" value={form.values['co_application']?.[index]?.['relationship']}  onChange={(e) => updateCoAppRecord(e,'relationship',index,`co_application.${index}.relationship`)} onBlur={(e) => updateCoAppAndSaveRecord(e,'relationship',index,`co_application.${index}.relationship`)}  className="" placeholder="Enter relationship" />
													{form.values['co_application']?.[index]?.['relationship_true']?
													<i className="fa-solid fa-check fa-fw checkgreen"></i> 
													: '' }
													{form.touched['co_application']?.[index]?.['relationship'] && !form.errors['co_application']?.[index]?.['name'] && form.errors['co_application']?.[index]?.['relationship'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['relationship']}</div> : ''}
												</div>
												<div className="col-xs-12 col-md-10 mb-3">
													<label>Pan Card Number </label>
													<input type="text" value={form.values['co_application']?.[index]?.['pan_number']}  onChange={(e) => updateCoAppRecord(e,'pan_number',index,`co_application.${index}.pan_number`)} onBlur={(e) => updateCoAppAndSaveRecord(e,'pan_number',index,`co_application.${index}.pan_number`)} className="mb-0" placeholder="Enter Number" />
													{form.values['co_application']?.[index]?.['pan_number_true']?
													<i className="fa-solid fa-check fa-fw checkgreen"></i> 
													: '' }
													{form.touched['co_application']?.[index]?.['pan_number'] && !form.errors['co_application']?.[index]?.['relationship']  && form.errors['co_application']?.[index]?.['pan_number'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['pan_number']}</div> : ''}
												</div>
												<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
													{form.values['co_application']?.[index]?.['pancard_image_true']?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
															: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Co-Applicants Pan Card <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> 
															<small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'co_application', 'uploads/merchant/pancard',index)} />
															
															</label>
														</div>
														{form.values['co_application']?.[index]?.['pancard_image'] == '' && form.touched['co_application']?.[index]?.['pancard_image'] && !form.errors['co_application']?.[index]?.['pan_number'] && form.errors['co_application']?.[index]?.['pancard_image'] ? <div className="text-danger">{form.errors['co_application']?.[index]?.['pancard_image']}</div> : ''}

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
												{index>0 ? 
													<div className="col-12 col-md-6 col-lg-10" style={{textAlign: "end",cursor:"pointer"}}>
													<span className="remove-btn" onClick={() => removeCoApplication(index)}>Remove</span>
													</div>
												:''	}
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
												<label>Firm Pan Number</label>
												<input type="text" name="pan_number"  readOnly value={form.values.pan_number} className="mb-0" placeholder="Enter Number" />
												{form.values.pan_number_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.pan_number && form.errors.pan_number ? <div className="text-danger">{form.errors.pan_number}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													{/* <div className="upload__box">

													    {form.values.pancard_image_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Pan Card <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span>  <small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'pancard_image', 'uploads/merchant/pancard')} onBlur={(e) => updateAndSaveRecord(e,'pancard_image')} />
															</label>
														</div>
														{form.values.pancard_image == '' && form.touched.pancard_image && Object.keys(form.errors)[0]=='pancard_image' && form.errors.pancard_image ? <div className="text-danger">{form.errors.pancard_image}</div> : ''} 

													</div> */}
													{form.values.pancard_image && form.values.pancard_image.split(',') && form.values.pancard_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['pancard_image'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['pancard_image']+'%'}}><span>{uploadBr['pancard_image']}%</span></div>
															</div>
															 :''} 
																{form.values.pancard_image && form.values.pancard_image.split(',').map((option, index) => (
																	<li key={index} >
																		
																		{checkURL(config.s3_url+'uploads/merchant/pancard/'+option) ? 
																		    <>
																			<img src={config.s3_url+'uploads/merchant/pancard/'+option} alt="" />
																				{/* <Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link> */}
																			<p>{option}</p>
																			</>
																		: 
																		
																		    <>
																		     {/* <Link to="" onClick={(e) => {removeImage(e,index,'pancard_image')}} className="upload__img-close" ><i className="fa-solid fa-close fa-fw"></i></Link> */}
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
												<input type="text" name="gst_number" onChange={(e) => updateRecord(e,'gst_number')} onBlur={(e) => updateAndSaveRecord(e,'gst_number')} value={form.values.gst_number} className="" placeholder="Enter Number" />
												{form.values.gst_number_true?
												<i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.gst_number && Object.keys(form.errors)[0]=='gst_number' && form.errors.gst_number ? <div className="text-danger">{form.errors.gst_number}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
													{form.values.gstproof_image_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
															: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload GST Registration  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> <small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'gstproof_image', 'uploads/merchant/gst')} onBlur={(e) => updateAndSaveRecord(e,'gstproof_image')}  />

															</label>
														</div>
														{form.values.gstproof_image == '' && Object.keys(form.errors)[0]=='gstproof_image' && form.touched.gstproof_image && !form.errors.gst_number && form.errors.gstproof_image ? <div className="text-danger">{form.errors.gstproof_image}</div> : ''} 

													</div>
													{form.values.gstproof_image && form.values.gstproof_image.split(',') && form.values.gstproof_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
															{uploadBr['gstproof_image'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['gstproof_image']+'%'}}>
																<span>{uploadBr['gstproof_image']}%</span>
																</div>
															</div>
															 :''} 
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
												<input type="text" name="business_address"  onChange={(e) => updateRecord(e,'business_address')} onBlur={(e) => updateAndSaveRecord(e,'business_address')}  value={form.values.business_address}  className="mb-0" placeholder="Enter address" />
												{form.values.business_address_true?
															<i className="fa-solid fa-check fa-fw checkgreen"></i> 
															: '' }
												{form.values.business_address == '' &&  form.touched.business_address && Object.keys(form.errors)[0]=='business_address' && form.errors.business_address ? <div className="text-danger">{form.errors.business_address}</div> : ''}

											</div>
											<div className="col-12 col-md-6 col-lg-10">
													<div className="upload__box">
													{form.values.business_address_proof_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
															: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Address Proof  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> <small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'business_address_proof', 'uploads/merchant/business')} onBlur={(e) => updateAndSaveRecord(e,'business_address_proof')}  />
															</label>
														</div>
														{form.values.business_address_proof == '' && form.touched.business_address_proof && Object.keys(form.errors)[0]=='business_address_proof' && form.errors.business_address_proof ? <div className="text-danger">{form.errors.business_address_proof}</div> : ''} 

													</div>
													{form.values.business_address_proof && form.values.business_address_proof.split(',') && form.values.business_address_proof.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['business_address_proof'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['business_address_proof']+'%'}}>
																<span>{uploadBr['business_address_proof']}%</span>
																</div>
															</div>
															 :''} 
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
													{form.values.bank_statement_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
															: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload One Year Latest Bank Statement  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span>  <small className="pdffile">(Only Pdf)</small></p>
															<input type="file" multiple accept=".pdf" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'bank_statement', 'uploads/merchant/bankstatement')} onBlur={(e) => updateAndSaveRecord(e,'bank_statement')} />
															</label>
														</div>
														{form.values.bank_statement == '' && form.touched.bank_statement && Object.keys(form.errors)[0]=='bank_statement' && form.errors.bank_statement ? <div className="text-danger">{form.errors.bank_statement}</div> : ''} 

													</div>
													{form.values.bank_statement && form.values.bank_statement.split(',') && form.values.bank_statement.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['bank_statement'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['bank_statement']+'%'}}>
																<span>{uploadBr['bank_statement']}%</span>
																</div>
															</div>
															 :''} 
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
													{form.values.itr_docs_true?
															<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
															: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload ITR  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span>  <small className="pdffile">(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'itr_docs', 'uploads/merchant/business')} onBlur={(e) => updateAndSaveRecord(e,'itr_docs')} />
															</label>
														</div>
														{form.values.itr_docs == '' && form.touched.itr_docs && Object.keys(form.errors)[0]=='itr_docs' && form.errors.itr_docs ? <div className="text-danger">{form.errors.itr_docs}</div> : ''} 

													</div>
													{form.values.itr_docs && form.values.itr_docs.split(',') && form.values.itr_docs.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['itr_docs'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['itr_docs']+'%'}}>
																<span>{uploadBr['itr_docs']}%</span>
																</div>
															</div>
															 :''} 
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

	const [uploadBr, setUploadBr] = 
	useState({'pancard_image':0,'aadhar_image':0,'bank_statement':0,'salery_slip':0})
	const [progress, setProgress] = useState(0)
	const [progressName, setProgressName] = useState('')

	useEffect(() => {
		setuploadBr()
	}, [progress])

	// useEffect(() => {
	// 	updatePanNumber()
	// }, [])

	// const updatePanNumber = () => {
	// 	api.postApi('updateSingleKey-personalForm', { key: 'pan_number', value: props.data.info.pan_number}, false, props.header).then(response => {
			
	// 	}).catch(error => {
	// 	});
	// }
	
	const setuploadBr = () => { 
		uploadBr[progressName] =progress
		setUploadBr(uploadBr)
	}

	const [currentStep, setCurrentStep] = useState(0);
	const [cities, setCities] = useState([]);
	const [residence_cities, setresidence_cities] = useState([]);
	const [residence_pincode, setresidence_pincode] = useState([]);
	const [pincode, setPincode] = useState([]);
	useEffect(() => {
		if (props.data.personal_info.residence_state && currentStep==0) {
			GetCities(props.data.personal_info.residence_state,'residence_state')
		}

	
		if (props.data.personal_info.company_state && currentStep==1) {
			GetCities(props.data.personal_info.company_state,'company_state')
		}
	}, [currentStep])


	useEffect(() => {
		if (cities.length>0 &&  currentStep==1) {
			GetPincode(props.data.personal_info.company_city,'company_city')
		}
	}, [cities])

	useEffect(() => {
		if (residence_cities.length>0 && currentStep==0) {
			GetPincode(props.data.personal_info.residence_city,'residence_city')
		}
	}, [residence_cities])
	
	const form = useFormik({
		initialValues: props.data.personal_info,
		enableReinitialize: true,
		validationSchema: yup.object({
			first_name: currentStep == 0 ? yup.string().required('Please enter your name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			last_name: currentStep == 0 ? yup.string().required('Please enter your surname').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			email: currentStep == 0 ? yup.string().email('Please enter valid email address').required('Please enter email address') : '',
			date_of_birth: currentStep == 0 ? yup.string().required('Please enter dob') : '',
			father_name: currentStep == 0 ? yup.string().required(`Please enter father's name`).matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			gender: currentStep == 0 ? yup.string().required('Please select gender') : '',
			qualification: currentStep == 0 ? yup.string().required('Please select qualification') : '',
			marital_status: currentStep == 0 ? yup.string().required('Please select marital status') : '',
			number_of_kids: currentStep == 0 ? yup.number().typeError('you must specify a number') : '',
			vehicle_type: currentStep == 0 ? yup.string().required('Please select vehicle type') : '',
			residence_building: currentStep == 0 ? yup.string().required('Please enter Flat/Building/Street No') : '',
			
			residence_state: currentStep == 0 ? yup.string().required('Please select state') : '',
			residence_city: currentStep == 0 ? yup.string().required('Please select city') : '',
			residence_area: currentStep == 0 ? yup.string().required('Please enter residence area') : '',
			residence_pincode: currentStep == 0 ? yup.string().required('Please select pincode') : '',

			employer_name: currentStep == 1 ? yup.string().required('Please enter employer name').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			designation: currentStep == 1 ? yup.string().required('Please enter your designation').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ") : '',
			organization: currentStep == 1 ? yup.number().typeError('you must specify a number').required('Please enter working years') : '',
			organization_type: currentStep == 1 ? yup.string().required('Please select organization') : '',
			total_experience: currentStep == 1 ? yup.string().required('Please select total experience') : '',
			required_amount: currentStep == 1 ? yup.number().typeError('you must specify a number').required('Please enter required amount') : '',
			loan_purpose: currentStep == 1 ? yup.string().required('Please select loan purpose') : '',
			company_building: currentStep == 1 ? yup.string().required('Please enter Flat/Building/Street No') : '',
			
			company_state: currentStep == 1 ? yup.string().required('Please select state') : '',
			company_city: currentStep == 1 ? yup.string().required('Please select city') : '',
			company_area: currentStep == 1 ? yup.string().required('Please enter area') : '',
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
				setProgressName(path)
				uploadBr[path] =0;
				setUploadBr(uploadBr)
				api.uploadPostApi('multipleImageUpload', formData, true, props.header,setProgress).then(response => {
					form.setFieldValue(path, form.values[path]?form.values[path] +','+response.fileName : response.fileName).then(res => {
						if(res[path]==undefined) {
							api.postApi('updateSingleKey-personalForm', { key: path, value: form.values[path]?form.values[path] +','+response.fileName : response.fileName}, false, props.header).then(response => {
								form.setFieldValue(path+'_true',true);
								if(path=='pancard_image') {
									toast.success('Pancard is verified')
								 }
								
							}).catch(error => {

							});
						}
				    });
					e.target.value = '';
					if(path!='pancard_image') {
					  toast.success('Upload Successful')
					}
				}).catch(error => {

				});
		}
	}
	const GetCities = (state_name, path = '') => {
		if(state_name) {
			var state = props.allStates.find(state => state.name == state_name);
			api.postApi('cityList', { state_id: state.id }, false, props.header).then(response => {
				if (path == 'residence_state') {
					// form.setFieldValue('residence_state', state_name)
					setresidence_cities(response.cities);
				} else {
					// form.setFieldValue('company_state', state_name)
					setCities(response.cities);
				}
			}).catch(error => {
			});
		} else {

			if (path == 'residence_state') {
				setresidence_cities([])
				setresidence_pincode([])
				form.setFieldValue('residence_city', '')
				form.setFieldValue('residence_city_true',false)
				form.setFieldValue('residence_pincode', '')
				form.setFieldValue('residence_pincode_true',false)
			} else {
				setCities([])
				setPincode([])
				form.setFieldValue('company_city', '')
				form.setFieldValue('company_city_true',false)
				form.setFieldValue('company_pincode', '')
				form.setFieldValue('company_pincode_true',false)
			}
			
		}
	}
	const GetPincode = (city_name, path = '') => {
		if(city_name) {
			var city;
			var state_id;
			var state
			
			if (path == 'residence_city') {
				city = residence_cities.find(city => city.name == city_name);
				state = props.allStates.find(state => state.name == form.values.residence_state);
				state_id = state.id.toString()
			} else {
				city = cities.find(city => city.id == city_name);
				state = props.allStates.find(state => state.name == form.values.company_state);
				state_id = state.id.toString()
			}

			api.postApi('pincodeList', { city: city_name, state_id: state_id }, false, props.header).then(response => {
				
				if (path == 'residence_city') {
					// form.setFieldValue('residence_city', city_name)
					setresidence_pincode(response.pincode);
				} else {
					// form.setFieldValue('company_city', city_name)
					setPincode(response.pincode);
				}
			}).catch(error => {
			});

		} else {
			if (path == 'residence_state') {
				setresidence_pincode([])
				form.setFieldValue('residence_pincode', '')
				form.setFieldValue('residence_pincode_true',false)
			} else {
				setPincode([])
				form.setFieldValue('company_pincode', '')
				form.setFieldValue('company_pincode_true',false)
			}
		}

	}
	const removeImage = (e,index,path,co_index=0) => {
		e.preventDefault()
		var array;
		if(path=='co_application') {
		    array =form.values.co_application[co_index].pancard_image.split(',')
			array.splice(index, 1)
			if(array==''){
				// form.setFieldValue(path+'_true',false);
			}
			form.setFieldValue(`co_application.${co_index}.pancard_image`, array.join(','));
		} else {
		    array = form.values[path].split(',')
			array.splice(index, 1)
			if(array==''){
				form.setFieldValue(path+'_true',false);
			}
			form.setFieldValue(path, array.join(','));
		}		
	}
	const checkURL= (url) => {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}


	const  capitalName = (text) => {
		text = text.toLowerCase();
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	const updateRecord = (e,path) => {
		if(e.target.value) {
			form.setFieldValue(path+'_true',false);
			form.setFieldValue(path,e.target.value)
		} else {
			form.setFieldValue(path+'_true',false);
			form.setFieldValue(path,e.target.value);
		}
	}

	const updateAndSaveRecord = (e,path,table_name='',) => {
		if(e.target.value || e.target.type=='file') {
			form.setFieldValue(path+'_true',false);
			if(e.target.type=='file') {
				form.validateForm().then((res) => {
					if(res[path]==undefined) {
						form.setFieldValue(path+'_true',true);
					}
				})
			} else {
				form.setFieldValue(path,e.target.value).then((res) => {
					if(res[path]==undefined) {
						
						let value = path=='first_name' || path=='last_name'? form.values.first_name+' '+form.values.last_name : e.target.value;
						let key = path=='first_name' || path=='last_name'? 'full_name' : path;
						api.postApi('updateSingleKey-personalForm', { key: key, value: value}, false, props.header).then(response => {
							form.setFieldValue(path+'_true',true);
						}).catch(error => {
						});
						
					}
				});
			}
		} else {
			if(e.target.type=='file'){
			} else {
				form.setFieldValue(path,e.target.value);
			}
			form.setFieldValue(path+'_true',false);
			
		}
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
												<input type="text" name="first_name" readOnly value={form.values.first_name} className="" placeholder="Enter first name" />
												{form.values.first_name_true?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.first_name && form.errors.first_name ? <div className="text-danger">{form.errors.first_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Last Name</label>
												<input type="text" name="last_name" readOnly value={form.values.last_name} className="" placeholder="Enter last name" />
												{form.values.last_name_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.last_name && Object.keys(form.errors)[0]=='last_name' && form.errors.last_name ? <div className="text-danger">{form.errors.last_name}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Email Address{form.values.email_true}</label>
												<input type="text" name="email" onChange={(e) => updateRecord(e,'email')} onBlur={(e) => updateAndSaveRecord(e,'email')} value={form.values.email} className="" placeholder="Enter email" />
												{form.values.email_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.email && Object.keys(form.errors)[0]=='email' && form.errors.email ? <div className="text-danger">{form.errors.email}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Date of birth</label>
												<input type="date"   max="1999-12-31" name="date_of_birth" readOnly value={form.values.date_of_birth} className="" placeholder="Enter Date of birth" />
												{form.values.date_of_birth_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.date_of_birth && Object.keys(form.errors)[0]=='date_of_birth' && form.errors.date_of_birth ? <div className="text-danger">{form.errors.date_of_birth}</div> : ''}
											</div>
											<div className="col-12 col-md-5">
												<label>Father's Name</label>
												<input type="text" name="father_name" readOnly value={form.values.father_name} className="" placeholder="Enter father name" />
												{form.values.father_name_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.father_name && Object.keys(form.errors)[0]=='father_name' && form.errors.father_name ? <div className="text-danger">{form.errors.father_name}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Gender</label>
												<select name="gender" onChange={(e) => updateRecord(e,'gender')} onBlur={(e) => updateAndSaveRecord(e,'gender')} value={form.values.gender} >
													<option value="">Select One</option>
													<option value="Male" >Male</option>
													<option value="Female">Female</option>
													<option value="Other">Other</option>
													<option value="Prefer not to disclose">Prefer not to disclose</option>
												</select>
												{form.values.gender_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.gender && Object.keys(form.errors)[0]=='gender' && form.errors.gender ? <div className="text-danger">{form.errors.gender}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Qualification</label>
												<select name="qualification" onChange={(e) => updateRecord(e,'qualification')} onBlur={(e) => updateAndSaveRecord(e,'qualification')} value={form.values.qualification}>
													<option value="">Select One</option>
													<option value="Under Graduate" >Under Graduate</option>
													<option value="Graduate">Graduate</option>
													<option value="Post Graduate">Post Graduate</option>
												</select>
												{form.values.qualification_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.qualification  && Object.keys(form.errors)[0]=='qualification' && form.errors.qualification ? <div className="text-danger">{form.errors.qualification}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Marital Status</label>
												<select name="marital_status" onChange={(e) => updateRecord(e,'marital_status')} onBlur={(e) => updateAndSaveRecord(e,'marital_status')} value={form.values.marital_status} >
													<option value="">Select One</option>
													<option value="Married" >Married</option>
													<option value="Single">Single</option>
													<option value="Prefer Not to Say">Prefer Not to Say</option>
												</select>
												{form.values.marital_status_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.marital_status && Object.keys(form.errors)[0]=='marital_status' && form.errors.marital_status ? <div className="text-danger">{form.errors.marital_status}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Number of Kids</label>
												<input type="number" min="0" name="number_of_kids" onChange={(e) => updateRecord(e,'number_of_kids')} onBlur={(e) => updateAndSaveRecord(e,'number_of_kids')} value={form.values.number_of_kids} className="" placeholder="Enter kids number" />
												{form.values.number_of_kids_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.number_of_kids && Object.keys(form.errors)[0]=='number_of_kids' && form.errors.number_of_kids ? <div className="text-danger">{form.errors.number_of_kids}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Vehicle Type</label>
												<select name="vehicle_type" onChange={(e) => updateRecord(e,'vehicle_type')} onBlur={(e) => updateAndSaveRecord(e,'vehicle_type')} value={form.values.vehicle_type}>
													<option value="">Select One</option>
													<option value="2 wheeler">2 wheeler</option>
													<option value="4 wheeler" >4 wheeler</option>
													<option value="None">None</option>
												</select>
												{form.values.vehicle_type_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.vehicle_type  && Object.keys(form.errors)[0]=='vehicle_type'  && form.errors.vehicle_type ? <div className="text-danger">{form.errors.vehicle_type}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Flat/Building/Street No.</label>
												<input type="text" name="residence_building" onChange={(e) => updateRecord(e,'residence_building')} onBlur={(e) => updateAndSaveRecord(e,'residence_building')} value={form.values.residence_building} className="" placeholder="Enter House No." />
												{form.values.residence_building_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.residence_building   && Object.keys(form.errors)[0]=='residence_building' && form.errors.residence_building ? <div className="text-danger">{form.errors.residence_building}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label>
												<select name="residence_state" value={form.values.residence_state}  onChange={(e) => updateRecord(e,'residence_state',GetCities(e.target.value, 'residence_state'))} onBlur={(e) => updateAndSaveRecord(e,'residence_state')}>
													<option value="">Select One</option>
													{props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.name} key={index}>{option.name}</option>
													))}
												</select>
												{form.values.residence_state_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.residence_state && Object.keys(form.errors)[0]=='residence_state'   && form.errors.residence_state ? <div className="text-danger">{form.errors.residence_state}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="residence_city" value={form.values.residence_city}   onChange={(e) => updateRecord(e,'residence_city',GetPincode(e.target.value, 'residence_city'))}  onBlur={(e) => updateAndSaveRecord(e,'residence_city')}>
													<option value="" >Select One</option>
													{residence_cities.length > 0 && residence_cities.map((option, index) => (
														<option value={option.name} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.values.residence_city_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.residence_city && Object.keys(form.errors)[0]=='residence_city'  && form.errors.residence_city ? <div className="text-danger">{form.errors.residence_city}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Locality/Area</label>
												<input type="text" name="residence_area" onChange={(e) => updateRecord(e,'residence_area')} onBlur={(e) => updateAndSaveRecord(e,'residence_area')} value={form.values.residence_area}  className="" placeholder="Enter Locality/Area" />
												{form.values.residence_area_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.residence_area && Object.keys(form.errors)[0]=='residence_area' && form.errors.residence_area ? <div className="text-danger">{form.errors.residence_area}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pincode</label>
												<select name="residence_pincode" value={form.values.residence_pincode}   onChange={(e) => updateRecord(e,'residence_pincode')} onBlur={(e) => updateAndSaveRecord(e,'residence_pincode')}  >
													<option value="">Select One</option>
													{residence_pincode.length > 0 && residence_pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.values.residence_pincode_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.residence_pincode && Object.keys(form.errors)[0]=='residence_pincode' && form.errors.residence_pincode ? <div className="text-danger">{form.errors.residence_pincode}</div> : ''}
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
												<input type="text" name="employer_name"  onChange={(e) => updateRecord(e,'employer_name')} onBlur={(e) => updateAndSaveRecord(e,'employer_name')} value={form.values.employer_name}  className="" placeholder="Enter name" />
												{form.values.employer_name_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.employer_name && form.errors.employer_name ? <div className="text-danger">{form.errors.employer_name}</div> : ''}

											</div>
											<div className="col-12 col-md-5">
												<label>Designation</label>
												<input type="text" className="" name="designation" onChange={(e) => updateRecord(e,'designation')} onBlur={(e) => updateAndSaveRecord(e,'designation')} value={form.values.designation}  placeholder="Enter designation" />
												{form.values.designation_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.designation && Object.keys(form.errors)[0]=='designation' && form.errors.designation ? <div className="text-danger">{form.errors.designation}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>No. of years in organization</label>
												<input type="number" min="0" className="" name="organization" onChange={(e) => updateRecord(e,'organization')} onBlur={(e) => updateAndSaveRecord(e,'organization')} value={form.values.organization}  placeholder="Enter year" />
												{form.values.organization_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.organization && Object.keys(form.errors)[0]=='organization' && form.errors.organization ? <div className="text-danger">{form.errors.organization}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Type of organization </label>
												<select name="organization_type" onChange={(e) => updateRecord(e,'organization_type')} onBlur={(e) => updateAndSaveRecord(e,'organization_type')} value={form.values.organization_type}   >
													<option value="" >Select One</option>
													<option value="Proprietorship" >Proprietorship</option>
													<option value="Partnership">Partnership</option>
													<option value="Private Limited">Private Limited</option>
													<option value="Public Limited">Public Limited</option>
													<option value="Government">Government</option>
													<option value="Other">OTHER</option>
												</select>
												{form.values.organization_type_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.organization_type && Object.keys(form.errors)[0]=='organization_type' && form.errors.organization_type ? <div className="text-danger">{form.errors.organization_type}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Total Experience (In Year) </label>
												<select name="total_experience"  onChange={(e) => updateRecord(e,'total_experience')} onBlur={(e) => updateAndSaveRecord(e,'total_experience')} value={form.values.total_experience}   >
													<option value="" >Select One</option>
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
												{form.values.total_experience_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.total_experience && Object.keys(form.errors)[0]=='total_experience'  && form.errors.total_experience ? <div className="text-danger">{form.errors.total_experience}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Required Amount</label>
												<input type="text" name="required_amount"  onChange={(e) => updateRecord(e,'required_amount')} onBlur={(e) => updateAndSaveRecord(e,'required_amount')} value={form.values.required_amount}  className="" placeholder="Enter amount" />
												{form.values.required_amount_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.required_amount && Object.keys(form.errors)[0]=='required_amount' && form.errors.required_amount ? <div className="text-danger">{form.errors.required_amount}</div> : ''}
											</div>
											<div className="col-xs-12 col-md-10">
												<label>Loan purpose </label>
												<select name="loan_purpose" onChange={(e) => updateRecord(e,'loan_purpose')} onBlur={(e) => updateAndSaveRecord(e,'loan_purpose')} value={form.values.loan_purpose} >
														<option value="" >Select One</option>
														<option value="1364">Appliance purchase</option>
														<option value="1365" >Car 2 wheeler</option>
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
													{form.values.loan_purpose_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
													{form.touched.loan_purpose && Object.keys(form.errors)[0]=='loan_purpose' && form.errors.loan_purpose ? <div className="text-danger">{form.errors.loan_purpose}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Building No./Plot No.</label>
												<input type="text" name="company_building"  onChange={(e) => updateRecord(e,'company_building')} onBlur={(e) => updateAndSaveRecord(e,'company_building')} value={form.values.company_building}  className="" placeholder="Enter house no." />
												{form.values.company_building_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_building && Object.keys(form.errors)[0]=='company_building' && form.errors.company_building ? <div className="text-danger">{form.errors.company_building}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>State</label>
												<select name="company_state" value={form.values.company_state} onChange={(e) => updateRecord(e,'company_state',GetCities(e.target.value, 'company_state'))} onBlur={(e) => updateAndSaveRecord(e,'company_state')} >
													<option value="">Select One</option>
													{props.allStates.length > 0 && props.allStates.map((option, index) => (
														<option value={option.name} key={index}>{option.name}</option>
													))}
												</select>
												{form.values.company_state_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_state && Object.keys(form.errors)[0]=='company_state'  && form.errors.company_state ? <div className="text-danger">{form.errors.company_state}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>City</label>
												<select name="company_city" value={form.values.company_city} onChange={(e) => updateRecord(e,'company_city',GetPincode(e.target.value, 'company_city'))} onBlur={(e) => updateAndSaveRecord(e,'company_city')}  >
													<option value="">Select One</option>
													{cities.length > 0 && cities.map((option, index) => (
														<option value={option.name} key={index}>{capitalName(option.name)}</option>
													))}
												</select>
												{form.values.company_city_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_city && Object.keys(form.errors)[0]=='company_city'  && form.errors.company_city ? <div className="text-danger">{form.errors.company_city}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Locality/Area </label>
												<input type="text" name="company_area"  onChange={(e) => updateRecord(e,'company_area')} onBlur={(e) => updateAndSaveRecord(e,'company_area')} value={form.values.company_area} className="" placeholder="Enter area." />
												{form.values.company_area_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_area && Object.keys(form.errors)[0]=='company_area' && form.errors.company_area ? <div className="text-danger">{form.errors.company_area}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Pincode </label>
												<select name="company_pincode" onChange={(e) => updateRecord(e,'company_pincode')} onBlur={(e) => updateAndSaveRecord(e,'company_pincode')} value={form.values.company_pincode} >
													<option value="">Select One</option>
													{pincode.length > 0 && pincode.map((option, index) => (
														<option value={option.pincode} key={index}>{option.pincode}</option>
													))}
												</select>
												{form.values.company_pincode_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_pincode && Object.keys(form.errors)[0]=='company_pincode'  && form.errors.company_pincode ? <div className="text-danger">{form.errors.company_pincode}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Company Website</label>
												<input type="text" name="company_website"  onChange={(e) => updateRecord(e,'company_website')} onBlur={(e) => updateAndSaveRecord(e,'company_website')} value={form.values.company_website} className="" placeholder="Enter website URL" />
												{form.values.company_website_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_website && Object.keys(form.errors)[0]=='company_website' && form.errors.company_website ? <div className="text-danger">{form.errors.company_website}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Official Email Address</label>
												<input type="text" name="company_email"  onChange={(e) => updateRecord(e,'company_email')} onBlur={(e) => updateAndSaveRecord(e,'company_email')} value={form.values.company_email} className="" placeholder="Enter official email" />
												{form.values.company_email_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.company_email  && Object.keys(form.errors)[0]=='company_email' && form.errors.company_email ? <div className="text-danger">{form.errors.company_email}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Monthly take home</label>
												<input type="text" name="salery_inhand"  onChange={(e) => updateRecord(e,'salery_inhand')} onBlur={(e) => updateAndSaveRecord(e,'salery_inhand')} value={form.values.salery_inhand} className="" placeholder="Enter monthly income" />
												{form.values.salery_inhand_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.salery_inhand && Object.keys(form.errors)[0]=='salery_inhand' && form.errors.salery_inhand ? <div className="text-danger">{form.errors.salery_inhand}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Mode of receiving salary</label>
												<select name="salary_mode" onChange={(e) => updateRecord(e,'salary_mode')} onBlur={(e) => updateAndSaveRecord(e,'salary_mode')} value={form.values.salary_mode} >
													<option value="">Select One</option>
													<option value="Bank account transfer">Bank account transfer</option>
													<option value="Cheque" >Cheque</option>
													<option value="Cash">Cash</option>
												</select>
												{form.values.salary_mode_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.salary_mode && Object.keys(form.errors)[0]=='salary_mode' && form.errors.salary_mode ? <div className="text-danger">{form.errors.salary_mode}</div> : ''}

											</div>
											<div className="col-xs-12 col-md-5">
												<label>Bank Name</label>
												<input type="text" name="bank_name"  onChange={(e) => updateRecord(e,'bank_name')} onBlur={(e) => updateAndSaveRecord(e,'bank_name')} value={form.values.bank_name} className="" placeholder="Enter your bank name" />
												{form.values.bank_name_true ?
												 <i className="fa-solid fa-check fa-fw checkgreen"></i> 
												: '' }
												{form.touched.bank_name && Object.keys(form.errors)[0]=='bank_name'  && form.errors.bank_name ? <div className="text-danger">{form.errors.bank_name}</div> : ''}

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
													{form.values.pancard_image_true ?
																<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Pan Card  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span>  <small style={{display:"block",color: "#a5a5a5"}}>(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'pancard_image', 'uploads/merchant/pancard')} onBlur={(e) => updateAndSaveRecord(e,'pancard_image')} />
															</label>
														</div>
														{form.values.pancard_image == '' && form.touched.pancard_image && form.errors.pancard_image ? <div className="text-danger">{form.errors.pancard_image}</div> : ''} 

													</div>
													{form.values.pancard_image && form.values.pancard_image.split(',') && form.values.pancard_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['pancard_image'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['pancard_image']+'%'}}>
																<span>{uploadBr['pancard_image']}%</span>
																</div>
															</div>
															 :''} 
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
													{form.values.aadhar_image_true?
																<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload Aadhar Card  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> 
															<small style={{display: "block",color: "#a5a5a5"}}>(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'aadhar_image', 'uploads/merchant/aadharcard')} onBlur={(e) => updateAndSaveRecord(e,'aadhar_image')} />
															</label>
														</div>
														{form.values.aadhar_image == '' && form.touched.aadhar_image && Object.keys(form.errors)[0]=='aadhar_image'  && form.errors.aadhar_image ? <div className="text-danger">{form.errors.aadhar_image}</div> : ''} 

													</div>
													{form.values.aadhar_image && form.values.aadhar_image.split(',') && form.values.aadhar_image.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['aadhar_image'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['aadhar_image']+'%'}}>
																<span>{uploadBr['aadhar_image']}%</span>
																</div>
															</div>
															 :''} 
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
													{form.values.bank_statement_true?
																<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload One Year Latest Bank Statement  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> <small style={{display: "block",color: "#a5a5a5"}}>(Only PDF)</small></p>
															<input type="file" multiple accept=".pdf" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e,'bank_statement', 'uploads/merchant/bankstatement')} onBlur={(e) => updateAndSaveRecord(e,'bank_statement')}  />
															</label>
														</div>
														{form.values.bank_statement == '' && form.touched.bank_statement && Object.keys(form.errors)[0]=='bank_statement'  && form.errors.bank_statement ? <div className="text-danger">{form.errors.bank_statement}</div> : ''} 

													</div>
													{form.values.bank_statement && form.values.bank_statement.split(',') && form.values.bank_statement.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['bank_statement'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['bank_statement']+'%'}}>
																<span>{uploadBr['bank_statement']}%</span>
																</div>
															</div>
															 :''} 
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
													{form.values.salery_slip_true?
																<p className="mb-0"><i className="fa-solid fa-check fa-fw checkgreen-upload"></i> </p>
																: '' }
														<div className="upload__btn-box">
															<label className="upload__btn">
															<i className="fa-solid fa-arrow-up-from-bracket fa-fw"></i>
															<p>Upload latest 3 months salary slips  <span className="addmore-plus"><i className="fa-solid fa-plus fa-fw"></i></span> 
															<small style={{display: "block",color: "#a5a5a5"}}>(Only Jpg,Png,Pdf,Doc)</small></p>
															<input type="file" multiple  accept=".png, .jpeg, .jpg, .pdf, .doc, .docx" data-max_length="20" className="upload__inputfile"  onChange={(e) => acceptedFiles(e, 'salery_slip', 'uploads/merchant/salery_slip')} onBlur={(e) => updateAndSaveRecord(e,'salery_slip')}   />
															</label>
														</div>
														{form.values.salery_slip == '' && form.touched.salery_slip && Object.keys(form.errors)[0]=='salery_slip' && form.errors.salery_slip ? <div className="text-danger">{form.errors.salery_slip}</div> : ''} 

													</div>
													{form.values.salery_slip && form.values.salery_slip.split(',') && form.values.salery_slip.split(',').length > 0  ?
													<>
														<ul className="imgpreview-newbx">
														{uploadBr['salery_slip'] > 0?
														    <div className="progress-imgupload">
																<div className="progress-value" style={{width: uploadBr['salery_slip']+'%'}}>
																<span>{uploadBr['salery_slip']}%</span>
																</div>
															</div>
															 :''} 
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
		<section className="leanderlist-padding">
		{/* <form id="msform" onSubmit={form.handleSubmit}> */}
		<div className="container">		
			<div className="row d-flex flexwrap">			
				{/* <div className="col-md-12"> */}
					{lenderList.length > 0 && lenderList.map((co, index) => (		
						
						<div className="col-6 col-sm-6 mb-5"  key={index}>
							<input className="checkbox-tools" type="checkbox" name="tools" id={index+"_lender_error"} value={co.user_id}  onChange={(e) => lenderPushArray(e)}/>
							    <label className="for-checkbox-tools" htmlFor={index+"_lender_error"}>
									<div className="card profile-card-2">
										<div className="card-body">
											<div className="leanderlogo">
												{/* <img src={config.s3_url+'uploads/profile/'+co.profile_pic} alt="profile-imagex" className="profile"/> */}
												<h5 className="card-title">{co.company_name}</h5>
											</div>
											<div className="lander-rate">
												<ul className="listlander">
													<li><b>Min-Max Rate Of Interest</b></li>
													<li>{co.mini_rate_of_intrest}% - {co.max_rate_of_intrest}%</li>
												</ul>
												<ul className="listlander">
													<li><b>Min-max Loan Range</b></li>
													<li>{co.mini_loan_range}-{co.max_loan_range}</li>
												</ul>
												<ul className="listlander bornoe">
													<li><b>Min-Max Tenure</b></li>
													<li>{co.mini_tenure} Month - {co.max_tenure} Month</li>
												</ul>
											</div>		
										</div>
									</div>
								</label>
						</div>
					))}
						
						{errorMassege? <div className="text-danger" style={{textAlign:"end"}}>{errorMassege}</div> :''}

						<div className="col-md-12 w-100per">
							<button type="button" id="lender_detail"  onClick={() => submitForm() } className="sb-btn">SUBMIT</button>
						</div>
				</div>
			</div>			
		{/* </div> */}
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
									<p><b>Lenders:</b></p>
									<table className="table">
										<thead>
											<tr>
												<th>Name</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody>
										    {props.formResponse && props.formResponse.AllLenders && props.formResponse.AllLenders.length && props.formResponse.AllLenders.map((option, index) => (
												<tr key={index}>
													<td>{option.company_name}</td>
													<td>{option.status}</td>
												</tr>
											))}
										</tbody>
									</table>
									

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