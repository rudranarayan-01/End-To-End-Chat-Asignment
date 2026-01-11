import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { MessageSquareQuote, ShieldCheck, User } from 'lucide-react';

export default function AuthPage() {
    const navigate = useNavigate();

    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-50 relative">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-105 px-6 z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 mb-4 rotate-3">
                        <MessageSquareQuote className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Nexus</h1>
                    <p className="text-slate-500 mt-2">Professional messaging for teams</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200/50 p-1">
                        <TabsTrigger value="login" className="data-[state=active]:bg-white">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-white">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Sign in</CardTitle>
                                <CardDescription>Enter your username and password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <Input className="pl-10 h-12" placeholder="username" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <Input type="password" className="pl-10 h-12" placeholder="••••••••" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full h-12 text-lg font-semibold" variant="outline" onClick={() => navigate('/dashboard')}>
                                    Login to Account
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Create Account</CardTitle>
                                <CardDescription>Start your 100% free account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input className="h-12" placeholder="Full Name" />
                                <Input className="h-12" placeholder="Choose Username" />
                                <Input className="h-12" type="password" placeholder="Password" />
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full h-12 text-lg font-semibold" variant="outline" onClick={() => navigate('/dashboard')}>
                                    Register Now
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="mt-8 text-center text-sm text-slate-400">
                    By continuing, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}