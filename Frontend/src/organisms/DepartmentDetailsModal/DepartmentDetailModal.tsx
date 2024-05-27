// import React, { useState } from 'react';
// import { FiEdit } from 'react-icons/fi';

// export default function DepartmentDetailsModal({ department, onSave, onClose }) {
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editedDepartment, setEditedDepartment] = useState({ ...department });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditedDepartment({ ...editedDepartment, [name]: value });
//     };

//     const handleSave = async () => {
//         await onSave(editedDepartment);
//         setIsEditMode(false);
//     };

//     return (
//         <div className="bg-white p-8 rounded-md w-100 shadow-md overflow-y-auto max-h-100  ">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Department Details</h2>
//                 {!isEditMode && (
//                     <button onClick={() => setIsEditMode(true)}>
//                         <FiEdit className="text-gray-600 cursor-pointer" />
//                     </button>
//                 )}
//             </div>
//             <div>
//                 <div className="flex flex-col space-y-2">
//                     <div className="flex items-center">
//                         <span className="font-semibold ">Organisation Name:</span>
//                         {isEditMode ? 
//                             <input type="text" name="organisation_name" value={editedDepartment.organisation_name} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> 
//                             : <span>{department.organisation_name}</span>}
//                     </div>
//                     <div className="flex items-center">
//                         <span className="font-semibold ">Department Name:</span>
//                         {isEditMode ? 
//                             <input type="text" name="name" value={editedDepartment.name} onChange={handleInputChange} className="border-gray-300 rounded-md w-full p-1" /> 
//                             : <span>{department.name}</span>}
//                     </div>
//                     <div className="mt-4">
//                         <h3 className="font-semibold">Users:</h3>
//                         <ul className="list-disc pl-4 mt-2">
//                             {department.users.map((user, index) => (
//                                 <li key={index}>
//                                     <p>
//                                         <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email} , <strong>Status:</strong> {user.active.toString()}
//                                     </p>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {isEditMode && (
//                 <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Save Changes</button>
//             )}

//             <button onClick={onClose} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">Close</button>
//         </div>
        
//     );
// }


import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import './DepartmentDetailModal.scss'

interface Department {
    _id: string;
    organisation_name: string;
    name: string;
    users: {
        name: string;
        email: string;
        active: boolean;
    }[];
}

interface DepartmentDetailsModalProps {
    department: Department;
    onSave: (department: Department ) => Promise<void>;
    onClose: () => void;
}

const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({ department, onSave, onClose }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedDepartment, setEditedDepartment] = useState<Department>({ ...department });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedDepartment({ ...editedDepartment, [name]: value });
    };

    const handleSave = async () => {
        await onSave(editedDepartment);
        setIsEditMode(false);
    };

    return (
        <div className="bg-white p-8 rounded-md w-100 shadow-md overflow-y-auto max-h-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Department Details</h2>
                {!isEditMode && (
                    <button onClick={() => setIsEditMode(true)}>
                        <FiEdit className="text-gray-600 cursor-pointer" />
                    </button>
                )}
            </div>
            <div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <span className="font-semibold">Organisation Name:</span>
                            <span>{department.organisation_name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold">Department Name:</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                name="name"
                                value={editedDepartment.name}
                                onChange={handleInputChange}
                                className="border-gray-300 rounded-md w-full p-1"
                            />
                        ) : (
                            <span>{department.name}</span>
                        )}
                    </div>
                    <div className="mt-4">
                        <h3 className="font-semibold">Users:</h3>
                        <ul className="list-disc pl-4 mt-2">
                            {department.users.map((user, index) => (
                                <li key={index}>
                                    <p>
                                        <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email},{' '}
                                        <strong>Status:</strong> {user.active.toString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isEditMode && (
                <button onClick={handleSave} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">
                    Save Changes
                </button>
            )}

            <button onClick={onClose} className="bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md mt-4 w-full">
                Close
            </button>
        </div>
    );
};

export default DepartmentDetailsModal;
