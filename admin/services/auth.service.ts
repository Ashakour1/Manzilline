import { API_URL } from "@/lib/api";

const Login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to login" }));
    const errorMessage = errorData.message || errorData.error || "Failed to login. Please check your credentials.";
    throw new Error(errorMessage);
  }

  return response.json();
};

export default Login;


