import { useEffect, useState } from "react";
import { CategoriesAPI } from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // ===== Loading States =====
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ===== Load Data =====
  const loadCategories = async () => {
    setLoadingTable(true);
    const res = await CategoriesAPI.getAll();
    setCategories(res.data);
    setLoadingTable(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await CategoriesAPI.getAll();
        if (mounted) {
          setCategories(res.data);
          setLoadingTable(false);
        }
      } catch {
        setLoadingTable(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // ===== Create =====
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoadingAdd(true);
    await CategoriesAPI.create({ title: title.trim() });
    setTitle("");
    await loadCategories();
    setLoadingAdd(false);
  };

  // ===== Update =====
  const handleUpdate = async () => {
    setLoadingEdit(true);
    await CategoriesAPI.update(editItem.id, {
      title: editItem.title.trim(),
    });
    setEditItem(null);
    await loadCategories();
    setLoadingEdit(false);
  };

  // ===== Delete =====
  const handleDelete = async () => {
    setLoadingDelete(true);
    await CategoriesAPI.delete(deleteItem.id);
    setDeleteItem(null);
    await loadCategories();
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* ===== Add Form ===== */}
      <form
        onSubmit={handleCreate}
        className="card bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white- p-4 max-w-xl"
      >
        <h2 className="font-bold text-lg mb-3">Add Category</h2>

        <input
          type="text"
          className="input input-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Category title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="btn btn-success mt-3" disabled={loadingAdd}>
          {loadingAdd ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Add"
          )}
        </button>
      </form>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow rounded">
        <table className="table">
          <thead>
            <tr className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
              <th>ID</th>
              <th>Title</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="3" className="text-center py-6">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
                  <td>{cat.id}</td>
                  <td>{cat.title}</td>
                  <td className="text-right space-x-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setEditItem(cat)}
                      disabled={loadingEdit || loadingDelete}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => setDeleteItem(cat)}
                      disabled={loadingEdit || loadingDelete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Edit Modal ===== */}
      {editItem && (
        <div className="modal modal-open bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">Edit Category</h3>

            <input
              className="input input-bordered w-full bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.title}
              onChange={(e) =>
                setEditItem({ ...editItem, title: e.target.value })
              }
            />

            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={loadingEdit}
              >
                {loadingEdit ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save"
                )}
              </button>
              <button className="btn" onClick={() => setEditItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Modal ===== */}
      {deleteItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Category</h3>
            <p className="py-4">
              Are you sure you want to delete
              <span className="font-bold"> {deleteItem.title}</span> ?
            </p>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Delete"
                )}
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
