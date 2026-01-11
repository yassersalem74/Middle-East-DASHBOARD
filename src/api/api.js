import axios from "axios";

const BASE_URL = "https://middleeastseven.runasp.net/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

// ===== Categories =====
export const CategoriesAPI = {
  getAll: () => api.get("/Categories"),
  create: (data) => api.post("/Categories", data),
  update: (id, data) => api.put(`/Categories/${id}`, data),
  delete: (id) => api.delete(`/Categories/${id}`)
};

// ===== Products =====
export const ProductsAPI = {
  getAll: () => api.get("/Products"),
  create: (formData) =>
    api.post("/Products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/Products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/Products/${id}`)
};

// ===== Industries =====
export const IndustriesAPI = {
  getAll: () => api.get("/Industries"),
  create: (formData) =>
    api.post("/Industries", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/Industries/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/Industries/${id}`)
};



// ===== Exhibitions =====
export const ExhibitionsAPI = {
  getAll: () => api.get("/Exhibitions"),
  create: (formData) =>
    api.post("/Exhibitions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/Exhibitions/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/Exhibitions/${id}`)
};


// ===== Slider Images =====
export const SliderImagesAPI = {
  getAll: () => api.get("/SliderImages"),
  create: (formData) =>
    api.post("/SliderImages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/SliderImages/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/SliderImages/${id}`)
};


// ===== Team Members =====
export const TeamMembersAPI = {
  getAll: () => api.get("/TeamMembers"),
  create: (formData) =>
    api.post("/TeamMembers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/TeamMembers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/TeamMembers/${id}`)
};
