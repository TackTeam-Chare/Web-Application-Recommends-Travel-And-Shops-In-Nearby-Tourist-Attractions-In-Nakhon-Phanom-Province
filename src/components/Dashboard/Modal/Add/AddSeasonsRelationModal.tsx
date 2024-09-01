'use client';

import React, { useEffect, useState, FC, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { createSeasonsRelation } from '@/services/admin/insert';
import { getSeasons, getPlaces } from '@/services/admin/get';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaPlus, FaTimes } from 'react-icons/fa'; // Import icons

interface FormData {
  tourism_entities_id: number; 
  season_id: number; 
}

interface Season {
  id: number; 
  name: string;
}

interface Place {
  id: number; 
  name: string;
}

interface AddSeasonsRelationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSeasonsRelationModal: FC<AddSeasonsRelationModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [touristEntities, setTouristEntities] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [seasonsData, touristEntitiesData] = await Promise.all([
          getSeasons(),
          getPlaces()
        ]);
        setSeasons(seasonsData);
        setTouristEntities(touristEntitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createSeasonsRelation(data);
      toast.success('ความสัมพันธ์ถูกสร้างสำเร็จ', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onClose();  // Close modal on success
    } catch (error) {
      console.error('Error creating relation:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างความสัมพันธ์', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                    เพิ่มความสัมพันธ์ระหว่างฤดูกาลและสถานที่ท่องเที่ยว
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="tourism_entities_id" className="block text-sm font-medium text-gray-700">สถานที่ท่องเที่ยว</label>
                      <div className="mt-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        <select
                          id="tourism_entities_id"
                          {...register('tourism_entities_id', { required: 'กรุณาเลือกสถานที่ท่องเที่ยว', valueAsNumber: true })}
                          className="block w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-Orange-500 focus:ring-Orange-500 sm:text-sm"
                        >
                          <option value="">เลือกสถานที่ท่องเที่ยว</option>
                          {touristEntities.map(entity => (
                            <option key={entity.id} value={entity.id}>{entity.name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.tourism_entities_id && <p className="text-red-500 text-xs mt-1">{errors.tourism_entities_id.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="season_id" className="block text-sm font-medium text-gray-700">ฤดูกาล</label>
                      <div className="mt-1 flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-500" />
                        <select
                          id="season_id"
                          {...register('season_id', { required: 'กรุณาเลือกฤดูกาล', valueAsNumber: true })}
                          className="block w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-Orange-500 focus:ring-Orange-500 sm:text-sm"
                        >
                          <option value="">เลือกฤดูกาล</option>
                          {seasons.map(season => (
                            <option key={season.id} value={season.id}>
                              {season.name} (ID: {season.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.season_id && <p className="text-red-500 text-xs mt-1">{errors.season_id.message}</p>}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes />
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-Orange-600 text-white px-4 py-2 rounded-md hover:bg-Orange-700 transition duration-300 ease-in-out flex items-center gap-2"
                      >
                        <FaPlus />
                        เพิ่มความสัมพันธ์
                      </button>
                    </div>
                  </form>
                  <ToastContainer />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddSeasonsRelationModal;
