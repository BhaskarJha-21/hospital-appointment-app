import React, { useState, useEffect } from "react";

const AppointmentForm = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    department: "",
    date: "",
    timeSlot: "",
    abhaId: "",
    message: "",
    saveDetails: false,
  });

  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [hospitalSelected, setHospitalSelected] = useState(false);

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
  ];

  const hospitals = [
    "AIIMS Delhi",
    "Safdarjung Hospital",
    "Max Super Specialty Hospital",
    "Fortis Hospital",
    "Apollo Hospital",
    "BLK Super Specialty Hospital",
    "Sir Ganga Ram Hospital",
    "Lok Nayak Hospital",
    "Ram Manohar Lohia Hospital",
    "GTB Hospital",
  ];

  const timeSlotOptions = {
    Cardiology: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    Neurology: ["12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM"],
    Orthopedics: ["03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"],
    Pediatrics: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    Gynecology: ["12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM"],
    Dermatology: ["03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors on change
  };

  const validateSlide = () => {
    let newErrors = {};
    if (currentSlide === 0) {
      if (!formData.name) newErrors.name = "Full Name is required.";
      if (!formData.email) newErrors.email = "Email Address is required.";
      if (!formData.phone) newErrors.phone = "Phone Number is required.";
    }
    if (currentSlide === 1) {
      if (!formData.hospital) newErrors.hospital = "Hospital is required.";
      if (!formData.department) newErrors.department = "Department is required.";
      if (!formData.date) newErrors.date = "Date is required.";
      if (!formData.timeSlot) newErrors.timeSlot = "Time Slot is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextSlide = () => {
    if (validateSlide()) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleSuggestions = (e) => {
    const query = e.target.value.toLowerCase();
    setFormData({ ...formData, hospital: e.target.value });
    if (query.length > 0) {
      const filteredHospitals = hospitals.filter((hospital) =>
        hospital.toLowerCase().includes(query)
      );
      setHospitalSuggestions(filteredHospitals);
    } else {
      setHospitalSuggestions([]);
    }
  };

  const handleSelectHospital = (hospital) => {
    setFormData({ ...formData, hospital });
    setHospitalSuggestions([]);
    setHospitalSelected(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSlide()) {
      const storageKey = bookingForSelf ? "appointmentFormDataSelf" : "appointmentFormDataOther";
      if (formData.saveDetails) {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      }
      alert("Appointment booked successfully!");
      // Reset form to the first slide
      setCurrentSlide(0);
      setFormData({
        name: "",
        email: "",
        phone: "",
        hospital: "",
        department: "",
        date: "",
        timeSlot: "",
        abhaId: "",
        message: "",
        saveDetails: false,
      });
      setHospitalSelected(false);
    }
  };

  useEffect(() => {
    if (formData.department) {
      setTimeSlots(timeSlotOptions[formData.department]);
    } else {
      setTimeSlots([]);
    }
  }, [formData.department]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-purple-400 to-blue-500 md:p-10">
      <div className="w-full max-w-lg overflow-hidden transition duration-500 transform bg-white rounded-lg shadow-xl hover:shadow-2xl">
        <h2 className="mt-4 mb-6 text-3xl font-bold text-center text-blue-700 animate-pulse">
          Hospital Appointment Form
        </h2>

        {/* Booking Choice */}
        <div className="px-8 mb-6">
          <label className="block mb-2 font-bold text-blue-700">Booking for:</label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="bookingType"
                checked={bookingForSelf}
                onChange={() => setBookingForSelf(true)}
                className="w-4 h-4 text-blue-600 form-radio"
              />
              <span className="ml-2 text-blue-600">Self</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="bookingType"
                checked={!bookingForSelf}
                onChange={() => setBookingForSelf(false)}
                className="w-4 h-4 text-blue-600 form-radio"
              />
              <span className="ml-2 text-blue-600">Someone Else</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentSlide === 0 && (
            <div className="px-8 mb-4 space-y-4">
              <div>
                <label htmlFor="name" className="block font-semibold text-blue-700">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold text-blue-700">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block font-semibold text-blue-700">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
              <button
                type="button"
                className="w-full px-4 py-3 mt-4 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={handleNextSlide}
              >
                Next
              </button>
            </div>
          )}

          {currentSlide === 1 && (
            <div className="px-8 space-y-4">
              <div>
                <label htmlFor="hospital" className="block font-semibold text-blue-700">
                  Search or Select Hospital <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.hospital}
                  onChange={handleSuggestions}
                  required
                />
                {errors.hospital && <p className="text-sm text-red-500">{errors.hospital}</p>}
                {hospitalSuggestions.length > 0 && (
                  <ul className="mt-2 border rounded-lg">
                    {hospitalSuggestions.map((hospital, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectHospital(hospital)}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                      >
                        {hospital}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <label htmlFor="hospitalSelect" className="block font-semibold text-blue-700">
                    Or Select Hospital from List
                  </label>
                  <select
                    id="hospitalSelect"
                    className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                    value={formData.hospital}
                    onChange={(e) => handleSelectHospital(e.target.value)}
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital, index) => (
                      <option key={index} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="department" className="block font-semibold text-blue-700">
                  Department <span className="text-red-600">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block font-semibold text-blue-700">
                  Preferred Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="timeSlot" className="block font-semibold text-blue-700">
                  Time Slot <span className="text-red-600">*</span>
                </label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot}</p>}
              </div>

              <div className="flex justify-between pb-4">
                <button
                  type="button"
                  className="w-1/2 px-4 py-3 mt-4 mr-2 text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-700"
                  onClick={handlePrevSlide}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="w-1/2 px-4 py-3 mt-4 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={handleNextSlide}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="px-8 space-y-4">
              <div>
                <label htmlFor="abhaId" className="block font-semibold text-blue-700">
                  ABHA ID (if available)
                </label>
                <input
                  type="text"
                  id="abhaId"
                  name="abhaId"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.abhaId}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-semibold text-blue-700">
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full p-3 transition duration-150 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any specific concerns or requests?"
                ></textarea>
              </div>

              {/* Save Details Checkbox moved to Slide 3 */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="saveDetails"
                    className="form-checkbox"
                    checked={formData.saveDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, saveDetails: e.target.checked })
                    }
                  />
                  <span className="text-blue-700">Save details for future appointments</span>
                  {/* Info icon */}
                  <span
                    className="relative cursor-pointer group"
                    title="This will save your information locally for future use."
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 00-2 0v3a1 1 0 002 0v-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </label>
              </div>

              <div className="flex justify-between pb-4">
                <button
                  type="button"
                  className="w-1/2 px-4 py-3 mt-4 mr-2 text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-700"
                  onClick={handlePrevSlide}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="w-1/2 px-4 py-3 mt-4 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
