'use client';
import { useRouter } from "next/navigation";
import Heading from "../components/Heading";
import { SafeUser } from "../types";
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "../components/ui/Button";
import { AiOutlineGoogle } from "react-icons/ai";
import Input from "../components/inputs/Input";
import toast from "react-hot-toast";

interface LoginFormProps {
  currentUser?: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  currentUser,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: '', email: '', password: '' },
  });
  const router = useRouter();
  useEffect(() => {
    if (currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, []);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((resp) => {
      setIsLoading(false);
      if (resp?.ok) {
        router.push('/cart');
        router.refresh();
        toast.success('Logged in successfully');
      }
      if (resp?.error) {
        toast.error('Error logging in');
      }
    });
  };
    return <>
        <Heading title="Sign in to fingerhut" />
        <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn('google');
        }}></Button>
        <hr className="bg-slate-300 w-full h-px" />
        <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required></Input>
        <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"></Input>
        <Button
        label={isLoading ? 'Loading' : 'Login'}
        onClick={handleSubmit(onSubmit)}></Button>
        <p className="text-sm mt-4 text-slate-500">
        Do not have an account?{' '}
        <Link className="underline" href="/register">
          Sign Up
        </Link>
      </p>
    </>
}

export default LoginForm;