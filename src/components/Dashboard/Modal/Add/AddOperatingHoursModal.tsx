'use client';

import React, { FC, useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { createOperatingHours } from '@/services/admin/insert';
import { getPlaces } from '@/services/admin/get';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Place {
  id: number;
  name: string;
  image_path?: string | null;
  image_url?: string | null;
  [key: string]: any;
}

interface FormData {
  place_id: string;
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

interface AddOperatingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddOperatingHoursModal: FC<AddOperatingHoursModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        const placesData: Place[] = await getPlaces();
        setPlaces(placesData);
      } catch (error) {
        console.error('Error fetching places:', error);
        toast.error('Error fetching places');
      }
    };

    fetchPlaces();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await createOperatingHours(data);
      toast.success(`เวลาเปิดทำการถูกสร้างสำเร็จด้วย ID: ${response.id}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error creating operating hours:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างเวลาเปิดทำการ', {
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    เพิ่มเวลาเปิดทำการ
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="place_id" className="block text-sm font-medium text-gray-700">สถานที่</label>
                      <select
                        id="place_id"
                        {...register('place_id', { required: 'กรุณาเลือกสถานที่' })}
                        className={`mt-1 block w-full border ${errors.place_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      >
                        <option value="">เลือกสถานที่</option>
                        {places.map((place) => (
                          <option key={place.id} value={place.id}>
                            (ID: {place.id}) {place.name}
                          </option>
                        ))}
                      </select>
                      {errors.place_id && <p className="text-red-500 text-xs mt-1">{errors.place_id.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">วันในสัปดาห์</label>
                      <select
                        id="day_of_week"
                        {...register('day_of_week', { required: 'กรุณาเลือกวันในสัปดาห์' })}
                        className={`mt-1 block w-full border ${errors.day_of_week ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      >
                        <option value="">เลือกวัน</option>
                        <option value="Sunday">วันอาทิตย์</option>
                        <option value="Monday">วันจันทร์</option>
                        <option value="Tuesday">วันอังคาร</option>
                        <option value="Wednesday">วันพุธ</option>
                        <option value="Thursday">วันพฤหัสบดี</option>
                        <option value="Friday">วันศุกร์</option>
                        <option value="Saturday">วันเสาร์</option>
                      </select>
                      {errors.day_of_week && <p className="text-red-500 text-xs mt-1">{errors.day_of_week.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="opening_time" className="block text-sm font-medium text-gray-700">เวลาเปิด</label>
                      <input
                        id="opening_time"
                        type="time"
                        {...register('opening_time', { required: 'กรุณาระบุเวลาเปิด' })}
                        className={`mt-1 block w-full border ${errors.opening_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.opening_time && <p className="text-red-500 text-xs mt-1">{errors.opening_time.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="closing_time" className="block text-sm font-medium text-gray-700">เวลาปิด</label>
                      <input
                        id="closing_time"
                        type="time"
                        {...register('closing_time', { required: 'กรุณาระบุเวลาปิด' })}
                        className={`mt-1 block w-full border ${errors.closing_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.closing_time && <p className="text-red-500 text-xs mt-1">{errors.closing_time.message}</p>}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        เพิ่มเวลาเปิดทำการ
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

export default AddOperatingHoursModal;
