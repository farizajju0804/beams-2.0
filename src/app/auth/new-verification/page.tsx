"use client";
import CardWrapper from "@/app/auth/_components/card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/auth/new-verification";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useRouter } from 'next/navigation';

const NewVerification = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.url) {
          router.push(data.url);
        } else {
          setSuccess(data.success);
          setError(data.error);
        }
      })
      .catch(() => {
        setError("Something went Wrong!");
      });
  }, [token, success, error, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Suspense>
      <CardWrapper
        headerLabel="Confirming Your Verification"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        <div className="flex items-center justify-center w-full">
          {!success && !error && <BeatLoader />}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      </CardWrapper>
    </Suspense>
  );
};

export default NewVerification;
