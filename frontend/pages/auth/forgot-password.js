import { useState } from 'react';
import axios from '../../lib/axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const ForgotPassword = () => {
    const [alert,setAlert] = useState();

    const initialValues = {
        email: ""
    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Insert a valid email").required("Required")
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        setAlert();

        axios
            .post('/auth/forgot-password', values)
            .then(response => {
                const message = `Please check your email to reset your password.`;
                setAlert(['success', message]);

                resetForm();
            })
            .catch(error => {
                if ( !error.response.data.message ) {
                    setAlert(['alert', "Something went wrong"])
                } else {
                    const messages = error.response.data.message[0].messages;

                    const list = [];
                    messages.map((message,i) => {
                        let item = "";
                        if (i === 0) item += `<ul>`;
                        
                        item += `<li>${message.id}</li>`;

                        if (i === messages.length - 1) item += `</ul>`
                        list.push(item);
                    });

                    setAlert(['alert', list]);
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    return (
        <>
            <h1>Forgot password</h1>
            <hr />
            {alert && (
                <div style={{ backgroundColor: alert[0] === "success" ? "lightgreen" : "lightcoral" }}>
                    <div dangerouslySetInnerHTML={{ __html: alert[1] }} />
                </div>
            )}
            <br />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => onSubmit(values, { setSubmitting, resetForm })} >
                { ({ isSubmitting, isValid }) => (
                    <Form>
                        <div>
                            <div><label htmlFor="email">Email</label></div>
                            <Field type="email" id="email" name="email" placeholder="Email" />
                            <div className="error"><ErrorMessage name="email" /></div>
                        </div>

                        <br />

                        <button 
                            type="submit"
                            disabled={!isValid} >
                            {!isSubmitting && "Send link"}
                            {isSubmitting && "Loading..."}
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default ForgotPassword;