import React from "react";
import Auth from "./hooks/auth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const isValidEmail = (email) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

function Login() {
  // const navigate = useNavigate();
  const { http, setToken } = Auth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    http
      .post("/login", data)
      .then((res) => {
        if (res.data === "wrong email or password") {
          Swal.fire({
            icon: "warning",
            title: res.data,
            timer: 1000,
          });
        } else {
          setToken(res.data.user, res.data.access_token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);

    const validityChanged =
      (errors.email && isValid) || (!errors.email && !isValid);
    if (validityChanged) {
      console.log("Fire tracker with", isValid ? "Valid" : "Invalid");
    }

    return isValid;
  };

  return (
    <div className="relative flex h-screen w-screen flex-col bg-[#F4E8C1] md:items-center md:justify-center md:bg-transparent ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 rounded space-y-8 bg-[#F4E8C1] py-10 px-6 md:mt-0 md:max-w-md md:px-14 "
      >
        <h1 className="text-[25px] font-semibold">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="input"
              {...register("email", {
                required: true,
                validate: handleEmailValidation,
              })}
            />
            {errors.email && <p>This field is required and must be email</p>}
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="input"
              {...register("password", { required: true })}
            />
            {errors.password && <p>This field is required</p>}
          </label>
          <button
            type="submit"
            className="w-full p-2 bg-[#58c492] text-white rounded-lg"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
