import { useRef, useState } from "react";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import axios from "axios";
import { useAuthState } from "../state/useAuthState";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddTaskModal = ({ taskData }: any) => {
  const navigate = useNavigate();
  const { userToken, fetchTasks } = useAuthState();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const TaskSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string().trim().required("Desciption is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: taskData?.title || "",
      description: taskData?.description || "",
    },
    validationSchema: TaskSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        if (taskData?.id) {
          await axios
            .put("http://localhost:8000/tasks/" + taskData?.id + "/", values, {
              headers: {
                Authorization: `Token ${userToken}`,
              },
            })
            .then((res) => {
              toast.success("Task up0dated succesfully");
              resetForm();
              setSubmitting(false);
              modalRef?.current?.click();
            })
            .catch((error) => {
              toast.error("Something went wrong");
              console.log(error);
            });
        } else {
          await axios
            .post("http://localhost:8000/tasks/", values, {
              headers: {
                Authorization: `Token ${userToken}`,
              },
            })
            .then((res) => {
              toast.success("Task created succesfully");
              resetForm();
              setSubmitting(false);
              modalRef?.current?.click();
            })
            .catch((error) => {
              toast.error("Something went wrong");
              console.log(error);
            });
        }
      } catch (error) {
        resetForm();
        setSubmitting(false);
      } finally {
        fetchTasks();
      }
    },
    enableReinitialize: true,
  });
  const { getFieldProps, handleSubmit } = formik;

  return (
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header d-flex justify-content-between">
          <h3 className="modal-title">
            {taskData?.id ? "Edit Task" : "New Task"}
          </h3>
          <div
            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            ref={modalRef}
            aria-label="Close"
            onClick={() => formik.resetForm()}
          >
            <i className="bi bi-x h3">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </div>
        </div>
        <div className="modal-body">
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <div className="Auth-form-content">
                <div className="form-group mt-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    {...getFieldProps("title")}
                    autoComplete="off"
                    className="form-control bg-transparent"
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.title}*
                    </div>
                  ) : null}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Description</label>
                  <textarea
                    placeholder="Desciption"
                    data-kt-autosize="true"
                    {...getFieldProps("description")}
                    className="form-control form-control form-control-solid"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div
                      className="form-error"
                      style={{ fontSize: 12, color: "red" }}
                    >
                      {formik.errors.description}*
                    </div>
                  ) : null}
                </div>
                <div className="d-grid gap-2 my-3">
                  <button
                    type="submit"
                    id="kt_submit"
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
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
