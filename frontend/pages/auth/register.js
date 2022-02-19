import { useState } from 'react';
import axios from '../../lib/axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Register = () => {
    const [alert,setAlert] = useState();
    const [email,setEmail] = useState();

    const initialValues = {
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        privacyPolicy: false,
        newsletterSubscription: false
    }

    const validationSchema = Yup.object({
        username: Yup.string().required("Required"),
        email: Yup.string().email("Insert a valid email").required("Required"),
        password: Yup.string().required("Required"),
        repeatPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Required"),
        privacyPolicy: Yup.bool().oneOf([true], "Required")
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        setAlert();
        setEmail();

        axios
            .post('/auth/local/register', values)
            .then(response => {
                const message = `Please check your email (${values.email}) to confirm your account.`;
                setAlert(['success', message]);
                setEmail(values.email);

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

    const resendEmail = (email) => {
        setAlert();
        const values = { email: email };

        axios
            .post('/auth/send-email-confirmation', values)
            .then(response => {
                const message = `We sent you another email to <u>${values.email}</u> to confirm your account. Please check also your spam folder.`;
                setAlert(['success', message]);
            })
            .catch(error => {
                const message = `Something went wrong.`;
                setAlert(['alert', message]);
            });
    }

    return (
        <>
            <h1>Register</h1>
            <hr />
            {alert && (
                <div style={{ backgroundColor: alert[0] === "success" ? "lightgreen" : "lightcoral" }}>
                    <div dangerouslySetInnerHTML={{ __html: alert[1] }} />
                </div>
            )}
            {email && (
                <>
                    <br />
                    <small>
                        If you haven&apos;t received our email, <button onClick={() => resendEmail(email)}>click here</button> to resend it.
                    </small>
                </>
            )}
            <br />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => onSubmit(values, { setSubmitting, resetForm })} >
                { ({ isSubmitting, isValid }) => (
                    <Form>
                        <div>
                            <div><label htmlFor="username">Username</label></div>
                            <Field type="text" id="username" name="username" placeholder="Username" />
                            <div className="error"><ErrorMessage name="username" /></div>
                        </div>

                        <br />

                        <div>
                            <div><label htmlFor="email">Email</label></div>
                            <Field type="email" id="email" name="email" placeholder="Email" />
                            <div className="error"><ErrorMessage name="email" /></div>
                        </div>

                        <br />

                        <div>
                            <div><label htmlFor="password">Password</label></div>
                            <Field type="password" id="password" name="password" placeholder="Password" />
                            <div className="error"><ErrorMessage name="password" /></div>
                        </div>

                        <br />

                        <div>
                            <div><label htmlFor="repeatPassword">Repeat Password</label></div>
                            <Field type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat password" />
                            <div className="error"><ErrorMessage name="repeatPassword" /></div>
                        </div>

                        <br />

                        <div>
                            <label htmlFor="privacyPolicy">
                                <Field type="checkbox" name="privacyPolicy" />
                                I accept the <a href="#">Privacy Policy</a> terms and conditions.
                            </label>
                            <div className="error"><ErrorMessage name="privacyPolicy" /></div>
                        </div>

                        <br />

                        <div>
                            <label htmlFor="newsletterSubscription">
                                <Field type="checkbox" name="newsletterSubscription" />
                                I want to subscribe to the newsletter to receive all the latest news and updates.
                            </label>
                        </div>

                        <br />

                        <button 
                            type="submit"
                            disabled={!isValid} >
                            {!isSubmitting && "Submit"}
                            {isSubmitting && "Loading..."}
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Register;