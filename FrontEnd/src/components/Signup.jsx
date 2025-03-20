import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/globalurl';
import api from '../utils/axiosConfig';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        userType: "",
        course_id: "",
        confirmPassword: "",
    });
    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.password !== values.confirmPassword) {
            setErrors("Passwords do not match");
            return;
        }
        
        const userData = {
            name: values.name,
            email: values.email,
            password: values.password,
            course: values.userType === "alumnus" ? values.course_id : null
        };

        api.post('auth/register', userData)
            .then((res) => {
                toast.success(res.data.message);
                navigate("/login", { state: { action: "navtologin" } });
            })
            .catch(err => {
                console.log(err);
                setErrors(err.response?.data?.message || "Registration failed");
                toast.error(err.response?.data?.message || "Registration failed");
            });
    }

    useEffect(() => {
        if (values.userType === "alumnus") {
            console.log('Fetching courses...');
            api.get('courses')
                .then((res) => {
                    console.log('Courses response:', res.data);
                    if (res.data.courses && Array.isArray(res.data.courses)) {
                        setCourses(res.data.courses);
                        console.log('Courses set:', res.data.courses);
                    } else {
                        console.error('Invalid courses data:', res.data);
                        toast.error('Invalid courses data received');
                    }
                })
                .catch(err => {
                    console.error('Error fetching courses:', err);
                    toast.error('Failed to load courses: ' + (err.response?.data?.message || err.message));
                });
        }
    }, [values.userType]);

    console.log('Current courses:', courses); // Debug log
    console.log('Current values:', values); // Debug log

    return (
        <>
            <ToastContainer position="top-center" hideProgressBar />
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Create Account</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mt-3 pt-2">
                <div className="col-lg-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <div className="container col-lg-6 col-md-8 col-sm-10">
                                    <form onSubmit={handleSubmit} id="create_account">
                                        <div className="form-group">
                                            <label htmlFor="name" className="control-label">Name</label>
                                            <input onChange={(e) => setValues({ ...values, name: e.target.value })} type="text" className="form-control" id="name" name="name" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email" className="control-label">Email</label>
                                            <input onChange={(e) => setValues({ ...values, email: e.target.value })} type="email" className="form-control" id="email" name="email" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password" className="control-label">Password</label>
                                            <input onChange={(e) => setValues({ ...values, password: e.target.value })} type="password" className="form-control" id="password" name="password" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword" className="control-label">Confirm Password</label>
                                            <input onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} type="password" className="form-control" id="confirmPassword" name="confirmPassword" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userType" className="control-label">User Type</label>
                                            <select 
                                                onChange={(e) => {
                                                    console.log('User type changed:', e.target.value);
                                                    setValues({ ...values, userType: e.target.value, course_id: '' });
                                                }} 
                                                className="custom-select" 
                                                id="userType" 
                                                name="userType" 
                                                required 
                                                value={values.userType}
                                            >
                                                <option value="">Please select</option>
                                                <option value="alumnus">Alumnus</option>
                                            </select>
                                        </div>
                                        {values.userType === "alumnus" && (
                                            <div className="form-group">
                                                <label htmlFor="course_id" className="control-label">Course</label>
                                                <select 
                                                    onChange={(e) => {
                                                        console.log('Course changed:', e.target.value);
                                                        setValues({ ...values, course_id: e.target.value });
                                                    }} 
                                                    className="form-control select2" 
                                                    name="course_id" 
                                                    required={values.userType === "alumnus"}
                                                    value={values.course_id}
                                                >
                                                    <option value="">Select course</option>
                                                    {courses && courses.length > 0 ? (
                                                        courses.map(c => (
                                                            <option key={c.id} value={c.course}>{c.course}</option>
                                                        ))
                                                    ) : (
                                                        <option value="" disabled>Loading courses...</option>
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                        <hr className="divider" />
                                        <div className="row justify-content-center">
                                            <div className="col-md-6 text-center">
                                                <button type="submit" className="btn btn-info btn-block">Create Account</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {errors && (
                                <div className="alert alert-danger">{errors}</div>
                            )}
                            <div className="row justify-content-center mt-3">
                                <div className="col-md-6 text-center">
                                    <small className="text-muted">
                                        Already have an account? <Link to="/login">Login here</Link>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
