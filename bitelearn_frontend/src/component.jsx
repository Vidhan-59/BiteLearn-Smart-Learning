// src/Component.jsx
import React from 'react';
import { Label } from './components/ui/Label';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { Link } from 'react-router-dom';  // Assuming you're using React Router for navigation

function Component() {
  return (
    <div className="grid lg:grid-cols-2 h-screen w-full">
      <div className="relative flex items-center justify-center bg-primary text-primary-foreground">
        <div className="z-10 p-10 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome to BiteLearn</h1>
            <p className="text-lg text-primary-foreground/80">
              Unlock your potential with our engaging e-learning platform.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
          >
            Sign Up
          </Link>
        </div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account.</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
