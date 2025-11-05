import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Login } from "./loginform";

export function LoginPage() {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background px-4"
      )}
    >
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0 gap-5">
          <CardContent className="grid p-0 md:grid-cols-2 gap-10">
            <Login />
            <div className="bg-muted relative hidden md:block">
              <img
                src="/login.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover object-bottom dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground text-center text-xs mt-4">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
