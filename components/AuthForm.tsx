"use client";

import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { register } from "@/app/actions/auth.actions";
import { toast } from "./ui/use-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { status: sessionStatus } = useSession(); //session
  // console.log(sessionStatus);

  if (sessionStatus === "authenticated") return router.replace("/");

  return (
    <section className="h-screen w-full bg-gradient-to-b from-violet-200 to-violet-700 flex-center p-4">
      <div className="animate-slide-down max-w-md w-full bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6 overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Welcome to <span className="text-violet-600">Workflo!</span>
        </h1>
        {pathname === "/sign-up" ? (
          <SignUpForm router={router} />
        ) : (
          <SignInForm router={router} />
        )}
      </div>
    </section>
  );
};

export default AuthForm;

const SignInForm: React.FC<{ router: ReturnType<typeof useRouter> }> = ({
  router,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const isFormValid = useMemo(() => {
    return emailPattern.test(email) && passwordPattern.test(password);
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!emailPattern.test(e.target.value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!passwordPattern.test(e.target.value)) {
      setError("Please enter a valid password.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Email and Password are required.");
    }

    try {
      console.log(email, password);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok || res?.status === 200) {
        setError("");
        toast({
          title: "✅ Logged in successfully!",
          description: "Now you can manage your tasks",
        });
        router.replace("/");
      }
      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Invalid E-mail or Password!",
          description: "Try again later..",
        });
        return setError("Invalid E-mail or Password!");
      }
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Your email"
        className="w-full bg-zinc-100 p-4 rounded-xl"
      />
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder="Your password"
          className="w-full bg-zinc-100 p-4 rounded-xl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && (
        <div className="py-1 overflow-hidden">
          <p className="animate-slide-up py-1 overflow-hidden text-red-500">
            {error}
          </p>
        </div>
      )}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full bg-violet-700 text-white text-lg font-bold py-2 rounded-md shadow-md ${
          !isFormValid
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-violet-500 active:translate-y-1"
        }`}
      >
        Login
      </button>
      <span className="text-ms text-balance">
        Don&apos;t have an account? Create a{" "}
        <Link href="/sign-up" className="text-blue-400 hover:underline">
          new account.
        </Link>
      </span>
    </form>
  );
};

const SignUpForm: React.FC<{ router: ReturnType<typeof useRouter> }> = ({
  router,
}) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const isFormValid = useMemo(() => {
    return (
      fullName.trim() !== "" &&
      emailPattern.test(email) &&
      passwordPattern.test(password)
    );
  }, [fullName, email, password]);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!emailPattern.test(e.target.value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!passwordPattern.test(e.target.value)) {
      setError(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
      );
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim() || !email || !password) {
      return setError("All fields are required.");
    }

    try {
      // console.log(fullName, email, password);
      const res = await register({ fullname: fullName, email, password });
      console.log(res);

      if (res == "ok") {
        toast({
          title: "User registered successfully!",
          description: "You can now log in with your new account.",
        });
        router.push("/sign-in"); // Redirecting to login page
      }
      if (res == "exists") {
        toast({
          variant: "destructive",
          title: "User already exists!",
          description: `This E-mail: ${email} is already registered... Try logging in.`,
        });
      }
      if (res == "err") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong!",
          description:
            "There was a problem with your request. Please try again.",
        });
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center">
      <input
        type="text"
        value={fullName}
        onChange={handleFullNameChange}
        placeholder="Full name"
        className="w-full bg-zinc-100 p-4 rounded-xl"
      />
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Your email"
        className="w-full bg-zinc-100 p-4 rounded-xl"
      />
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder="Your password"
          className="w-full bg-zinc-100 p-4 rounded-xl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && (
        <div className="py-1 overflow-hidden">
          <p className="animate-slide-up py-1 overflow-hidden text-red-500">
            {error}
          </p>
        </div>
      )}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full bg-violet-700 text-white text-lg font-bold py-2 rounded-md shadow-md ${
          !isFormValid
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-violet-500 active:translate-y-1"
        }`}
      >
        Sign Up
      </button>
      <span className="text-ms">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-400 hover:underline">
          Log in.
        </Link>
      </span>
    </form>
  );
};

// will continue later
// const ForgotPasswordForm: React.FC<{
//   router: ReturnType<typeof useRouter>;
// }> = ({ router }) => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const passwordPattern =
//     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

//   const isFormValid = useMemo(() => {
//     return emailPattern.test(email) && passwordPattern.test(password);
//   }, [email, password]);

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//     if (!emailPattern.test(e.target.value)) {
//       setError("Please enter a valid email address.");
//     } else {
//       setError("");
//     }
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//     if (!passwordPattern.test(e.target.value)) {
//       setError("Please enter a valid password.");
//     } else {
//       setError("");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!email || !password) {
//       return setError("Email and Password are required.");
//     }

//     try {
//       console.log(email, password);
//       // await login(email, password);
//       // navigate("/");
//     } catch (err) {
//       setError("Failed to log in. Please check your credentials.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center">
//       <input
//         type="email"
//         value={email}
//         onChange={handleEmailChange}
//         placeholder="Your email"
//         className="w-full bg-zinc-100 p-4 rounded-xl"
//       />
//       <div className="relative w-full">
//         <input
//           type={showPassword ? "text" : "password"}
//           value={password}
//           onChange={handlePasswordChange}
//           placeholder="Your password"
//           className="w-full bg-zinc-100 p-4 rounded-xl"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </button>
//       </div>
//       {error && (
//         <div className="py-1 overflow-hidden">
//           <p className="animate-slide-up py-1 overflow-hidden text-red-500">
//             {error}
//           </p>
//         </div>
//       )}
//       <button
//         type="submit"
//         disabled={!isFormValid}
//         className={`w-full bg-violet-700 text-white text-lg font-bold py-2 rounded-md shadow-md ${
//           !isFormValid
//             ? "opacity-50 cursor-not-allowed"
//             : "hover:bg-violet-500 active:translate-y-1"
//         }`}
//       >
//         Login
//       </button>
//       <span className="text-ms text-balance">
//         Don&apos;t have an account? Create a{" "}
//         <Link href="/sign-up" className="text-blue-400 hover:underline">
//           new account.
//         </Link>
//       </span>
//     </form>
//   );
// };
