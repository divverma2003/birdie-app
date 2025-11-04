import { Link } from "react-router-dom";
import { useState } from "react";

import BirdieSvg from "../../components/svgs/birdie";

import { MdOutlineEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefeault();
    // TODO: Handle signup logic
    console.log("Form Data Submitted: ", formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isError = false;

  return (
    <div className="max-w-7xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <BirdieSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col">
          <BirdieSvg className="w-24 lg:hidden fill-white" />
          <div className="text-4xl font-extrabold text-white">Join today.</div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineEmail />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
              className="grow"
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-cemter gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
          {isError && (
            <p className="text-red-500">Oops!Something went wrong...</p>
          )}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
