import {
  ArrowLeftOnRectangleIcon,
  DocumentArrowDownIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import KinForm from "../components/KinForm";
import Calendar from "../components/Calendar";
import { useContext, useEffect, useState } from "react";
import { Web5Context } from "../utils/Web5Context";
import SpecialistsList from "../components/SpecialistsList";
import BookingForm from "../components/AppointmentForm";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Farmer = () => {
  const { web5, did, protocolDefinition, specialistList, logout } = useContext(
    Web5Context
  );
  const [farmerData, setFarmerData] = useState([]);
  const [specialistInfo, setSpecialistInfo] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [showSpecialistsList, setShowSpecialistsList] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [recipientDid, setRecipientDid] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [showMedical, setShowRecord] = useState(false);
  const [addKin, setAddKin] = useState(false);
  const [medicalData, setMedicalData] = useState([]);

  const handleBookClick = (specialist) => {
    setSelectedSpecialist(specialist);
    setShowBookingForm(true);
    setRecipientDid(specialist.did);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(did);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleFormSubmit = () => {
    setShowBookingForm(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching farmer Profile");
        const response = await web5.dwn.records.query({
          from: did,
          message: {
            filter: {
              protocol: protocolDefinition.protocol,
              schema: protocolDefinition.types.farmerProfile.schema,
            },
          },
        });

        if (response.status.code === 200) {
          const farmerProfile = await Promise.all(
            response.records.map(async (record) => {
              const data = await record.data.json();
              return {
                ...data,
                recordId: record.id,
              };
            })
          );
          setFarmerData(farmerProfile[farmerProfile.length - 1]);
          return farmerProfile;
        } else {
          console.error("error fetching this profile", response.status);
          return [];
        }
      } catch (error) {
        console.error("error fetching farmer profile :", error);
      }
    };

    console.log('Farmer data' + farmerData)
   

    const fetchMedicalRecord = async () => {
      try {
         console.log("Fetching farmer Profile");
        const response = await web5.dwn.records.query({
          from: did,
          message: {
            filter: {
              protocol: protocolDefinition.protocol,
              schema: protocolDefinition.types.medicalRecords.schema,
            },
          },
        });

        if (response.status.code === 200) {
          console.log("Respone" + response.status.code)
          const medicalRec = await Promise.all(
            response.records.map(async (record) => {
              console.log('Farmer data Records' + response.records)
              const data = await record.data.json();
              console.log("dara" + data);
              return {
                ...data,
                recordId: record.id,
              };
            })
          );
        console.log("medical record : ", medicalRec);
          setMedicalData(medicalRec);
          return medicalRec;
        } else {
          console.error("error fetching this profile", response.status);
          return [];
        }
      } catch (error) {
        console.error("error fetching farmer profile :", error);
      }
    };

    const getRandomElements = () => {
      const numElements = 3;
      const randomArray = specialistList
        .sort(() => 0.5 - Math.random())
        .slice(0, numElements);
      setSpecialistInfo(randomArray);
    };

    if (web5 && did) {
      fetchData();
      fetchMedicalRecord();
      getRandomElements();
    }
  }, [web5, did, specialistList]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getMonth() < birthDate.getMonth())
    ) {
      return age - 1;
    } else {
      return age;
    }

    
  };

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
              <span className="sr-only">menu</span>
              <ArrowLeftOnRectangleIcon className="h-8 w-8" />
            </button>
          </div>
        </aside>
        <div className="flex-1 mx-auto bg-[#f7f7f7] rounded-[60px] px-10 py-7">
          <div className="w-full mx-auto flex flex-col items-start justify-start space-y-[50px]">
            <nav className="w-full inline-flex item-center justify-end">
              <div className="inline-flex space-x-2 px-5 py-3 items-center justify-center bg-[#D9D9D9] border-0 border-og-blue rounded-2xl">
                <div className="text-[#9e9e9e] inline-flex space-x-3 items-end justify-between">
                  <span>{did?.slice(8, 20) + "..." + did?.slice(-8)}</span>
                  <button
                    className="flex gap-2"
                    onClick={handleCopy}
                    type="button"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                    <div>
                      {isCopied ? (
                        <p className="bg-gray-400 text-sm text-white p-1 rounded-3xl">
                          Copied!
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </nav>

            <div className="w-full mx-auto space-y-5">
              <div className="w-full inline-flex item-center justify-between ">
                <h2 className="text-[36px] font-normal">
                  Welcome{" "}
                  <span className="text-olive-green font-bold">
                    {/* {farmerData.name}! */}
                  </span>
                </h2>
              </div>
              <div className="w-full inline-flex item-center justify-between gap-x-16">
                
                {/* Farmer info */}
               
                {/* Specialist's list*/}
                <div className="bg-[#4caf50] rounded-xl p-4 w-3/5">
                  <div className="inline-flex items-center justify-between w-full">
                    <h3 className="inline-flex space-x-4 items-center justify-between text-[20px]">
                      <span className="font-semibold text-white">
                        Specialist’s List
                      </span>
                    </h3>
                    <div>
                      <button
                        onClick={() => setShowSpecialistsList(true)}
                        className="underline font-normal text-[13px]"
                      >
                        View all
                      </button>
                      {showSpecialistsList && (
                        <div className="none fixed z-50 left-0 top-0 w-full h-full items-center justify-center bg-slate-200">
                          <div className="bg-gray-200 p-[20px] rounded-lg">
                            <SpecialistsList
                              close={() => setShowSpecialistsList(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="py-5">
                    {specialistInfo.map((specialist, index) => (
                      <div
                        key={index}
                        className="mb-2 w-full px-5 py-3 bg-white rounded-xl inline-flex items-center justify-start space-x-3"
                      >
                        <div className="px-5 py-3 bg-white rounded-xl inline-flex items-center justify-start space-x-3 w-3/5">
                          <span
                            className="h-10 w-10 bg-og-blue text-[16px] text-white flex 
                                    items-center justify-center rounded-full uppercase"
                          >
                            {specialist.name.charAt(0)}
                          </span>
                          <div>
                            <h4 className="text-[16px] text-black">
                              {specialist.name}
                            </h4>
                            <span className="text-[12px] text-[#0d0d0d60]">
                              {specialist.speciality}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button
                            className="bg-og-blue py-1 px-4 rounded-xl"
                            key={index}
                            onClick={() => handleBookClick(specialist)}
                          >
                            Book
                          </button>
                          {showBookingForm && (
                            <div className="fixed top-0 z-50 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                              <button
                                onClick={() => setShowBookingForm(false)}
                                className="absolute top-4 flex justify-center right-4 bg-og-blue p-2 w-10 h-10 rounded-full"
                              >
                                X
                              </button>
                              <BookingForm
                                specialistDid={recipientDid}
                                specialist={selectedSpecialist}
                                onSubmit={handleFormSubmit}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mx-auto space-y-5">
              <div className="w-full inline-flex item-center justify-between gap-x-8">
                {/* 1st */}
                <div className="rounded-xl p-4 w-1/3 h-50">
                <div className="bg-[#4caf50] rounded-xl p-4 w-5/5 max-h-[150px]" >
                  <div className="bg-white rounded-xl p-4 mb-8">
                    <h3 className="text-[20px] font-medium">DID</h3>
                    <div className="text-[#9e9e9e] inline-flex space-x-3 items-center justify-between">
                      <span>{did?.slice(8, 20) + "..." + did?.slice(-8)}</span>
                      <button
                        className="flex gap-2"
                        onClick={handleCopy}
                        type="button"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                        {isCopied ? (
                          <p className="bg-gray-400 text-sm text-white p-1 rounded-3xl">
                            Copied!
                          </p>
                        ) : (
                          ""
                        )}
                      </button>
                    </div>
                  </div>
                  
                </div>
                  {/* <Calendar /> */}
                </div>
                {/* 2nd */}
                <div className="rounded-xl p-4 w-1/4">
                  <div className="relative">
                    <img
                      src="/assets/images/hero.png"
                      className="relative object-contain"
                      alt="farmer booking"
                    />
                    <div className="absolute bottom-0 px-4 pt-4 pb-10 top-10 bg-[#00000099] w-full item-center text-center rounded-xl">
                      <p className="text-white font-semibold mb-16">
                        My Records
                      </p>
                      <div>
                        <span
                          onClick={() => setShowRecord(true)}
                          className="inline-flex cursor-pointer space-x-2 px-5 py-3 items-center justify-center bg-og-blue rounded-2xl"
                        >
                          View
                        </span>
                        {showMedical && (
                          <>
                            <div
                              className="w-full h-full fixed top-0 left-0 flex justify-center items-center 
                            bg-white flex-col space-y-5"
                            >
                              <button
                                onClick={() => setShowRecord(false)}
                                className="bg-red-500 text-white py-2 px-5 text-center rounded-full"
                              >
                                Close me!
                              </button>
                              <div className="inline-flex flex-wrap items-center justify-center gap-5">
                                {medicalData?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="cursor-pointer inline-flex items-center justify-between space-x-5 p-3 
                                    bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-all duration-200 ease-in-out rounded-md"
                                  >
                                    <div>
                                      <DocumentArrowDownIcon className="h-12 w-12 text-black" />
                                    </div>
                                    <div className="flex flex-col items-start justify-between text-[14px] text-gray-500 space-y-2">
                                      <div>
                                        <strong>Specialist DID :</strong>{" "}
                                        {item?.formState?.specialistDid?.slice(
                                          0,
                                          4
                                        ) +
                                          " . . . " +
                                          item?.formState?.specialistDid?.slice(-5)}
                                      </div>
                                      <div>
                                        <strong>Issue(s) : </strong>
                                        {item?.formState?.issues}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* 3rd */}
                <div className="bg-[#FFFFFF] rounded-xl p-4 w-1/3 flex flex-col gap-4 items-center">
                  <div className="inline-flex items-center place-content-center w-full mb-8 mt-8">
                    <h3 className="inline-flex space-x-4 items-center justify-between text-[20px]">
                      <span className="font-semibold text-center">
                        Emergency Contacts
                      </span>
                    </h3>
                  </div>
                  <div>
                    <span
                      onClick={() => setShowPopUp(true)}
                      className="px-6 mx-auto cursor-pointer py-3 text-gray-700 underline rounded-full text-[16px] mb-4 font-semibold text-center"
                    >
                      View Next of Kin
                    </span>
                    {showPopUp && (
                      <>
                        <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-white">
                          <button onClick={() => setShowPopUp(false)}>
                            Close me!
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="inline-flex items-center place-content-center w-full mb-4">
                    <h3 className="inline-flex space-x-4 items-center justify-between text-[20px]">
                      <span className="font-semibold">Or</span>
                    </h3>
                  </div>
                  <div>
                    <span
                      onClick={() => setAddKin(true)}
                      className="px-8 cursor-pointer text-[#f7f7f7] py-3 bg-og-blue rounded-full text-[16px] font-semibold text-center"
                    >
                      Add Next of Kin
                    </span>
                    {addKin && (
                      <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-white">
                        <KinForm />
                        <button
                          className="fixed top-10 right-10 bg-og-blue p-2 text-2xl w-10 h-10 flex justify-center items-center rounded-full"
                          onClick={() => setAddKin(false)}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full inline-flex item-center justify-between gap-x-16">
              <div className="bg-[#FFFFFF] rounded-xl p-4 w-3/5">
                <div className="bg-white rounded-xl p-4">
                  <div className="inline-flex items-center justify-between w-full">
                    <h2 className="font-bold font-4xl">Reminder</h2>
                    <Link to="/" className="text-[12px] underline">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="w-full bg-[#749D1C] rounded-xl p-4 inline-flex space-x-3 items-center justify-between h-20">
                  <div className="px-5 py-3 rounded-xl inline-flex items-center justify-start space-x-3 w-full">
                    <span
                      className="h-10 w-10 bg-og-blue text-[16px] text-white flex 
                                    items-center justify-center rounded-full"
                    >
                      <img
                        src="/assets/images/ellipse.png"
                        alt="recommender image"
                      />
                    </span>
                    <div>
                      <h4 className="text-[16px] text-black"> Brandon</h4>
                      <span className="text-[12px] text-[#F0F0F0]">
                        30 Jan, 2023 | 04:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-xl p-4 w-3/5 h-32">
                <div className="w-full px-5 py-3 mb-2 bg-og-blue rounded-xl inline-flex items-center justify-start gap-4 space-x-3">
                  <div className="px-5 py-3 rounded-xl inline-flex items-center justify-start space-x-3 w-1/2">
                    <div>
                      <h4 className="text-[16px] text-black">
                        Upcoming Visits
                      </h4>
                    </div>
                    <span
                      className="h-6 w-10 bg-white text-[12px] text-og-blue flex 
                                    items-center justify-center rounded"
                    >
                      40
                    </span>
                  </div>
                  <div className="border border-white h-16 w-[1px]"></div>
                  <div className="px-5 py-3 rounded-xl inline-flex items-center justify-start space-x-3 w-1/2">
                    <div>
                      <h4 className="text-[16px] text-black">Total Visists</h4>
                    </div>
                    <span
                      className="h-6 w-10 text-[12px] bg-white text-[#4caf50] flex 
                                    items-center justify-center rounded"
                    >
                      40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farmer;
