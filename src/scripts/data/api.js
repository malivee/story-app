import { getApiHeaders, removeApiHeaders } from "./apiHeaders.js";
import CONFIG from "../config.js";

const ENDPOINTS = {
  home: `${CONFIG.BASE_URL}/stories`,
  login: `${CONFIG.BASE_URL}/login`,
  register: `${CONFIG.BASE_URL}/register`,
  postStory: `${CONFIG.BASE_URL}/stories`,
  notification: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export default class Api {
  async getData() {
    const fetchResponse = await fetch(ENDPOINTS.home, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getApiHeaders()}`,
      },
    });

    if (!fetchResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await fetchResponse.json();
    return data;
  }

  async postLogin(email, password) {
    const response = await fetch(ENDPOINTS.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  }

  async postRegister(name, email, password) {
    const response = await fetch(ENDPOINTS.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Register failed");
    }

    return await response.json();
  }

  async postRegister(name, email, password) {
    const response = await fetch(ENDPOINTS.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Register failed");
    }

    return await response.json();
  }

  async postNewStory(description, photoFile, lat = null, lon = null) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photoFile);
    if (lat !== null && lon !== null) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.postStory, {
      method: "POST",
      headers: {
        Authorization: `${getApiHeaders()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    return await response.json();
  }

  async deleteData() {
    removeApiHeaders();
  }

  async subscribeToNotifications(subscription) {
    const response = await fetch(ENDPOINTS.notification, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getApiHeaders()}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Subscription failed");
    }

    return await response.json();
  }

  async unsubscribeFromNotifications(subscription) {
    const response = await fetch(ENDPOINTS.notification, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getApiHeaders()}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unsubscription failed");
    }

    return await response.json();
  }
}
