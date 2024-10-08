'use client';

import React, { useEffect, useState, FC, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { getSeasonById } from '@/services/admin/get';
import { updateSeason } from '@/services/admin/edit';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaSave, FaSpinner } from 'react-icons/fa';

interface SeasonForm {
  name: string;
  date_start: string;
  date_end: string;
}

interface EditSeasonModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const MySwal = withReactContent(Swal);

const EditSeasonModal: FC<EditSeasonModalProps> = ({ id, isOpen, onClose }) => {
  const numericId = Number(id);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SeasonForm>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const season = await getSeasonById(numericId);
        setValue('name', season.name);
        setValue('date_start', season.date_start.split('T')[0]);
        setValue('date_end', season.date_end.split('T')[0]);
        setIsLoading(false);
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการดึงข้อมูลฤดูกาล',
        });
        setIsLoading(false);
      }
    };

    if (!isNaN(numericId)) {
      fetchSeason();
    } else {
      MySwal.fire({
        icon: 'error',
        title: 'รหัสไม่ถูกต้อง',
      });
      setIsLoading(false);
    }
  }, [numericId, setValue]);

  const onSubmit: SubmitHandler<SeasonForm> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateSeason(numericId, data);
      MySwal.fire({
        icon: 'success',
        title: 'อัปเดตฤดูกาลสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        onClose();
        router.push('/dashboard/table/seasons');
      }, 2000);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการอัปเดตฤดูกาล',
      });
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
                        แก้ไขฤดูกาล
                      </Dialog.Title>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            id="name"
                            type="text"
                            {...register('name', { required: 'กรุณากรอกชื่อฤดูกาล' })}
                            className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="name"
                            className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                              errors.name ? 'text-red-500' : ''
                            }`}
                          >
                            ชื่อฤดูกาล
                          </label>
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            id="date_start"
                            type="date"
                            {...register('date_start', { required: 'กรุณาเลือกวันที่เริ่มต้น' })}
                            className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="date_start"
                            className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                              errors.date_start ? 'text-red-500' : ''
                            }`}
                          >
                            วันที่เริ่มต้น
                          </label>
                          {errors.date_start && <p className="text-red-500 text-xs mt-1">{errors.date_start.message}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            id="date_end"
                            type="date"
                            {...register('date_end', { required: 'กรุณาเลือกวันที่สิ้นสุด' })}
                            className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-Orange-600 peer"
                            placeholder=" "
                          />
                          <label
                            htmlFor="date_end"
                            className={`absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-Orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6 ${
                              errors.date_end ? 'text-red-500' : ''
                            }`}
                          >
                            วันที่สิ้นสุด
                          </label>
                          {errors.date_end && <p className="text-red-500 text-xs mt-1">{errors.date_end.message}</p>}
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditSeasonModal;
