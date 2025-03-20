import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../../utils/globalurl';
import ReactQuill from 'react-quill';

const ManageForum = ({ setHandleAdd }) => {
    const [forum, setForum] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        setForum({ ...forum, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (content) => {
        setForum({ ...forum, description: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userid = localStorage.getItem("user_id");
        const username = localStorage.getItem("user_name");

        try {
            const response = await axios.post(`${baseUrl}auth/forum`, {
                ...forum,
                user_id: userid,
                created_by: username
            });
            toast.success(response.data.message);
            setHandleAdd(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="container-fluid">
            <ToastContainer position="top-center" />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={forum.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <ReactQuill
                        value={forum.description}
                        onChange={handleDescriptionChange}
                        style={{ height: '200px', marginBottom: '50px' }}
                    />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setHandleAdd(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ManageForum; 