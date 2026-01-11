import { useEffect, useState } from "react";
import { ExhibitionsAPI } from "../api/api";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 10 * 1024 * 1024;

export default function Exhibition() {
  const [exhibitions, setExhibitions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    exhibitionType: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ===== Load =====
  const loadExhibitions = async () => {
    setLoadingTable(true);
    const res = await ExhibitionsAPI.getAll();
    setExhibitions(res.data);
    setLoadingTable(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const res = await ExhibitionsAPI.getAll();
      if (mounted) {
        setExhibitions(res.data);
        setLoadingTable(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  // ===== Image =====
  const handleImage = (file) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) return alert("Only jpeg, png, webp allowed");
    if (file.size > maxBytes) return alert("Max 10MB");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ===== Form change =====
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== CREATE =====
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Image required");

    setLoadingAdd(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("date", form.date);
    data.append("location", form.location);
    data.append("exhibitionType", form.exhibitionType);
    data.append("image", imageFile);

    try { await ExhibitionsAPI.create(data); } catch {
      console.log("error")
    }

    setForm({ title: "", date: "", location: "", exhibitionType: "" });
    setImageFile(null);
    setImagePreview(null);

    await loadExhibitions();
    setLoadingAdd(false);
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    setLoadingEdit(true);

    const data = new FormData();
    data.append("title", editItem.title);
    data.append("date", editItem.date);
    data.append("location", editItem.location);
    data.append("exhibitionType", editItem.exhibitionType);

    if (imageFile) data.append("image", imageFile);

    try { await ExhibitionsAPI.update(editItem.id, data); } catch {
      console.log("error")
    }

    setEditItem(null);
    setImageFile(null);
    setImagePreview(null);

    await loadExhibitions();
    setLoadingEdit(false);
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    setLoadingDelete(true);
    await ExhibitionsAPI.delete(deleteItem.id);
    setDeleteItem(null);
    await loadExhibitions();
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 space-y-6">

      {/* ===== ADD FORM ===== */}
      <form onSubmit={handleCreate} className="card bg-base-100 shadow p-4 max-w-3xl">
        <h2 className="font-bold text-lg mb-3">Add Exhibition</h2>

        <div className="grid md:grid-cols-2 gap-3">
          <input name="title" value={form.title} onChange={handleFormChange}
            className="input input-bordered" placeholder="Title" />

          <input type="date" name="date" value={form.date} onChange={handleFormChange}
            className="input input-bordered" />

          <input name="location" value={form.location} onChange={handleFormChange}
            className="input input-bordered" placeholder="Location" />

          <input name="exhibitionType" value={form.exhibitionType} onChange={handleFormChange}
            className="input input-bordered" placeholder="Exhibition Type" />
        </div>

        <input type="file"
          className="file-input file-input-bordered w-full mt-3"
          onChange={(e)=>handleImage(e.target.files[0])}
        />

        {imagePreview && <img src={imagePreview} className="w-28 mt-3 rounded" />}

        <button className="btn btn-success mt-3" disabled={loadingAdd}>
          {loadingAdd ? <span className="loading loading-spinner"></span> : "Add Exhibition"}
        </button>
      </form>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto bg-base-100 shadow rounded">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              exhibitions.map((e)=>(
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td><img src={e.imageUrl} className="w-14 rounded"/></td>
                  <td>{e.title}</td>
                  <td>{e.date?.split("T")[0]}</td>
                  <td>{e.location}</td>
                  <td>{e.exhibitionType}</td>
                  <td className="space-x-2">
                    <button className="btn btn-xs btn-info" onClick={()=>setEditItem(e)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={()=>setDeleteItem(e)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">Edit Exhibition</h3>

            <input className="input input-bordered w-full mb-2"
              value={editItem.title}
              onChange={(e)=>setEditItem({...editItem,title:e.target.value})}
            />

            <input type="date" className="input input-bordered w-full mb-2"
              value={editItem.date?.split("T")[0]}
              onChange={(e)=>setEditItem({...editItem,date:e.target.value})}
            />

            <input className="input input-bordered w-full mb-2"
              value={editItem.location}
              onChange={(e)=>setEditItem({...editItem,location:e.target.value})}
            />

            <input className="input input-bordered w-full mb-2"
              value={editItem.exhibitionType}
              onChange={(e)=>setEditItem({...editItem,exhibitionType:e.target.value})}
            />

            <input type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e)=>handleImage(e.target.files[0])}
            />

            <img src={imagePreview ? imagePreview : editItem.imageUrl}
              className="w-28 mt-3 rounded"
            />

            <div className="modal-action">
              <button className="btn btn-success" onClick={handleUpdate} disabled={loadingEdit}>
                {loadingEdit ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
              <button className="btn" onClick={()=>setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {deleteItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Exhibition</h3>
            <p className="py-4">Delete <b>{deleteItem.title}</b>?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete} disabled={loadingDelete}>
                {loadingDelete ? <span className="loading loading-spinner"></span> : "Delete"}
              </button>
              <button className="btn" onClick={()=>setDeleteItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
