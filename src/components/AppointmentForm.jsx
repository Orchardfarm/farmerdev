/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { Web5Context } from "../utils/Web5Context";

const BookingForm = ({ specialistDid }) => {
  const { web5, did, protocolDefinition } = useContext(Web5Context);
  const [issues, setIssues] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create a new booking record
      const { record, status } = await web5.dwn.records.write({
        data: {
          specialistDid,
          issues,
          farmerDID: did,
          appointmentDate,
        },
        message: {
          // protocol: protocolDefinition.protocol,
          // protocolPath: "bookAppointment",
          schema: protocolDefinition.types.bookAppointment.schema,
          recipient: specialistDid,
          published: true,
        },
      });
    
      await record.send(did);
      setMessage("Appointment booked successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
      setIssues("");
      setAppointmentDate("");

    } catch (error) {
      console.error("Error booking appointment:", error);
    }
    setIsLoading(false);
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  return (
    <div className="bg-white mx-auto w-[50%] rounded-lg h-[70%]">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center flex-col gap-8 mx-auto p-6"
      >
        <h1 className="text-2xl font-semibold">Book Appointment</h1>
        <div className="flex flex-col gap-2">
          <label className="text-black">Crop disease:</label>
          <textarea
            value={issues}
            className="p-2 border border-gray-400 rounded-lg outline-none w-[50%]"
            placeholder="Write your issues here ..."
            onChange={(e) => setIssues(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black">Appointment Date:</label>
          <input
            type="datetime-local"
            value={appointmentDate}
            className="p-2 border border-gray-400 rounded-lg outline-none w-[50%]"
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={getCurrentDateTime()}
            required
          />
        </div>
        <button className="rounded-lg p-4 w-[50%]" type="submit">
          {isLoading ? "Loading..." : "Book Appointment"}
        </button>
      </form>
      {message && (
        <p className="text-center text-[#258525] font-medium">{message}</p>
      )}
    </div>
  );
};

export default BookingForm;
