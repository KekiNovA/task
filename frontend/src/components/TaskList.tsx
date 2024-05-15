import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import { useAuthState } from "../state/useAuthState";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const TaskList = () => {
  const { userToken, tasks, fetchTasks } = useAuthState();
  const [items, setItems] = useState(tasks);
  const [taskData, setTaskData] = useState<any>(tasks);
  const handleDelete = async (id: string) => {
    await axios
      .delete(`${API_URL}/tasks/` + id + "/", {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((res) => {
        toast.success("Task deleted successfully");
        fetchTasks();
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log("error in delete");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    setItems(tasks);
  }, [tasks]);
  return (
    <>
      <div className="container">
        <div className="col-12 text-end">
          <a
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#new-task"
            className="btn btn-primary mb-3"
          >
            New Task
          </a>
        </div>
      </div>
      {items && items.length > 0 ? (
        <div className="container py-2 ">
          {items?.map((elem: any) => {
            return (
              <div
                className="row border rounded shadow p-3 mb-3 bg-white rounded  p-2"
                key={elem?.id}
              >
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div>
                    <h4>{elem?.title}</h4>
                    <p>{elem?.description}</p>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary mx-2"
                      onClick={() => {
                        setTaskData(elem);
                        console.log(taskData);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#edit-task"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(elem?.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <h3>Create task to get started</h3>
        </div>
      )}
      <div className="modal fade" tabIndex={-1} id="new-task">
        <AddTaskModal />
      </div>
      <div className="modal fade" tabIndex={-1} id="edit-task">
        <AddTaskModal taskData={taskData} />
      </div>
    </>
  );
};

export default TaskList;
