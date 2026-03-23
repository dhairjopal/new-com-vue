const routes = [
  // Common Panel
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UserPanel/HomePage.vue") },
      {
        path: "cart",
        component: () => import("pages/UserPanel/MyCart.vue"),
      },
      {
        path: "place-order",
        component: () => import("pages/UserPanel/PlaceOrder.vue"),
      },
      {
        path: "product:/id",
        component: () => import("pages/UserPanel/SingleProducts.vue"),
      },
    ],
  },
  // User Panel
  {
    path: "/user",
    component: () => import("layouts/UserLayout.vue"),
    children: [
      {
        path: "my-address",
        component: () => import("pages/UserPanel/MyAddress.vue"),
      },
      {
        path: "my-order",
        component: () => import("pages/UserPanel/MyOrders.vue"),
      },
      {
        path: "my-profile",
        component: () => import("pages/UserPanel/MyProfile.vue"),
      },
    ],
  },
  // Admin Panel
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/SuperAdmin/Dashboard.vue"),
      },
      {
        path: "all-orders",
        component: () => import("pages/SuperAdmin/AllOrders.vue"),
      },
      {
        path: "all-products",
        component: () => import("pages/SuperAdmin/AllProducts.vue"),
      },
      {
        path: "all-users",
        component: () => import("pages/SuperAdmin/AllUsers.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
