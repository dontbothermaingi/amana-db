import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // for visibility toggle
import { ADMIN_CREDENTIALS } from "@/config/credentials";

export function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Username", formData.username);
    console.log("Password", formData.password);

    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      const expiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("auth_token", JSON.stringify({ expiry }));
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 px-5 py-15")}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="m@example.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full">
        Login
      </Button>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
