'use client';

import React, { FC, useState, useEffect, Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { getPlaces } from '@/services/admin/get';
import { uploadTourismImages } from '@/services/admin/insert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt, FaUpload } from 'react-icons/fa';


interface FormData {
  tourism_entities_id: string;
  image_paths: FileList;
}

interface Place {
  id: number;
  name: string;
}

interface UploadImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadImagesModal: FC<UploadImagesModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesData: Place[] = await getPlaces();
        setPlaces(placesData);
      } catch (error) {
        console.error('Error fetching places:', error);
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่');
      }
    };

    fetchPlaces();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    formData.append('tourism_entities_id', data.tourism_entities_id);
    for (let i = 0; i < data.image_paths.length; i++) {
      formData.append('image_paths', data.image_paths[i]);
    }

    try {
      await uploadTourismImages(formData);
      toast.success('อัปโหลดรูปภาพสำเร็จ', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        onClose();
        router.push('/dashboard/table/images');
      }, 2000);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', {
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    อัปโหลดรูปภาพ
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="relative z-0 w-full mb-6 group">
                      <label className="block text-sm font-medium text-gray-700">สถานที่ท่องเที่ยว</label>
                      <div className="flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                        <select
                          {...register('tourism_entities_id', { required: 'กรุณาเลือกสถานที่' })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-Orange-500 focus:border-Orange-500 sm:text-sm"
                        >
                          <option value="">เลือกสถานที่</option>
                          {places.map((place) => (
                            <option key={place.id} value={place.id}>{place.name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.tourism_entities_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.tourism_entities_id.message}</p>
                      )}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <label className="block text-sm font-medium text-gray-700">รูปภาพ</label>
                      <div className="flex items-center mt-1">
                        <FaUpload className="mr-2 text-gray-500" />
                        <input
                          type="file"
                          {...register('image_paths', { required: 'กรุณาเลือกรูปภาพ' })}
                          multiple
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-Orange-50 file:text-Orange-700 hover:file:bg-Orange-100"
                        />
                      </div>
                      {errors.image_paths && (
                        <p className="text-red-500 text-xs mt-1">{errors.image_paths.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-Orange-600 hover:bg-Orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Orange-500 flex items-center gap-2"
                    >
                      <FaUpload />
                      อัปโหลด
                    </button>
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

export default UploadImagesModal;
