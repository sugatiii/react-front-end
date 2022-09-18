import React, { useState, useMemo, useEffect, useContext } from "react";
import Navbar from "./components/navbar/navbar";

import axios from "axios";
import Table from "./components/table/table";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const GlobalState = React.createContext();

function Dashboard() {
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "no",
      },
      {
        Header: "Avatar",
        accessor: "avatar",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "DOB",
        accessor: "dob",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );
  let [data, setData] = useState([]);
  let [showAdd, setShowAdd] = useState(false);
  let [showEdit, setShowEdit] = useState(false);
  let [modalContent, setModalContent] = useState({});
  let [mst, setMst] = useState({
    name: "",
    gender: "",
    dob: "",
    image: "",
  });

  const refreshData = () => {
    axios
      .get(`http://localhost:8000/api/students`)
      .then(function (res) {
        setData(
          res.data.map((item, index) => {
            return {
              no: index + 1,
              avatar: (
                <>
                  <img
                    src={`http://localhost:8000/uploads/${item.avatar}`}
                    width={100}
                    height={100}
                    className=" object-contain"
                    // alt='Netflix Logo'
                  />
                </>
              ),
              name: item.name,
              gender: item.gender,
              dob: item.DOB,
              actions: (
                <>
                  <button
                    className="btn btn-link"
                    title="Edit"
                    onClick={() => handleOpenEdit(item.id)}
                  >
                    <i className="fas fa-edit fa-lg"></i>
                  </button>
                  <button
                    className="btn btn-link text-danger"
                    title="Delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fas fa-trash-alt fa-lg"></i>
                  </button>
                </>
              ),
            };
          })
        );
      })
      .catch(function (err) {
        console.log("DB Error -> " + err);
        return err;
      });
  };

  const handleOpenAdd = async () => {
    await setShowAdd(true);
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
  };

  const handleCloseEdit = () => {
    setMst({
      ...mst,
      name: "",
      gender: "",
      dob: "",
      image: "",
    });
    setShowEdit(false);
  };

  const hanldeChange = (e) => {
    if (e.target.name === "image") {
      setMst({ ...mst, [e.target.name]: e.target.files[0] });
      // }
    } else {
      setMst({ ...mst, [e.target.name]: e.target.value });
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();
    if (!mst.name || !mst.gender || !mst.dob || !mst.image) {
      Swal.fire({
        icon: "warning",
        title: "isi terlebih dahulu",
        timer: 1000,
      });
      return false;
    } else {
      if (mst.image) {
        if (!mst.image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
          Swal.fire({
            icon: "warning",
            title: "FIle harus berformat JPG,PNG",
            timer: 1000,
          });
          return false;
        }
      }
    }

    const data = new FormData();
    data.append("images", mst.image);
    data.append("name", mst.name);
    data.append("gender", mst.gender);
    data.append("dob", mst.dob);

    axios
      .post("http://localhost:8000/api/students", data)
      .then((res) => {
        refreshData();
        setMst({
          ...mst,
          name: "",
          gender: "",
          dob: "",
          image: "",
        });
        setShowAdd(false);
      })
      .catch((err) => {
        console.log("Insert failed -> " + err);
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (mst.image) {
      if (!mst.image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        Swal.fire({
          icon: "warning",
          title: "FIle harus berformat JPG,PNG",
          timer: 1000,
        });
        return false;
      }
    }

    const data = new FormData();
    data.append("images", mst.image);
    data.append("name", mst.name);
    data.append("gender", mst.gender);
    data.append("dob", mst.dob);

    axios
      .post(`http://localhost:8000/api/students/${modalContent.id}`, data)
      .then((res) => {
        refreshData();
        setMst({
          ...mst,
          name: "",
          gender: "",
          dob: "",
          image: "",
        });
        setShowEdit(false);
      })
      .catch((err) => {
        console.log("Insert failed -> " + err);
      });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda Yakin?",
      text: `Ingin menghapus data`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/students/${id}`)
          .then((res) => {
            refreshData();
            Swal.fire({
              icon: "success",
              title: "Berhasil delete data",
              timer: 1000,
            });
            setShowEdit(false);
          })
          .catch((err) => {
            console.log("Insert failed -> " + err);
          });
      }
    });
  };

  const handleOpenEdit = async (id) => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/students/${id}`,
    })
      .then((res) => {
        setModalContent(res.data);
        setMst({
          ...mst,
          name: res.data.name,
          gender: res.data.gender,
          dob: res.data.DOB,
          image: "",
        });
        setShowEdit(true);
      })
      .catch((err) => {
        console.log("Insert failed -> " + err);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    console.log(mst);
  }, [mst]);

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-10">
        <Navbar />
        <button
          className="btn btn-sm btn-primary mt-10"
          onClick={handleOpenAdd}
        >
          Tambah Data
        </button>
        <div className="mt-2">
          <Table columns={columns} data={data}></Table>
        </div>
      </div>
      <GlobalState.Provider
        value={{
          mst,
          modalContent,
          showAdd,
          showEdit,
          handleCloseAdd,
          handleCloseEdit,
          handleInsert,
          hanldeChange,
          handleUpdate,
        }}
      >
        <ModalAdd></ModalAdd>
        <ModalEdit></ModalEdit>
      </GlobalState.Provider>
    </>
  );
}

function ModalAdd() {
  let { showAdd, handleCloseAdd, handleInsert, hanldeChange } =
    useContext(GlobalState);

  return (
    <>
      <Modal backdrop="static" size="lg" show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="nama lengkap"
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  defaultValue=""
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                >
                  <option value="" disabled>
                    {" "}
                    -- Pilih --{" "}
                  </option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date Of Birth</Form.Label>
                <Form.Control
                  name="dob"
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                  type="date"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  name="image"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                  type="file"
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            // disabled={disableModalButton}
            className="btn btn-sm btn-primary"
            onClick={handleInsert}
          >
            Save
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleCloseAdd}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ModalEdit() {
  let {
    mst,
    modalContent,
    showEdit,
    handleCloseEdit,
    hanldeChange,
    handleUpdate,
  } = useContext(GlobalState);

  return (
    <>
      <Modal
        backdrop="static"
        size="lg"
        show={showEdit}
        onHide={handleCloseEdit}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  defaultValue={modalContent.name}
                  placeholder="nama lengkap"
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  defaultValue={modalContent.gender}
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                >
                  <option value="" disabled>
                    {" "}
                    -- Pilih --{" "}
                  </option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date Of Birth</Form.Label>
                <Form.Control
                  name="dob"
                  defaultValue={modalContent.DOB}
                  onChange={(e) => {
                    hanldeChange(e);
                  }}
                  type="date"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <div className="custom-file">
                  <label
                    htmlFor="ktp"
                    className="custom-file-label"
                    data-bs-browse="ktp"
                  >
                    {mst.image.name
                      ? mst.image.name
                      : modalContent.avatar
                      ? modalContent.avatar
                      : "No File Selected"}
                  </label>
                  <input
                    className="custom-file-input"
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      hanldeChange(e);
                    }}
                  />
                </div>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            // disabled={disableModalButton}
            className="btn btn-sm btn-primary"
            onClick={handleUpdate}
          >
            Save
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleCloseEdit}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
