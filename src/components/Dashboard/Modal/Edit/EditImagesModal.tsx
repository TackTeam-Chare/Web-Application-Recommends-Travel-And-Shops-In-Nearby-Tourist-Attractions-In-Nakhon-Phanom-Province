'use client';

import React, { useEffect, useState, FC, Fragment } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { getPlaceImagesById, getPlaceById} from '@/services/admin/get';
import {  updateTourismImages } from '@/services/admin/edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSpinner } from 'react-icons/fa';

interface FormData {
  tourism_entities_id: string;
  image_paths: FileList;
}

interface ImageData {
  id: number;
  image_url: string;
  image_path: string;
  tourism_entities_id: number;
}

interface EditImagesModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditImagesModal: FC<EditImagesModalProps> = ({ id, isOpen, onClose }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const numericId = Number(id);

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const image: ImageData = await getPlaceImagesById(numericId);
        const place = await getPlaceById(image.tourism_entities_id);
        setValue('tourism_entities_id', `Id:${image.tourism_entities_id} ${place.name}`);
        setPlaceName(place.name);
        setExistingImages([image]);
        setIsLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        setIsLoading(false);
      }
    };

    if (numericId) {
      fetchEntity();
    }
  }, [numericId, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('tourism_entities_id', data.tourism_entities_id);
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('image_paths', imageFiles[i]);
    }

    try {
      await updateTourismImages(numericId, formData);
      toast.success('อัปเดตรูปภาพสำเร็จ');
      setTimeout(() => {
        onClose();
        router.push('/dashboard/table/images');
      }, 2000);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตรูปภาพ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
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
                      <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
                    </div>
                  ) : (
                    <>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        แก้ไขรูปภาพสำหรับ {placeName}
                      </Dialog.Title>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="relative z-0 w-full mb-6 group">
                          <label className="block text-sm font-medium text-gray-700">สถานที่ท่องเที่ยว</label>
                          <input
                            type="text"
                            {...register('tourism_entities_id')}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-200 cursor-not-allowed"
                          />
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label className="block text-sm font-medium text-gray-700">รูปภาพที่มีอยู่</label>
                          <div className="grid grid-cols-2 gap-4">
                            {existingImages.length > 0 ? (
                              existingImages.map((image) => (
                                <Image
                                  key={image.id}
                                  src={image.image_url}
                                  alt={image.image_path}
                                  width={100}
                                  height={100}
                                  className="w-full h-24 object-cover rounded-lg"
                                  priority
                                />
                              ))
                            ) : (
                              <p className="text-gray-500">ไม่มีรูปภาพ</p>
                            )}
                          </div>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label className="block text-sm font-medium text-gray-700">เพิ่มรูปภาพใหม่</label>
                          <input
                            type="file"
                            {...register('image_paths')}
                            multiple
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default EditImagesModal;
