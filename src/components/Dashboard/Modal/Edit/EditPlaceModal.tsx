'use client';

import React, { useEffect, useState, FC, Fragment } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { getPlaceById, getDistricts, getCategories, getSeasons } from '@/services/admin/get';
import { updateTouristEntity } from '@/services/admin/edit';
import { useForm, useFieldArray } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { PhotoIcon } from '@heroicons/react/24/solid';
import 'react-toastify/dist/ReactToastify.css';

interface OperatingHour {
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

interface FormData {
  name: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  district_name: string;
  category_name: string;
  season_id: string;
  operating_hours: OperatingHour[];
  published: number;
  image_paths: FileList;
}

interface EditPlaceModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditPlaceModal: FC<EditPlaceModalProps> = ({ id, isOpen, onClose }) => {
  const numericId = parseInt(id, 10); // Ensure `id` is a number
  const router = useRouter();
  const { register, handleSubmit, setValue, control } = useForm<FormData>({
    defaultValues: {
      operating_hours: [{ day_of_week: "", opening_time: "", closing_time: "" }],
      published: 0
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_hours"
  });

  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);
  const [existingImages, setExistingImages] = useState<{ image_url: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, categoriesData, seasonsData, placeData] = await Promise.all([
          getDistricts(),
          getCategories(),
          getSeasons(),
          getPlaceById(numericId)
        ]);
        setDistricts(districtsData);
        setCategories(categoriesData);
        setSeasons(seasonsData);

        setValue("name", placeData.name);
        setValue("description", placeData.description);
        setValue("location", placeData.location);
        setValue("latitude", placeData.latitude);
        setValue("longitude", placeData.longitude);
        setValue("district_name", placeData.district_name || "");
        setValue("category_name", placeData.category_name || "");
        setValue("season_id", placeData.season_id || "");
        setValue("operating_hours", placeData.operating_hours || []);
        setValue("published", placeData.published === 1 ? 1 : 0);
        setExistingImages(placeData.images || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    };

    fetchData();
  }, [numericId, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files.map(file => file.name));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "image_paths" && data[key]) {
          const files = data[key] as FileList;
          for (let i = 0; i < files.length; i++) {
            formDataToSend.append(key, files[i]);
          }
        } else if (key === "operating_hours") {
          formDataToSend.append(key, JSON.stringify(data[key]));
        } else {
          formDataToSend.append(key, data[key as keyof FormData] as string);
        }
      });

      const response = await updateTouristEntity(numericId, formDataToSend);
      if (!response) {
        throw new Error("Failed to update place");
      }

      setError("");
      toast.success("อัพเดทสถานที่สำเร็จ!");
      setTimeout(() => {
        onClose();
        router.push('/dashboard/table/place');
      }, 2000);
    } catch (error) {
      console.error("Failed to update place", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานที่");
    } finally {
      setSubmitting(false);
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    แก้ไขสถานที่
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    {/* Form Fields */}
                    {/* Form content remains the same, ensuring responsive and accessible UI */}
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={submitting}
                      >
                        {submitting ? 'กำลังอัพเดท...' : 'บันทึก'}
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

export default EditPlaceModal;
