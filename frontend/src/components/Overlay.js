import React from "react";
import promo from "../assets/promo1.png"


const Overlay = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fadeIn">
            <div className="relative inline-block overflow-hidden shadow-xl p-0 animate-zoomIn">
                <img
                    src={promo}
                    alt="Promo"
                    className="block w-auto h-auto max-w-[92vw] max-h-[92vh]"
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:right-5 text-white text-3xl md:text-6xl font-bold"
                >
                    ×
                </button>
            </div>
        </div>
    )
};

export default Overlay;