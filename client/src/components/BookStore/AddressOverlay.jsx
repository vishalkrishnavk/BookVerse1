import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { updateUserAddress } from "../../redux/userSlice";
import toast from "react-hot-toast";

const AddressOverlay = ({ address, onClose, onSubmit }) => {
  const [editedAddress, setEditedAddress] = useState(address || "");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedAddress.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    try {
      const result = await dispatch(updateUserAddress(editedAddress)).unwrap();
      onSubmit(result.address); // Pass the updated address from the response
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update address");
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-full bg-zinc-800 opacity-80 z-40"></div>
      <div className="fixed top-0 left-0 h-screen w-full flex items-center justify-center z-50">
        <div className="bg-secondary rounded-lg p-6 w-[90%] md:w-[60%] lg:w-[40%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-ascent-1">
              Delivery Address
            </h2>
            <button onClick={onClose} className="text-ascent-1">
              <RxCross1 />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
              className="w-full h-32 p-3 rounded bg-primary text-ascent-1 border border-ascent-2/20"
              placeholder="Enter your delivery address..."
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-red-100 text-red-700 border border-red-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-ascent-1 hover:bg-primary/80"
              >
                Update & Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressOverlay;
