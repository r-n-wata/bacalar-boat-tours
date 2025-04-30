import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.get("/api/user", () => {
    return HttpResponse.json({ id: 1, name: "Mocked User" }, { status: 200 });
  }),

  http.post("/api/login", async ({ request }) => {
    const body = await request.json();
    if (body.username === "admin") {
      return HttpResponse.json({ token: "abc123" });
    }
    return new HttpResponse("Unauthorized", { status: 401 });
  }),
];
