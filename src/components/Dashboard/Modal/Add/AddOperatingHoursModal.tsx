'use client';

import React, { FC, useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { createOperatingHours } from '@/services/admin/insert';
import { getPlaces } from '@/services/admin/get';
import { FaClock, FaCalendarDay, FaMapMarkerAlt, FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching places. Please try again.',
        });
      }
    };

    fetchPlaces();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await createOperatingHours(data);
      MySwal.fire({
        icon: 'success',
        title: 'สร้างเวลาเปิดทำการสำเร็จ',
        text: `เวลาเปิดทำการถูกสร้างสำเร็จด้วย ID: ${response.id}`,
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();
    } catch (error) {
      console.error('Error creating operating hours:', error);

      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างเวลาเปิดทำการได้ กรุณาลองใหม่อีกครั้ง.',
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
                      <div className="mt-1 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        <select
                          id="place_id"
                          {...register('place_id', { required: 'กรุณาเลือกสถานที่' })}
                          className={`mt-1 block w-full border ${errors.place_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm`}
                        >
                          <option value="">เลือกสถานที่</option>
                          {places.map((place) => (
                            <option key={place.id} value={place.id}>
                              (ID: {place.id}) {place.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.place_id && <p className="text-red-500 text-xs mt-1">{errors.place_id.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">วันในสัปดาห์</label>
                      <div className="mt-1 flex items-center">
                        <FaCalendarDay className="mr-2 text-gray-500" />
                        <select
                          id="day_of_week"
                          {...register('day_of_week', { required: 'กรุณาเลือกวันในสัปดาห์' })}
                          className={`mt-1 block w-full border ${errors.day_of_week ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm`}
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
                      </div>
                      {errors.day_of_week && <p className="text-red-500 text-xs mt-1">{errors.day_of_week.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="opening_time" className="block text-sm font-medium text-gray-700">เวลาเปิด</label>
                      <div className="mt-1 flex items-center">
                        <FaClock className="mr-2 text-gray-500" />
                        <input
                          id="opening_time"
                          type="time"
                          {...register('opening_time', { required: 'กรุณาระบุเวลาเปิด' })}
                          className={`mt-1 block w-full border ${errors.opening_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm`}
                        />
                      </div>
                      {errors.opening_time && <p className="text-red-500 text-xs mt-1">{errors.opening_time.message}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="closing_time" className="block text-sm font-medium text-gray-700">เวลาปิด</label>
                      <div className="mt-1 flex items-center">
                        <FaClock className="mr-2 text-gray-500" />
                        <input
                          id="closing_time"
                          type="time"
                          {...register('closing_time', { required: 'กรุณาระบุเวลาปิด' })}
                          className={`mt-1 block w-full border ${errors.closing_time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm`}
                        />
                      </div>
                      {errors.closing_time && <p className="text-red-500 text-xs mt-1">{errors.closing_time.message}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes />
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center gap-2"
                      >
                        <FaPlus />
                        เพิ่มเวลาเปิดทำการ
                      </button>
                    </div>
                  </form>
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
