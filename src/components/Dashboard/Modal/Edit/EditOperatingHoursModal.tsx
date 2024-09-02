'use client';

import React, { useEffect, useState, FC, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { getOperatingHoursById, getPlaces } from '@/services/admin/get';
import { updateOperatingHours } from '@/services/admin/edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSpinner } from 'react-icons/fa';

interface OperatingHour {
  place_id: string;
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

interface FormData {
  place_id: string;
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

interface EditOperatingHoursModalProps {
  id: string;  // id is of type string
  isOpen: boolean;
  onClose: () => void;
}

const EditOperatingHoursModal: FC<EditOperatingHoursModalProps> = ({ id, isOpen, onClose }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [placeName, setPlaceName] = useState<string>('');

  const numericId = Number(id);

  useEffect(() => {
    const fetchOperatingHour = async () => {
      try {
        const operatingHour: OperatingHour = await getOperatingHoursById(numericId);
        setValue('place_id', operatingHour.place_id);
        setValue('day_of_week', operatingHour.day_of_week);
        setValue('opening_time', operatingHour.opening_time);
        setValue('closing_time', operatingHour.closing_time);

        const placesData = await getPlaces();
        setPlaces(placesData);

        const place = placesData.find(p => p.id.toString() === operatingHour.place_id);
        if (place) {
          setPlaceName(`ID: ${place.id} - ${place.name}`);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเวลาทำการ:', error);
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลเวลาทำการ');
      } finally {
        setIsLoading(false);
      }
    };

    if (numericId) {
      fetchOperatingHour();
    }
  }, [numericId, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateOperatingHours(numericId, data);
      toast.success('อัปเดตเวลาทำการสำเร็จ');
      setTimeout(() => {
        onClose();
        router.push('/dashboard/table/time');
      }, 2000);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเวลาทำการ:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตเวลาทำการ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <FaSpinner className="animate-spin text-Orange-600 text-3xl" />
                    </div>
                  ) : (
                    <>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        แก้ไขเวลาทำการ
                      </Dialog.Title>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="relative z-0 w-full mb-6 group">
                          <label htmlFor="place_id" className="block text-sm font-medium text-gray-700">สถานที่</label>
                          <input
                            id="place_id"
                            value={placeName}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm bg-gray-200 cursor-not-allowed"
                          />
                          <input
                            type="hidden"
                            {...register('place_id', { required: 'กรุณาเลือกสถานที่' })}
                          />
                          {errors.place_id && <p className="text-red-500 text-xs mt-1">{errors.place_id.message}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">วันในสัปดาห์</label>
                          <select
                            id="day_of_week"
                            {...register('day_of_week', { required: 'กรุณาเลือกวันในสัปดาห์' })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm"
                          >
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
                            {...register('opening_time', { required: 'กรุณาเลือกเวลาเปิด' })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm"
                          />
                          {errors.opening_time && <p className="text-red-500 text-xs mt-1">{errors.opening_time.message}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label htmlFor="closing_time" className="block text-sm font-medium text-gray-700">เวลาปิด</label>
                          <input
                            id="closing_time"
                            type="time"
                            {...register('closing_time', { required: 'กรุณาเลือกเวลาปิด' })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm"
                          />
                          {errors.closing_time && <p className="text-red-500 text-xs mt-1">{errors.closing_time.message}</p>}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500"
                            onClick={onClose}
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-Orange-600 border border-transparent rounded-md shadow-sm hover:bg-Orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            <span className="ml-2">{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                          </button>
                        </div>
                      </form>
                    </>
                  )}
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

export default EditOperatingHoursModal;
