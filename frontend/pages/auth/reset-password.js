import { useState } from 'react';
import axios from '../../lib/axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';

const ResetPassword = () => {
    const { push, query } = useRouter();
    const [alert,setAlert] = useState();

    const initialValues = {
        password: "",
        passwordConfirmation: "",
    }

    const validationSchema = Yup.object({
        password: Yup.string().required("Required"),
        passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Required"),
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        setAlert();

        values.code = query.code;

        axios
            .post('auth/reset-password', values)
            .then(response => {
                const message = `Your password has been resetted. In a few second you'll be redirected to login page.`;
                setAlert(['success', message]);

                resetForm();
                
                setTimeout(() => { push('/auth/login') }, 5000);
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
            <h1>Reset password</h1>
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
                            <div><label htmlFor="password">Password</label></div>
                            <Field type="password" id="password" name="password" placeholder="Password" />
                            <div className="error"><ErrorMessage name="password" /></div>
                        </div>

                        <br />

                        <div>
                            <div><label htmlFor="passwordConfirmation">Repeat Password</label></div>
                            <Field type="password" id="passwordConfirmation" name="passwordConfirmation" placeholder="Repeat password" />
                            <div className="error"><ErrorMessage name="passwordConfirmation" /></div>
                        </div>

                        <br />

                        <button 
                            type="submit"
                            disabled={!isValid} >
                            {!isSubmitting && "Reset password"}
                            {isSubmitting && "Loading..."}
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default ResetPassword;