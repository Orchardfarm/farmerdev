import {
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  BellAlertIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import {
  PlusCircleIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import Profile from "../assets/hero.png";
import Layer from "../assets/layer.png";
import { Link } from "react-router-dom";
import Calendar from "../components/Calendar";
import { useContext, useEffect, useState } from "react";
import { Web5Context } from "../utils/Web5Context";
import IssueRecordModal from "../components/IssueRecord";

const Specialist = () => {
  const { web5, did, protocolDefinition, logout } = useContext(Web5Context);
  const [specialistData, setSpecialistData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [farmerData, setFarmerData] = useState([]);
  const [farmerDid, setFarmerDid] = useState("");

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching specialist Profile");
        const response = await web5.dwn.records.query({
          from: did,
          message: {
            filter: {
              protocol: protocolDefinition.protocol,
              schema: protocolDefinition.types.specialistProfile.schema,
            },
          },
        });

        if (response.status.code === 200) {
          const specialistProfile = await Promise.all(
            response.records.map(async (record) => {
              const data = await record.data.json();
              return {
                ...data,
                recordId: record.id,
              };
            })
          );
          setSpecialistData(specialistProfile[specialistProfile.length - 1]);
          return specialistProfile;
        } else {
          console.error("error fetching this profile", response.status);
          return [];
        }
      } catch (error) {
        console.error("error fetching farmer profile :", error);
      }
    };

    const fetchAppointment = async () => {
      try {
        // console.log("Fetching specialist Profile");
        const response = await web5.dwn.records.query({
          // from: did,
          message: {
            filter: {
              protocol: protocolDefinition.protocol,
              schema: protocolDefinition.types.bookAppointment.schema,
              protocolPath: "bookAppointment",
            },
          },
        });

        if (response.status.code === 200) {
          const data = await Promise.all(
            response.records.map(async (record) => {
              const data = await record.data.json();
              return {
                ...data,
                recordId: record.id,
              };
            })
          );
          setAppointmentData(data);
          return data;
        } else {
          console.error("error fetching this profile", response.status);
          return [];
        }
      } catch (error) {
        console.error("error fetching farmer profile :", error);
      }
    };
    if (web5 && did) {
      fetchData();
      fetchAppointment();
    }
  }, [did, web5]);

  const handleOpenModal = (data) => {
    setFarmerData(data);
    setFarmerDid(data.farmerDID);
    openModal();
  };

  const formatDate = (sting) => {
    const date = new Date(sting); // Replace with your actual date and time

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };

  appointmentData.sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);

    return dateA - dateB;
  });
  console.log(specialistData.name);

  return (
    <div className="w-full mx-auto bg-og-blue p-5">
      <div className="w-full mx-auto flex flex-row items-start justify-center space-x-5">
        <aside className="w-auto mx-auto">
          <div className="flex flex-col items-center justify-center space-y-10 h-[500px]">
            <div
              className="p-3 hover:bg-[#fff9] rounded-lg text-white 
            hover:text-olive-green transition-all duration-300"
            >
              <span className="sr-only">menu</span>
              <Squares2X2Icon className="h-8 w-8" />
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="p-3 hover:bg-[#fff9] rounded-lg text-white 
            hover:text-olive-green transition-all duration-300"
            >
              <span className="sr-only">logout</span>
              <ArrowLeftOnRectangleIcon className="h-8 w-8" />
            </button>
          </div>
        </aside>
        <div className="flex-1 mx-auto bg-[#f7f7f7] rounded-[60px] px-10 py-7">
          <div className="w-full mx-auto flex flex-col items-start justify-start  space-y-[50px]">
            <nav className="w-full flex flex-row items-center justify-between">
              <a href="/" className="uppercase flex flex-col -space-y-3">
                <span className="text-og-blue text-[14px] font-medium">
                  Orchard Farm
                </span>
              </a>
              <div className="flex flex-row items-center justify-between space-x-[40px]">
                <div>
                  <form className="">
                    <div className="relative bg-[#e5e5e5] rounded-xl overflow-hidden w-full">
                      <div
                        className="bg-transparent absolute inset-y-0 start-0 flex items-center ps-3 
                      pointer-events-none"
                      >
                        <MagnifyingGlassIcon className="w-5 h-5 text-[#A2A3A4]" />
                      </div>
                      <input
                        type="search"
                        className="block w-full p-4 ps-10 border-gray-300 rounded-lg bg-[#e5e5e5] outline-none"
                        placeholder="Search ..."
                        required
                        name="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="text-[#8b8b8b] relative">
                  <span className="h-2 w-2 absolute top-0 right-1 bg-olive-green rounded-full"></span>
                  <BellAlertIcon className="w-[30px] h-[30px]" />
                </div>
                <div
                  className="border-2 border-[#d9d9d9] rounded-2xl flex flex-row items-center 
                justify-between space-x-4 py-2 px-4"
                >
                  <div className="h-12 w-12 overflow-hidden">
                    <img
                      src={Profile}
                      alt="Specialist's profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[16px] font-medium">
                     {specialistData.name}
                  </span>
                </div>
              </div>
            </nav>
            <div className="w-full mx-auto space-y-5">
              <div className="w-full inline-flex item-center justify-between">
                <h2 className="text-[36px] font-normal">
                  Welcome{" "}
                  <span className="text-olive-green font-bold">
                    {specialistData.name} !
                  </span>
                </h2>
              </div>
              <div className="w-full space-y-[30px]">
                <div className="w-full flex flex-row items-start justify-between space-x-20">
                  {/* Left˝ */}
                  <div className="w-2/5 space-y-[20px]">
                    <div className="bg-og-blue py-[30px] px-[18px] rounded-2xl space-y-[20px] w-full">
                      <div className="bg-white rounded-xl p-4 ">
                        <h3 className="text-[20px] font-medium">DID</h3>
                        <div className="text-[#9e9e9e] inline-flex space-x-3 items-center justify-between">
                          <span>{did?.slice(0, 8) + "" + did?.slice(-8)}</span>
                          <button type="button">
                            <DocumentDuplicateIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-[10px]">
                        <div className="bg-white rounded-xl p-4 ">
                        </div>
                        <div className="bg-white rounded-xl p-4 ">
                          <h3 className="text-[20px] font-medium">
                            Speciality
                          </h3>
                          <div className="text-[#9e9e9e] inline-flex space-x-3 items-center justify-between">
                            <span>{specialistData.speciality}</span>   
                          </div>
                        </div>
                      </div>
                    </div>
        
                  </div>

                  {/* Right */}

                  <div className="w-3/5 p-3 space-y-[30px]">
                    {/* Incoming Request */}

                    <div className="bg-white rounded-2xl space-y-[20px] py-8 px-5">
                      <div className="inline-flex items-center justify-between w-full">
                        <h3 className="inline-flex space-x-4 items-center justify-between text-[20px]">
                          <span className="font-semibold">
                            Incoming Request
                          </span>
                          <span className="text-[#f39f9f] shadow drop-shadow-xl px-3 py-1 text-center rounded-md">
                            {appointmentData.length}
                          </span>
                        </h3>
                        <Link
                          to="/"
                          className="underline font-normal text-[13px]"
                        >
                          View all
                        </Link>
                      </div>
                      <p className="w-full px-8 text-[#f7f7f7] py-4 bg-og-blue rounded-xl text-[16px] font-semibold">
                        Hi, Ruth, I want to confirm if there’s an...
                      </p>
                      <p className="w-full px-8 text-[#f7f7f7] py-4 bg-og-blue rounded-xl text-[16px] font-semibold">
                        Hi, can i request for an appointment in the...
                      </p>
                    </div>

                    {/* Recently Booked Appointments */}

                    <div className="bg-og-blue rounded-2xl space-y-[20px] py-8 px-5">
                      <div className="inline-flex items-center justify-between w-full">
                        <h3 className="inline-flex space-x-4 items-center justify-between text-[20px]">
                          <span className="font-semibold text-white">
                            Recently Booked Appointments
                          </span>
                          <span className="bg-white text-og-blue shadow drop-shadow-xl px-3 py-1 text-center rounded-md">
                            {appointmentData.length}
                          </span>
                        </h3>
                        <Link
                          to="/"
                          className="underline font-normal text-[13px] text-white"
                        >
                          View all
                        </Link>
                      </div>
                      <div
                        className="flex flex-col items-center justify-between space-y-3 max-h-[250px] 
                      overflow-hidden overflow-y-scroll p-2 drop-shadow-md"
                      >
                        {appointmentData.map((data, index) => (
                          <div
                            key={index}
                            className="w-full px-5 py-3 bg-white rounded-xl flex items-center justify-between "
                          >
                            <div className="inline-flex items-center justify-start space-x-3">
                              <span
                                className="h-10 w-10 bg-og-blue text-[16px] text-white flex 
                        items-center justify-center rounded-full"
                              >
                                P
                              </span>
                              <div className="flex flex-col">
                                <h4 className="text-[16px] text-black">
                                  Farmer Rounds
                                </h4>
                                <span className="text-[12px] text-[#0d0d0d60]">
                                  {data.issues}
                                </span>
                                <span className="text-[12px] text-[#0d0d0d60]">
                                  {formatDate(data.appointmentDate)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenModal(data)}
                              type="button"
                              className="hover:bg-og-blue hover:text-white inline-flex space-x-2 px-2 py-2 items-center 
                              justify-center border-2 border-og-blue rounded-xl transition-all duration-200 ease-linear"
                            >
                              <span className="sr-only">
                                Add new issue record
                              </span>
                              <span className=" ">
                                <PlusCircleIcon className="h-4 w-4" />
                              </span>
                              <span className="text-[14px] font-normal pe-2">
                                Issue record
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-x-[50px] w-full flex flex-row items-end justify-between">
                  <div className="w-1/4 bg-white rounded-3xl p-5 space-y-4">
                    <div className="inline-flex items-center justify-between w-full">
                      <h2 className="text-[20px]">Reminder</h2>
                      <Link to="/" className="text-[12px] underline">
                        View all
                      </Link>
                    </div>

                    <div className="w-full px-5 py-3 bg-olive-green rounded-xl inline-flex items-center justify-start space-x-3">
                      <span
                        className="h-10 w-10 bg-og-blue text-[16px] text-white flex 
                        items-center justify-center rounded-full"
                      >
                        S
                      </span>
                      <div>
                        <h4 className="text-[16px] text-white">
                          {appointmentData.length > 0
                            ? appointmentData[0].issues
                            : "null"}
                        </h4>
                        <span className="text-[12px] text-[#f0f0f060]">
                          {appointmentData.length > 0
                            ? formatDate(appointmentData[0].appointmentDate)
                            : "null"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-2/4">
                    <div className="w-full flex items-center justify-between  bg-og-blue p-5 rounded-3xl">
                      <div className="flex flex-col items-start justify-between space-y-8">
                        <h5 className="text-white text-[20px]">
                          <span>New Farmers</span>{" "}
                          <span className="text-og-blue bg-white py-[2px] px-2 rounded-lg">
                            40
                          </span>
                        </h5>
                        <div className="bg-[#DFFDDD] p-2 inline-flex items-center justify-between space-x-4 rounded-xl">
                          <span className="text-[#008000] text-[18px]">
                            50%
                          </span>
                          <span>
                            <ArrowTrendingUpIcon className="text-og-blue w-[26px] h-[20px] " />
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-between space-y-8">
                        <h5 className="text-white text-[20px]">
                          <span>Repeats farmers</span>{" "}
                          <span className="text-og-blue bg-white py-[2px] px-2 rounded-lg">
                            23
                          </span>
                        </h5>
                        <div className="bg-[#DFFDDD] p-2 inline-flex items-center justify-between space-x-4 rounded-xl">
                          <span className="text-[#008000] text-[18px]">
                            32%
                          </span>
                          <span>
                            <ArrowTrendingUpIcon className="text-og-blue w-[26px] h-[20px] " />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IssueRecordModal
        isOpen={isOpen}
        closeModal={closeModal}
        openModal={openModal}
        data={farmerData}
        farmerDid={farmerDid}
      />
    </div>
  );
};

export default Specialist;
