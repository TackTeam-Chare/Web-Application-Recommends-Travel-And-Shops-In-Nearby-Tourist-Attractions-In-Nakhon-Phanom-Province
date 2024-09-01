"use client";

import React, { useEffect, useState, FC, Fragment } from "react";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { getPlaceById, getDistricts, getCategories, getSeasons } from "@/services/admin/get";
import { updateTouristEntity } from "@/services/admin/edit";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMapMarkerAlt, faTags, faSnowflake, faGlobe, faUpload, faClock } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import "react-toastify/dist/ReactToastify.css";

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
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { register, handleSubmit, setValue, control, formState: { isDirty } } = useForm<FormData>({
    defaultValues: {
      operating_hours: [{ day_of_week: "", opening_time: "", closing_time: "" }],
      published: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_hours",
  });

  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);
  const [existingImages, setExistingImages] = useState<{ image_url: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, categoriesData, seasonsData, placeData] = await Promise.all([
          getDistricts(),
          getCategories(),
          getSeasons(),
          getPlaceById(parseInt(id, 10)),
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
        console.error("ไม่สามารถดึงข้อมูลได้", error);
        toast.error("ไม่สามารถดึงข้อมูลได้ กรุณาลองอีกครั้ง");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files.map((file) => file.name));
  };

  const onSubmit = async (data: FormData) => {
    if (!isDirty) {
      toast.warn("ไม่มีการเปลี่ยนแปลงข้อมูล");
      return;
    }

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

      const response = await updateTouristEntity(parseInt(id, 10), formDataToSend);
      if (!response) {
        throw new Error("ไม่สามารถอัปเดตสถานที่ได้");
      }

      toast.success("อัปเดตสถานที่สำเร็จ!");
      setTimeout(() => {
        onClose();
        router.push("/dashboard/table/place");
      }, 2000);
    } catch (error) {
      console.error("ไม่สามารถอัปเดตสถานที่ได้", error);
      toast.error("ไม่สามารถอัปเดตสถานที่ได้ กรุณาลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      toast.warn("คุณต้องการปิดโดยไม่บันทึกการเปลี่ยนแปลงหรือไม่?", {
        autoClose: 3000,
        onClose: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                    <div className="relative z-0 w-full mb-6 group">
                      <FontAwesomeIcon icon={faGlobe} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        {...register("name")}
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        ชื่อ
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <FontAwesomeIcon icon={faTags} className="absolute left-3 top-3 text-gray-400" />
                      <textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="description"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        คำอธิบาย
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        id="location"
                        {...register("location")}
                        className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="location"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        ตำแหน่ง
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="relative z-0 w-full group">
                        <FontAwesomeIcon icon={faGlobe} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          id="latitude"
                          {...register("latitude")}
                          className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="latitude"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          ละติจูด
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <FontAwesomeIcon icon={faGlobe} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          id="longitude"
                          {...register("longitude")}
                          className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="longitude"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          ลองจิจูด
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="relative z-0 w-full group">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3 text-gray-400" />
                        <select
                          id="district_name"
                          {...register("district_name")}
                          className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">เลือกอำเภอ</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="district_name"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          อำเภอ
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <FontAwesomeIcon icon={faTags} className="absolute left-3 top-3 text-gray-400" />
                        <select
                          id="category_name"
                          {...register("category_name")}
                          className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">เลือกหมวดหมู่</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="category_name"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          หมวดหมู่
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <FontAwesomeIcon icon={faSnowflake} className="absolute left-3 top-3 text-gray-400" />
                        <select
                          id="season_id"
                          {...register("season_id")}
                          className="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">เลือกฤดู</option>
                          {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="season_id"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-10 -z-10 origin-[0] peer-focus:left-10 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          ฤดู
                        </label>
                      </div>
                    </div>
                    
                    {/* Operating Hours Section */}
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="operating_hours" className="block text-sm font-medium text-gray-700">เวลาทำการ</label>
                      {fields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-4 gap-4 mb-4 items-center">
                          <div className="relative">
                            <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-gray-400" />
                            <select
                              {...register(`operating_hours.${index}.day_of_week`)}
                              className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                            >
                              <option value="">วันในสัปดาห์</option>
                              <option value="Sunday">วันอาทิตย์</option>
                              <option value="Monday">วันจันทร์</option>
                              <option value="Tuesday">วันอังคาร</option>
                              <option value="Wednesday">วันพุธ</option>
                              <option value="Thursday">วันพฤหัสบดี</option>
                              <option value="Friday">วันศุกร์</option>
                              <option value="Saturday">วันเสาร์</option>
                            </select>
                          </div>
                          <div className="relative">
                            <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="time"
                              {...register(`operating_hours.${index}.opening_time`)}
                              className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                            />
                          </div>
                          <div className="relative">
                            <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="time"
                              {...register(`operating_hours.${index}.closing_time`)}
                              className="block py-2 pl-10 pr-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => append({ day_of_week: "", opening_time: "", closing_time: "" })}
                        className="col-span-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        เพิ่มเวลาทำการ
                      </button>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="image_paths" className="block text-sm font-medium leading-6 text-gray-900">รูปภาพปก</label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <FontAwesomeIcon icon={faImage} className="mx-auto h-12 w-12 text-gray-300" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>อัปโหลดไฟล์</span>
                              <input
                                id="file-upload"
                                type="file"
                                multiple
                                className="sr-only"
                                {...register("image_paths", { onChange: handleFileChange })}
                              />
                            </label>
                            <p className="pl-1">หรือลากและวาง</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF สูงสุด 10MB</p>
                          <p className="text-xs leading-5 text-red-600">คุณสามารถอัพโหลดภาพได้ไม่เกิน 10 ภาพ</p>
                        </div>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium text-gray-700">ไฟล์ที่อัปโหลด:</h3>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {uploadedFiles.map((fileName, index) => (
                              <li key={index}>{fileName}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="checkbox"
                        id="published"
                        {...register("published")}
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <label
                        htmlFor="published"
                        className="ml-2 block text-sm leading-5 text-gray-900"
                      >
                        เผยแพร่
                      </label>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={handleClose}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className={`bg-indigo-600 text-white px-4 py-2 rounded-md ${
                          submitting ? "bg-opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
                        }`}
                        disabled={submitting}
                      >
                        {submitting ? "กำลังอัปเดต..." : "อัปเดตสถานที่"}
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

      {/* Image View Modal */}
      <Transition appear show={imageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setImageModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected image"
                    width={500}
                    height={500}
                    className="object-cover rounded-md"
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditPlaceModal;
