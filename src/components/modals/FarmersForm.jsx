/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Web5Context } from "../../utils/Web5Context";

export default function FarmersForm({ userType, closeModal }) {
  const { web5, did, setUserTypeAndRedirect, protocolDefinition } = useContext(
    Web5Context
  );
  const [formState, setFormState] = useState({
    name: "",
    dob: "",
    location: "",
  });

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormState({
          ...formState,
          location: `${latitude}, ${longitude}`,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  };

  const createFarmer = async () => {
    try {
      const { record, status } = await web5.dwn.records.write({
        data: formState,
        message: {
          schema: protocolDefinition.types.specialistProfile.schema,
          recipient: did,
          published: true,
        },
      });
      await record.send(did);
    } catch (error) {
      console.error("Error Creating farmer data : ", error);
    }
  };
 

  const formSubmit = (e) => {
    e.preventDefault();
    getCurrentLocation();
    console.log("Farmer data to be saved:", formState);
    createFarmer().finally(() => {
      closeModal();
      setUserTypeAndRedirect("farmer");
    });
  };

  

  return (
    <div className="w-full">
      <p className="text-lg font-normal text-black ">
        Enter your details below {userType}
      </p>
      <form className="pt-[60px]" onSubmit={formSubmit}>
        <div className="flex flex-col gap-[17px] pb-7">
          <label htmlFor="name" className="text-lg font-normal text-black ">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="max-w-[410px] h-[53px] px-5 bg-white rounded-2xl border border-sky-400 "
          />
        </div>
        <div className="flex flex-col gap-[17px] pb-7">
          <label htmlFor="location" className="text-lg font-normal text-black ">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            name="location"
            value={formState.location}
            readOnly
            className="max-w-[410px] h-[53px] px-5 bg-white rounded-2xl border border-sky-400 "
          />
        </div>

        <div className="flex flex-col gap-[17px] pb-8">
          <label htmlFor="dob" className="text-lg font-normal text-black ">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formState.dob}
            onChange={handleChange}
            max={getTodayDate()}
            required
            className="max-w-[410px] min-w-[400px] h-[53px] px-5 bg-white rounded-2xl border border-sky-400"
          />
        </div>
        <button
          className="w-[93px] h-[38px] bg-sky-400 rounded-[100px] disabled:bg-black/40 disabled:cursor-not-allowed hover:bg-sky-300 duration-300 transition-colors ease-in-out"
          disabled={formState.dob === "" || formState.name === ""}
        >
          Connect
        </button>
      </form>
    </div>
  );
}
