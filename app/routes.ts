import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
  route("forms", "routes/FormList.tsx"),
  route("forms/new", "routes/CreateForm.tsx"),
  route("forms/:id/edit", "routes/EditForm.tsx"),
  route("forms/:id/responses", "routes/FormResponses.tsx"),
  route("forms/:id", "routes/FormDetail.tsx"),
] satisfies RouteConfig;
