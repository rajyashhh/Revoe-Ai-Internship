import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setIsError(true);
      setMessage("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await registerUser(name, email, password);
      setMessage(response.message || "Account created successfully!");
      
      if (response.message === "Account Sucessfully created!") {
        // Navigate to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      setIsError(true);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.error && "Validation error") ||
                          "Error signing up";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                placeholder="Enter your email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                placeholder="Create a password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <p className="text-xs text-gray-500">Password must be at least 5 characters long</p>
            </div>
            
            {message && (
              <Alert className={isError ? "bg-red-50" : "bg-green-50"}>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Already have an account? 
            <Link href="/login" className="ml-1 text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}