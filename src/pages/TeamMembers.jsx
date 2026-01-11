import { useEffect, useState } from "react";
import { TeamMembersAPI } from "../api/api";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 10 * 1024 * 1024;

export default function TeamMembers() {
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    position: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Loading states
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ===== Load =====
  const loadMembers = async () => {
    setLoadingTable(true);
    const res = await TeamMembersAPI.getAll();
    setMembers(res.data);
    setLoadingTable(false);
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const res = await TeamMembersAPI.getAll();
      if (mounted) {
        setMembers(res.data);
        setLoadingTable(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  // ===== Form Change =====
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===== Image Validation =====
  const handleImage = (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type))
      return alert("Only jpeg, png, webp allowed");

    if (file.size > maxBytes)
      return alert("Image must be under 10MB");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ===== CREATE =====
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Image is required");

    setLoadingAdd(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("position", form.position);
    data.append("image", imageFile);

    // Backend-safe call
    try { await TeamMembersAPI.create(data); } catch {
      console.log("error")
    }

    setForm({ name: "", position: "" });
    setImageFile(null);
    setImagePreview(null);

    await loadMembers();
    setLoadingAdd(false);
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    setLoadingEdit(true);

    const data = new FormData();
    data.append("name", editItem.name);
    data.append("position", editItem.position);

    if (imageFile) data.append("image", imageFile);

    try { await TeamMembersAPI.update(editItem.id, data); } catch {
      console.log("error")
    }

    setEditItem(null);
    setImageFile(null);
    setImagePreview(null);

    await loadMembers();
    setLoadingEdit(false);
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    setLoadingDelete(true);
    await TeamMembersAPI.delete(deleteItem.id);
    setDeleteItem(null);
    await loadMembers();
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 space-y-6">

      {/* ===== ADD FORM ===== */}
      <form onSubmit={handleCreate} className="card  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow p-4 max-w-xl">
        <h2 className="font-bold text-lg mb-3">Add Team Member</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full mb-2 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Name"
        />

        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="input input-bordered w-full mb-2 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Position"
        />

        <input
          type="file"
          className="file-input file-input-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {imagePreview && (
          <img src={imagePreview} className="w-24 mt-3 rounded" />
        )}

        <button className="btn btn-success mt-3" disabled={loadingAdd}>
          {loadingAdd ? <span className="loading loading-spinner"></span> : "Add Member"}
        </button>
      </form>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow rounded">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <tr >
                <td colSpan="5" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
                  <td>{m.id}</td>
                  <td>
                    <img src={m.imageUrl} className="w-12 rounded" />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.position}</td>
                  <td className="space-x-2">
                    <button className="btn btn-xs btn-info" onClick={() => setEditItem(m)}>
                      Edit
                    </button>
                    <button className="btn btn-xs btn-error" onClick={() => setDeleteItem(m)}>
                      Delete
                    </button>
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
            <h3 className="font-bold text-lg mb-3">Edit Team Member</h3>

            <input
              className="input input-bordered w-full mb-2 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />

            <input
              className="input input-bordered w-full mb-2 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.position}
              onChange={(e) =>
                setEditItem({ ...editItem, position: e.target.value })
              }
            />

            <input
              type="file"
              className="file-input file-input-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              onChange={(e) => handleImage(e.target.files[0])}
            />

            <img
              src={imagePreview ? imagePreview : editItem.imageUrl}
              className="w-24 mt-3 rounded"
            />

            <div className="modal-action">
              <button className="btn btn-success" onClick={handleUpdate} disabled={loadingEdit}>
                {loadingEdit ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
              <button className="btn" onClick={() => setEditItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {deleteItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Member</h3>
            <p className="py-4">
              Are you sure you want to delete <b>{deleteItem.name}</b>?
            </p>

            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete} disabled={loadingDelete}>
                {loadingDelete ? <span className="loading loading-spinner"></span> : "Delete"}
              </button>
              <button className="btn" onClick={() => setDeleteItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
