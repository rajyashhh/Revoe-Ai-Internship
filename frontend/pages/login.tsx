import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-[300px]">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />
        <Button className="w-full">Sign In</Button>
      </div>
    </div>
  );
}