import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../state/useAuthState";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { userToken } = useAuthState();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().trim().required("Username is required"),
    email: Yup.string()
      .trim()
      .matches(
        /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9]+[.]+[a-zA-Z-.]{1,}$/,
        "Invalid Email Address"
      ),
    password: Yup.string()
      .trim()
      .min(8, "Minimum 8 characters required")
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
        "Must Contain atleast one Uppercase, one Lowercase, one Number and one special case Character"
      ),
    password2: Yup.string()
      .trim()
      .min(8, "Minimum 8 characters required")
      .required("Repeat Password is required")
      .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);

      try {
        setSubmitting(true);
        values.email = values.email.toLowerCase();
        await axios
          .post("http://localhost:8000/signup", {
            username: values.username.trim(),
            email: values.email.toLowerCase().trim(),
            password: values.password.trim(),
            password2: values.password2.trim(),
          })
          .then((res) => {
            console.log(res);
            resetForm();
            toast.success("SignUp completed");
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
            setSubmitting(false);
            toast.error(error?.response?.data?.username);
          })
          .finally(() => {
            setSubmitting(false);
          });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [userToken]);

  return (
    <div className="Auth-form-container">
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign Up</h3>
            <div className="text-center">
              Already registered?
              <button
                className="btn btn-link"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log In
              </button>
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                {...getFieldProps("username")}
                autoComplete="off"
                className="form-control bg-transparent"
              />
              {formik.touched.username && formik.errors.username ? (
                <div
                  className="form-error"
                  style={{ fontSize: 12, color: "red" }}
                >
                  {formik.errors.username}*
                </div>
              ) : null}
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="text"
                placeholder="Email"
                {...getFieldProps("email")}
                autoComplete="off"
                className="form-control bg-transparent"
              />
              {formik.touched.email && formik.errors.email ? (
                <div
                  className="form-error"
                  style={{ fontSize: 12, color: "red" }}
                >
                  {formik.errors.email}*
                </div>
              ) : null}
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                {...getFieldProps("password")}
                autoComplete="off"
                className="form-control bg-transparent"
              />
              {formik.touched.password && formik.errors.password ? (
                <div
                  className="form-error"
                  style={{ fontSize: 12, color: "red", width: "22rem" }}
                >
                  {formik.errors.password}*
                </div>
              ) : null}
            </div>
            <div className="form-group mt-3">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                {...getFieldProps("password2")}
                autoComplete="off"
                className="form-control bg-transparent"
              />
              {formik.touched.password2 && formik.errors.password2 ? (
                <div
                  className="form-error"
                  style={{ fontSize: 12, color: "red", width: "22rem" }}
                >
                  {formik.errors.password2}*
                </div>
              ) : null}
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                id="kt_sign_in_submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting && (
                  <span
                    className="spinner-border spinner-border-sm mx-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {submitting ? "Please Wait..." : "Sign Up"}
              </button>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};
export default SignUp;
