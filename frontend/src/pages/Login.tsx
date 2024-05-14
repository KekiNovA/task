import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../state/useAuthState";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";

const Login = () => {
  const navigate = useNavigate();
  const { userToken, login } = useAuthState();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().trim().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        await login(values)
          .then((res) => {
            setSubmitting(false);
            resetForm();
            navigate("/");
          })
          .catch((error) => {
            alert(error?.response?.data?.errors?.error[0]);
            setSubmitting(false);
            resetForm();
          });
      } catch (error) {
        resetForm();
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [userToken]);

  const { getFieldProps, handleSubmit } = formik;
  return (
    <div className="Auth-form-container">
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Log In</h3>
            <div className="text-center">
              Not registered yet?
              <button
                className="btn btn-link"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </button>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="username">Username</label>
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
              <label htmlFor="password">Password</label>
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
                  style={{ fontSize: 12, color: "red" }}
                >
                  {formik.errors.password}*
                </div>
              ) : null}
            </div>
            <div className="d-grid gap-2 my-3">
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
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default Login;
