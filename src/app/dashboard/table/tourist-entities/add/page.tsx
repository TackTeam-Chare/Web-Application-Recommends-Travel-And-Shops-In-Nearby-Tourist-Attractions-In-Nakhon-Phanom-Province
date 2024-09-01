'use client';

import React, { FC, Fragment, useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { createTouristEntity } from '@/services/admin/insert';
import { getDistricts, getCategories, getSeasons } from '@/services/admin/get';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { PhotoIcon } from '@heroicons/react/24/solid';

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
  image_paths: FileList;
  published: boolean;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      operating_hours: [{ day_of_week: "", opening_time: "", closing_time: "" }],
      published: false
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "operating_hours"
  });

  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsData, categoriesData, seasonsData] = await Promise.all([
          getDistricts(),
          getCategories(),
          getSeasons()
        ]);
        setDistricts(districtsData);
        setCategories(categoriesData);
        setSeasons(seasonsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files.map(file => file.name));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      for (const key of Object.keys(data) as (keyof FormData)[]) {
        if (key === "image_paths" && data[key]) {
          const files = data[key];
          if (files instanceof FileList) {
            for (let i = 0; i < files.length; i++) {
              formData.append(key, files[i]);
            }
          }
        } else if (key === "operating_hours") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key] as string);
        }
      }

      const response = await createTouristEntity(formData);
      if (!response) {
        throw new Error("Failed to create project");
      }

      toast.success("Project created successfully!");
      onClose();  // Close modal on success
    } catch (error) {
      console.error("Failed to create project", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
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
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Create Project
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        id="name"
                        {...register("name", { required: "Project name is required" })}
                        className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Project Name
                      </label>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                        className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="description"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Description
                      </label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        id="location"
                        {...register("location")}
                        className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        placeholder=" "
                      />
                      <label
                        htmlFor="location"
                        className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Location
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          id="latitude"
                          {...register("latitude")}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="latitude"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Latitude
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          id="longitude"
                          {...register("longitude")}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="longitude"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Longitude
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="relative z-0 w-full group">
                        <select
                          id="district_name"
                          {...register("district_name")}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="district_name"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          District
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <select
                          id="category_name"
                          {...register("category_name")}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="category_name"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Category
                        </label>
                      </div>
                      <div className="relative z-0 w-full group">
                        <select
                          id="season_id"
                          {...register("season_id")}
                          className="block py-2.5 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                        >
                          <option value="">Select Season</option>
                          {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.name}
                            </option>
                          ))}
                        </select>
                        <label
                          htmlFor="season_id"
                          className="absolute text-sm text-gray-500 bg-white px-1 transform duration-300 -translate-y-6 scale-75 top-0 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Season
                        </label>
                      </div>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="operating_hours" className="block text-sm font-medium text-gray-700">Operating Hours</label>
                      {fields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-4 gap-4 mb-4 items-center">
                          <select
                            {...register(`operating_hours.${index}.day_of_week`)}
                            className="block py-2 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          >
                            <option value="">Day of Week</option>
                            <option value="Sunday">Sunday</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                          <input
                            type="time"
                            {...register(`operating_hours.${index}.opening_time`)}
                            className="block py-2 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          />
                          <input
                            type="time"
                            {...register(`operating_hours.${index}.closing_time`)}
                            className="block py-2 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                          />
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
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <label htmlFor="image_paths" className="block text-sm font-medium leading-6 text-gray-900">
                        Cover photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                type="file"
                                multiple
                                className="sr-only"
                                {...register("image_paths", {
                                  onChange: handleFileChange,
                                })}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium text-gray-700">Uploaded Files:</h3>
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
                      <label htmlFor="published" className="ml-2 block text-sm leading-5 text-gray-900">
                        Publish
                      </label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        disabled={submitting}
                      >
                        {submitting ? 'Creating...' : 'Create Project'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </>
  );
};

export default CreateProjectModal;
