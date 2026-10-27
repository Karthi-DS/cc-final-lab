const API_BASE = "/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || errorData.details || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const api = {
  // Food Items CRUD
  async getFoods(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== "All") searchParams.append("category", params.category);
    if (params.search) searchParams.append("search", params.search);
    if (params.isVegetarian !== undefined && params.isVegetarian !== "") searchParams.append("isVegetarian", params.isVegetarian);
    if (params.isAvailable !== undefined && params.isAvailable !== "") searchParams.append("isAvailable", params.isAvailable);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);

    const queryString = searchParams.toString();
    const url = `${API_BASE}/foods${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getFoodById(id) {
    const res = await fetch(`${API_BASE}/foods/${id}`);
    return handleResponse(res);
  },

  async createFood(data) {
    const res = await fetch(`${API_BASE}/foods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateFood(id, data) {
    const res = await fetch(`${API_BASE}/foods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async toggleFoodAvailability(id) {
    const res = await fetch(`${API_BASE}/foods/${id}/toggle-availability`, {
      method: "PATCH",
    });
    return handleResponse(res);
  },

  async deleteFood(id) {
    const res = await fetch(`${API_BASE}/foods/${id}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },

  // Customer Orders CRUD
  async getOrders(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== "All") searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const url = `${API_BASE}/orders${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return handleResponse(res);
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async updateOrder(id, orderData) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },

  // Analytics / Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return handleResponse(res);
  },
};
