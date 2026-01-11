import { useEffect, useState } from "react";
import { ProductsAPI, CategoriesAPI } from "../api/api";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 10 * 1024 * 1024;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    casNumber: "",
    purity: "",
    grade: "",
    quantity: "",
    categoryId: "",
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
  const loadProducts = async () => {
    setLoadingTable(true);
    const res = await ProductsAPI.getAll();
    setProducts(res.data);
    setLoadingTable(false);
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        ProductsAPI.getAll(),
        CategoriesAPI.getAll(),
      ]);

      if (mounted) {
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setLoadingTable(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  // ===== Helpers =====
  const handleImage = (file) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) return alert("Only jpeg, png, webp");
    if (file.size > maxBytes) return alert("Max 10MB");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ===== CREATE =====
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Image required");

    setLoadingAdd(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== "") data.append(key, val);
    });
    data.append("image", imageFile);

    try {
      await ProductsAPI.create(data);
    } catch {
      console.log("error");
    }

    setForm({
      title: "",
      description: "",
      casNumber: "",
      purity: "",
      grade: "",
      quantity: "",
      categoryId: "",
    });
    setImageFile(null);
    setImagePreview(null);

    await loadProducts();
    setLoadingAdd(false);
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    setLoadingEdit(true);

    const data = new FormData();
    Object.entries(editItem).forEach(([key, val]) => {
      if (
        val !== null &&
        val !== "" &&
        key !== "id" &&
        key !== "imageUrl" &&
        key !== "imagePublicId" &&
        key !== "category"
      ) {
        data.append(key, val);
      }
    });

    if (imageFile) data.append("image", imageFile);

    try {
      await ProductsAPI.update(editItem.id, data);
    } catch {
      console.log("error");
    }

    setEditItem(null);
    setImageFile(null);
    setImagePreview(null);

    await loadProducts();
    setLoadingEdit(false);
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    setLoadingDelete(true);
    await ProductsAPI.delete(deleteItem.id);
    setDeleteItem(null);
    await loadProducts();
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* ===== ADD FORM ===== */}
      <form
        onSubmit={handleCreate}
        className="card  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white shadow p-4"
      >
        <h2 className="font-bold text-lg mb-3">Add Product</h2>

        <div className="grid md:grid-cols-3 gap-3">
          {["title", "casNumber", "purity", "grade", "quantity"].map(
            (field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="input input-bordered bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                placeholder={field}
              />
            )
          )}

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="
                  select select-bordered w-full
                  bg-[#0B1F2A]
                  text-white
                  border border-white/20
                  focus:border-emerald-400
                "
          >
            <option value="" className="bg-[#0B1F2A] text-white">
              Select Category
            </option>

            {categories.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="bg-[#0B1F2A] text-white"
              >
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="textarea textarea-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          className="file-input file-input-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {imagePreview && (
          <img src={imagePreview} className="w-24 mt-3 rounded" />
        )}

        <button className="btn btn-success mt-3" disabled={loadingAdd}>
          {loadingAdd ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Add Product"
          )}
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
              <th>CAS</th>
              <th>Purity</th>
              <th>Grade</th>
              <th>Qty</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingTable ? (
              <tr>
                <td colSpan="10" className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                >
                  <td>{p.id}</td>
                  <td>
                    <img src={p.imageUrl} className="w-12 rounded" />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>{p.casNumber}</td>
                  <td>{p.purity}</td>
                  <td>{p.grade}</td>
                  <td>{p.quantity}</td>
                  <td>{p.category?.title}</td>
                  <td className="space-x-1">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => setEditItem(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => setDeleteItem(p)}
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

      {/* ===== EDIT MODAL ===== */}
      {editItem && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-3">Edit Product</h3>

            <div className="grid md:grid-cols-3 gap-3">
              {["title", "casNumber", "purity", "grade", "quantity"].map(
                (field) => (
                  <input
                    key={field}
                    className="input input-bordered bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                    value={editItem[field] || ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, [field]: e.target.value })
                    }
                    placeholder={field}
                  />
                )
              )}

              <select
                className="select select-bordered  bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                value={editItem.categoryId || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, categoryId: e.target.value })
                }
              >
                <option
                  value=""
                  className=" bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                >
                  Select Category
                </option>
                {categories.map((c) => (
                  <option
                    className=" bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
                    key={c.id}
                    value={c.id}
                  >
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="textarea textarea-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              value={editItem.description || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
            />

            <input
              type="file"
              className="file-input file-input-bordered w-full mt-3 bg-gradient-to-r from-[#0F3D2E] via-[#0B1F2A] to-[#0A1B25] text-white"
              onChange={(e) => handleImage(e.target.files[0])}
            />

            <img
              src={imagePreview ? imagePreview : editItem.imageUrl}
              className="w-24 mt-3 rounded"
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

      {/* ===== DELETE MODAL ===== */}
      {deleteItem && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Product</h3>
            <p className="py-4">
              Delete <b>{deleteItem.title}</b>?
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
