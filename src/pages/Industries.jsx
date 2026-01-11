import { useEffect, useState } from "react";
import { IndustriesAPI } from "../api/api";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 10 * 1024 * 1024;

export default function Industries() {
  const [industries, setIndustries] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: ""
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
  const loadIndustries = async () => {
    setLoadingTable(true);
    const res = await IndustriesAPI.getAll();
    setIndustries(res.data);
    setLoadingTable(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const res = await IndustriesAPI.getAll();
      if (mounted) {
        setIndustries(res.data);
        setLoadingTable(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  // ===== Image =====
  const handleImage = (file) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) return alert("Only jpeg, png, webp");
    if (file.size > maxBytes) return alert("Max 10MB");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ===== Create =====
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Image required");

    setLoadingAdd(true);

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("image", imageFile);

    try {
      await IndustriesAPI.create(data);
    } catch {
      console.log("error")
    }

    setForm({ title: "", description: "" });
    setImageFile(null);
    setImagePreview(null);

    await loadIndustries();
    setLoadingAdd(false);
  };

  // ===== Update =====
  const handleUpdate = async () => {
    setLoadingEdit(true);

    const data = new FormData();
    data.append("title", editItem.title);
    data.append("description", editItem.description);

    if (imageFile) data.append("image", imageFile);

    try {
      await IndustriesAPI.update(editItem.id, data);
    } catch {
      console.log("error")
    }

    setEditItem(null);
    setImageFile(null);
    setImagePreview(null);

    await loadIndustries();
    setLoadingEdit(false);
  };

  // ===== Delete =====
  const handleDelete = async () => {
    setLoadingDelete(true);
    await IndustriesAPI.delete(deleteItem.id);
    setDeleteItem(null);
    await loadIndustries();
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 space-y-6">

      {/* ===== ADD FORM ===== */}
      <form onSubmit={handleCreate} className="card  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow p-4 max-w-2xl">
        <h2 className="font-bold text-lg mb-3">Add Industry</h2>

        <input
          className="input input-bordered w-full mb-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Title"
          value={form.title}
          onChange={(e)=>setForm({...form,title:e.target.value})}
        />

        <textarea
          className="textarea textarea-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Description"
          value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})}
        />

        <input type="file"
          className="file-input file-input-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          onChange={(e)=>handleImage(e.target.files[0])}
        />

        {imagePreview && <img src={imagePreview} className="w-24 mt-3 rounded" />}

        <button className="btn btn-success mt-3" disabled={loadingAdd}>
          {loadingAdd ? <span className="loading loading-spinner"></span> : "Add Industry"}
        </button>
      </form>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow rounded">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              industries.map((i)=>(
                <tr key={i.id} className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
                  <td>{i.id}</td>
                  <td><img src={i.imageUrl} className="w-14 rounded"/></td>
                  <td>{i.title}</td>
                  <td>{i.description}</td>
                  <td className="space-x-2">
                    <button className="btn btn-xs btn-info" onClick={()=>setEditItem(i)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={()=>setDeleteItem(i)}>Delete</button>
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
            <h3 className="font-bold text-lg mb-3">Edit Industry</h3>

            <input
              className="input input-bordered w-full mb-2 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.title}
              onChange={(e)=>setEditItem({...editItem,title:e.target.value})}
            />

            <textarea
              className="textarea textarea-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.description}
              onChange={(e)=>setEditItem({...editItem,description:e.target.value})}
            />

            <input type="file"
              className="file-input file-input-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              onChange={(e)=>handleImage(e.target.files[0])}
            />

            <img
              src={imagePreview ? imagePreview : editItem.imageUrl}
              className="w-24 mt-3 rounded"
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
            <h3 className="font-bold text-lg">Delete Industry</h3>
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
