'use client';

import { useEffect, useState } from "react";
import { SafeUser } from "../types";
import { useRouter } from "next/navigation";
import Heading from "../components/Heading";
import { signIn } from 'next-auth/react';
import { Button } from "../components/ui/Button";
import { AiOutlineGoogle } from "react-icons/ai";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from 'axios';
import Link from "next/link";

interface RegisterFormProps {
  currentUser?: SafeUser | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  currentUser,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
    useEffect(() => {
        if (currentUser) {
        router.push('/cart');
        router.refresh();
        }
    }, []);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post('/api/register', data)
      .then(() => {
        toast.success('Account created successfully');
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((resp) => {
          if (resp?.ok) {
            router.push('/cart');
            router.refresh();
            toast.success('Logged in successfully');
          }
          if (resp?.error) {
            toast.error('Error logging in');
          }
        });
      })
      .catch(() => {
        toast.error('Something went wrong logging in');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  if (currentUser) {
    return (
      <p className="text-center">
        Logged in. Redirecting...
      </p>
    );
  }

    return (
    <>
      <Heading title="Sign up for fingerhut" />
        <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => {signIn('google')}}>
        </Button>
        <hr className="bg-slate-300 w-full h-px" />
        <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required></Input>
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
        label={isLoading ? 'Loading' : 'Sign Up'}
        onClick={handleSubmit(onSubmit)}></Button>
              <p className="text-sm mt-4 text-slate-500">
        Already have an account?{' '}
        <Link className="underline" href="/login">
          Log in
        </Link>
      </p>
    </>
    );
}

export default RegisterForm;